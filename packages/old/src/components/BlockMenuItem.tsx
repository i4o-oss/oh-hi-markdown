import * as React from 'react'
import scrollIntoView from 'smooth-scroll-into-view-if-needed'
import theme from '../styles/theme'
import { withTheme } from 'styled-components'

export type Props = {
	selected: boolean
	disabled?: boolean
	onClick: () => void
	theme: typeof theme
	icon?: typeof React.Component | React.FC<any>
	title: React.ReactNode
	shortcut?: string
	containerId?: string
}

function BlockMenuItem({
	selected,
	disabled,
	onClick,
	title,
	shortcut,
	icon,
	containerId = 'block-menu-container',
}: Props) {
	const Icon = icon

	const ref = React.useCallback(
		(node) => {
			if (selected && node) {
				scrollIntoView(node, {
					scrollMode: 'if-needed',
					block: 'center',
					boundary: (parent) => {
						// All the parent elements of your target are checked until they
						// reach the #block-menu-container. Prevents body and other parent
						// elements from being scrolled
						return parent.id !== containerId
					},
				})
			}
		},
		[selected, containerId]
	)

	return (
		<button
			className={`ohm-flex ohm-items-center ohm-justify-start ohm-text-sm ohm-rounded-md ohm-w-full ohm-h-9 ohm-cursor-pointer ohm-border-none ohm-text-foreground ${
				disabled ? 'ohm-opacity-50' : 'ohm-opacity-100'
			} ${
				selected
					? 'ohm-text-foreground ohm-bg-primary'
					: 'ohm-text-foreground'
			} ohm-py-0 ohm-px-4 ohm-outline-none hover:ohm-text-foreground hover:ohm-bg-primary`}
			onClick={disabled ? undefined : onClick}
			ref={ref}
		>
			{Icon && (
				<>
					<Icon
						className={`${
							selected
								? 'ohm-text-foreground'
								: 'ohm-text-foreground'
						}`}
						color={
							selected
								? theme.blockToolbarIconSelected
								: theme.blockToolbarIcon
						}
					/>
					&nbsp;&nbsp;
				</>
			)}
			{title}
			{shortcut && (
				<span className='ohm-text-foreground-subtle ohm-grow ohm-text-right'>
					{shortcut}
				</span>
			)}
		</button>
	)
}

// const MenuItem = styled.button<{
// 	selected: boolean
// }>`
// 	line-height: 1;
// 	color: ${(props) =>
// 		props.selected
// 			? props.theme.blockToolbarTextSelected
// 			: props.theme.blockToolbarText};
// 	background: ${(props) =>
// 		props.selected
// 			? props.theme.blockToolbarSelectedBackground ||
// 			  props.theme.blockToolbarTrigger
// 			: 'none'};
//
// 	&:hover,
// 	&:active {
// 		color: ${(props) => props.theme.blockToolbarTextSelected};
// 		background: ${(props) =>
// 			props.selected
// 				? props.theme.blockToolbarSelectedBackground ||
// 				  props.theme.blockToolbarTrigger
// 				: props.theme.blockToolbarHoverBackground};
// 	}
// `

export default withTheme(BlockMenuItem)
