import * as React from 'react'
import capitalize from 'lodash/capitalize'
import { Portal } from '@radix-ui/react-portal'
import { EditorView } from 'prosemirror-view'
import { findDomRefAtPos, findParentNode } from 'prosemirror-utils'
import styled from 'styled-components'
import { EmbedDescriptor, MenuItem, ToastType } from '../types'
import VisuallyHidden from './VisuallyHidden'
import getDataTransferFiles from '../lib/getDataTransferFiles'
import filterExcessSeparators from '../lib/filterExcessSeparators'
import insertFiles from '../commands/insertFiles'
import baseDictionary from '../dictionary'
import { ScrollArea } from '@i4o/catalystui'

const SSR = typeof window === 'undefined'

const defaultPosition = {
	left: -1000,
	top: 0,
	bottom: undefined,
	isAbove: false,
}

export type Props<T extends MenuItem = MenuItem> = {
	rtl: boolean
	isActive: boolean
	commands: Record<string, any>
	dictionary: typeof baseDictionary
	view: EditorView
	search: string
	uploadImage?: (file: File) => Promise<string>
	onImageUploadStart?: () => void
	onImageUploadStop?: () => void
	onShowToast?: (message: string, id: string) => void
	onLinkToolbarOpen?: () => void
	onClose: () => void
	onClearSearch: () => void
	embeds?: EmbedDescriptor[]
	renderMenuItem: (
		item: T,
		index: number,
		options: {
			selected: boolean
			onClick: () => void
		}
	) => React.ReactNode
	filterable?: boolean
	items: T[]
	id?: string
}

type State = {
	insertItem?: EmbedDescriptor
	left?: number
	top?: number
	bottom?: number
	isAbove: boolean
	selectedIndex: number
}

// @ts-ignore
class CommandMenu<T = MenuItem> extends React.Component<Props<T>, State> {
	menuRef = React.createRef<HTMLDivElement>()
	inputRef = React.createRef<HTMLInputElement>()

	state: State = {
		left: -1000,
		top: 0,
		bottom: undefined,
		isAbove: false,
		selectedIndex: 0,
		insertItem: undefined,
	}

	componentDidMount() {
		if (!SSR) {
			window.addEventListener('keydown', this.handleKeyDown)
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (
			nextProps.search !== this.props.search ||
			nextProps.isActive !== this.props.isActive ||
			nextState !== this.state
		)
	}

	componentDidUpdate(prevProps) {
		if (!prevProps.isActive && this.props.isActive) {
			const position = this.calculatePosition(this.props)

			this.setState({
				insertItem: undefined,
				selectedIndex: 0,
				...position,
			})
		} else if (prevProps.search !== this.props.search) {
			this.setState({ selectedIndex: 0 })
		}
	}

	componentWillUnmount() {
		if (!SSR) {
			window.removeEventListener('keydown', this.handleKeyDown)
		}
	}

	handleKeyDown = (event: KeyboardEvent) => {
		if (!this.props.isActive) return

		if (event.key === 'Enter') {
			event.preventDefault()
			event.stopPropagation()

			const item = this.filtered[this.state.selectedIndex]

			if (item) {
				this.insertItem(item)
			} else {
				this.props.onClose()
			}
		}

		if (
			event.key === 'ArrowUp' ||
			(event.key === 'Tab' && event.shiftKey) ||
			(event.ctrlKey && event.key === 'p')
		) {
			event.preventDefault()
			event.stopPropagation()

			if (this.filtered.length) {
				const prevIndex = this.state.selectedIndex - 1
				const prev = this.filtered[prevIndex]

				this.setState({
					selectedIndex: Math.max(
						0,
						prev && prev.name === 'separator'
							? prevIndex - 1
							: prevIndex
					),
				})
			} else {
				this.close()
			}
		}

		if (
			event.key === 'ArrowDown' ||
			(event.key === 'Tab' && !event.shiftKey) ||
			(event.ctrlKey && event.key === 'n')
		) {
			event.preventDefault()
			event.stopPropagation()

			if (this.filtered.length) {
				const total = this.filtered.length - 1
				const nextIndex = this.state.selectedIndex + 1
				const next = this.filtered[nextIndex]

				this.setState({
					selectedIndex: Math.min(
						next && next.name === 'separator'
							? nextIndex + 1
							: nextIndex,
						total
					),
				})
			} else {
				this.close()
			}
		}

		if (event.key === 'Escape') {
			this.close()
		}
	}

	insertItem = (item) => {
		switch (item.name) {
			case 'image':
				return this.triggerImagePick()
			case 'embed':
				return this.triggerLinkInput(item)
			case 'link': {
				this.clearSearch()
				this.props.onClose()
				this.props.onLinkToolbarOpen?.()
				return
			}
			default:
				this.insertBlock(item)
		}
	}

	close = () => {
		this.props.onClose()
		this.props.view.focus()
	}

	handleLinkInputKeydown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (!this.props.isActive) return
		if (!this.state.insertItem) return

		if (event.key === 'Enter') {
			event.preventDefault()
			event.stopPropagation()

			const href = event.currentTarget.value
			const matches = this.state.insertItem.matcher(href)

			if (!matches && this.props.onShowToast) {
				this.props.onShowToast(
					this.props.dictionary.embedInvalidLink,
					ToastType.Error
				)
				return
			}

			this.insertBlock({
				name: 'embed',
				attrs: {
					href,
				},
			})
		}

		if (event.key === 'Escape') {
			this.props.onClose()
			this.props.view.focus()
		}
	}

	handleLinkInputPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
		if (!this.props.isActive) return
		if (!this.state.insertItem) return

		const href = event.clipboardData.getData('text/plain')
		const matches = this.state.insertItem.matcher(href)

		if (matches) {
			event.preventDefault()
			event.stopPropagation()

			this.insertBlock({
				name: 'embed',
				attrs: {
					href,
				},
			})
		}
	}

	triggerImagePick = () => {
		if (this.inputRef.current) {
			this.inputRef.current.click()
		}
	}

	triggerLinkInput = (item) => {
		this.setState({ insertItem: item })
	}

	handleImagePicked = (event) => {
		const files = getDataTransferFiles(event)

		const {
			view,
			uploadImage,
			onImageUploadStart,
			onImageUploadStop,
			onShowToast,
		} = this.props
		const { state } = view
		const parent = findParentNode((node) => !!node)(state.selection)

		this.clearSearch()

		if (!uploadImage) {
			throw new Error('uploadImage prop is required to replace images')
		}

		if (parent) {
			insertFiles(view, event, parent.pos, files, {
				uploadImage,
				onImageUploadStart,
				onImageUploadStop,
				onShowToast,
				dictionary: this.props.dictionary,
			})
		}

		if (this.inputRef.current) {
			this.inputRef.current.value = ''
		}

		this.props.onClose()
	}

	clearSearch = () => {
		this.props.onClearSearch()
	}

	insertBlock(item) {
		this.clearSearch()

		const command = this.props.commands[item.name]

		if (command) {
			command(item.attrs)
		} else {
			this.props.commands[`create${capitalize(item.name)}`](item.attrs)
		}

		this.props.onClose()
	}

	calculatePosition(props) {
		const { view } = props
		const { selection } = view.state
		let startPos
		try {
			startPos = view.coordsAtPos(selection.from)
		} catch (err) {
			console.warn(err)
			return defaultPosition
		}

		const caretPosition = () => {
			let fromPos
			let toPos
			try {
				fromPos = view.coordsAtPos(selection.from)
				toPos = view.coordsAtPos(selection.to, -1)
			} catch (err) {
				return {
					top: 0,
					bottom: 0,
					left: 0,
					right: 0,
				}
			}

			// ensure that start < end for the menu to be positioned correctly
			return {
				top: Math.min(fromPos.top, toPos.top),
				bottom: Math.max(fromPos.bottom, toPos.bottom),
				left: Math.min(fromPos.left, toPos.left),
				right: Math.max(fromPos.right, toPos.right),
			}
		}

		const ref = this.menuRef.current
		const offsetWidth = ref ? ref.offsetWidth : 0
		const offsetHeight = ref ? ref.offsetHeight : 0
		const { top, bottom, right, left } = caretPosition()
		const margin = 12

		const offsetParent = ref?.offsetParent
			? ref.offsetParent.getBoundingClientRect()
			: ({
					width: 0,
					height: 0,
					top: 0,
					left: 0,
			  } as DOMRect)

		let leftPos = Math.min(
			left - offsetParent.left,
			window.innerWidth - offsetParent.left - offsetWidth - margin
		)
		if (props.rtl) {
			leftPos = right - offsetWidth
		}

		if (top - offsetHeight > margin) {
			return {
				left: leftPos,
				top: undefined,
				bottom: offsetParent.bottom - top,
				right: undefined,
				isAbove: false,
			}
		} else {
			return {
				left: leftPos,
				top: bottom - offsetParent.top,
				bottom: undefined,
				right: undefined,
				isAbove: true,
			}
		}
	}

	get filtered() {
		const {
			embeds = [],
			search = '',
			uploadImage,
			commands,
			filterable = true,
		} = this.props
		let items: (EmbedDescriptor | MenuItem)[] = this.props.items
		const embedItems: EmbedDescriptor[] = []

		for (const embed of embeds) {
			if (embed.title && embed.icon) {
				embedItems.push({
					...embed,
					name: 'embed',
				})
			}
		}

		if (embedItems.length) {
			items.push({
				name: 'separator',
			})
			items = items.concat(embedItems)
		}

		const filtered = items.filter((item) => {
			if (item.name === 'separator') return true

			// Some extensions may be disabled, remove corresponding menu items
			if (
				item.name &&
				!commands[item.name] &&
				!commands[`create${capitalize(item.name)}`]
			) {
				return false
			}

			// If no image upload callback has been passed, filter the image block out
			if (!uploadImage && item.name === 'image') return false

			// some items (defaultHidden) are not visible until a search query exists
			if (!search) return !item.defaultHidden

			const n = search.toLowerCase()
			if (!filterable) {
				return item
			}
			return (
				(item.title || '').toLowerCase().includes(n) ||
				(item.keywords || '').toLowerCase().includes(n)
			)
		})

		return filterExcessSeparators(filtered)
	}

	render() {
		const { dictionary, isActive, uploadImage } = this.props
		const items = this.filtered
		const { insertItem, ...positioning } = this.state

		return (
			<Portal>
				<Wrapper
					id={this.props.id || 'block-menu-container'}
					active={isActive}
					ref={this.menuRef}
					{...positioning}
				>
					<ScrollArea className='ohm-w-full [&>div>div>div]:!ohm-p-2 [&>div>div>div>div]:!ohm-mt-0 [&>div>div>div>div>ol]:!ohm-py-0'>
						{insertItem ? (
							<div className='ohm-m-2'>
								<input
									className='ohm-w-full ohm-h-9 ohm-bg-transparent ohm-text-foreground'
									type='text'
									placeholder={
										insertItem.title
											? dictionary.pasteLinkWithTitle(
													insertItem.title
											  )
											: dictionary.pasteLink
									}
									onKeyDown={this.handleLinkInputKeydown}
									onPaste={this.handleLinkInputPaste}
									autoFocus
								/>
							</div>
						) : (
							<ol className='ohm-list-none ohm-text-left ohm-h-full ohm-py-2 ohm-px-0 ohm-m-0 ohm-space-y-px'>
								{items.map((item, index) => {
									if (item.name === 'separator') {
										return (
											<li
												className='ohm-p-0 ohm-m-0'
												key={index}
											>
												<hr />
											</li>
										)
									}
									const selected =
										index === this.state.selectedIndex &&
										isActive

									if (!item.title) {
										return null
									}

									return (
										<li
											className='ohm-p-0 ohm-m-0'
											key={index}
										>
											{this.props.renderMenuItem(
												item as any,
												index,
												{
													selected,
													onClick: () =>
														this.insertItem(item),
												}
											)}
										</li>
									)
								})}
								{items.length === 0 && (
									<li className='ohm-p-0 ohm-m-0'>
										<div className='ohm-flex ohm-items-center ohm-text-foreground-subtle ohm-font-semibold ohm-text-base ohm-h-9 ohm-px-4 ohm-py-0'>
											{dictionary.noResults}
										</div>
									</li>
								)}
							</ol>
						)}
						{uploadImage && (
							<VisuallyHidden>
								<input
									type='file'
									ref={this.inputRef}
									onChange={this.handleImagePicked}
									accept='image/*'
								/>
							</VisuallyHidden>
						)}
					</ScrollArea>
				</Wrapper>
			</Portal>
		)
	}
}

export const Wrapper = styled.div<{
	active: boolean
	top?: number
	bottom?: number
	left?: number
	isAbove: boolean
}>`
	position: absolute;
	z-index: ${(props) => props.theme.zIndex + 100};
	${(props) => props.top !== undefined && `top: ${props.top}px`};
	${(props) => props.bottom !== undefined && `bottom: ${props.bottom}px`};
	left: ${(props) => props.left}px;
	border-radius: 4px;
	box-shadow:
		rgba(0, 0, 0, 0.05) 0px 0px 0px 1px,
		rgba(0, 0, 0, 0.08) 0px 4px 8px,
		rgba(0, 0, 0, 0.08) 0px 2px 4px;
	opacity: 0;
	transform: scale(0.95);
	transition:
		opacity 150ms cubic-bezier(0.175, 0.885, 0.32, 1.275),
		transform 150ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
	transition-delay: 150ms;
	line-height: 0;
	pointer-events: none;
	white-space: nowrap;
	width: 300px;
	max-height: 240px;
	overflow: hidden;

	${({ active, isAbove }) =>
		active &&
		`
    transform: translateY(${isAbove ? '6px' : '-6px'}) scale(1);
    pointer-events: all;
    opacity: 1;
  `};

	@media print {
		display: none;
	}
`

export default CommandMenu
