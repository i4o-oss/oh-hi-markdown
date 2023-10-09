import { useEffect, useRef, useState } from 'react'
import { EditorState } from 'prosemirror-state'
import {
	defaultMarkdownParser,
	defaultMarkdownSerializer,
	schema,
} from 'prosemirror-markdown'
import { exampleSetup } from 'prosemirror-example-setup'
import { EditorView } from 'prosemirror-view'
import { EditorProps } from './types'

const OhHiMarkdown = ({
	defaultValue = '',
	onChange: onContentChange,
}: EditorProps) => {
	const editorRef = useRef<HTMLDivElement>(null)
	const contentRef = useRef<string>(defaultValue)
	const [myState, setMyState] = useState<EditorState>()
	const view = useRef<EditorView>(null)

	useEffect(() => {
		const myState = EditorState.create({
			// @ts-ignore
			doc: defaultMarkdownParser.parse(contentRef.current),
			plugins: exampleSetup({ schema }),
		})
		// @ts-ignore
		view.current = new EditorView(editorRef.current, {
			state: myState,
			dispatchTransaction: (tr) => {
				const newState = view.current?.state.apply(tr) as EditorState
				view.current?.updateState(newState)
				setMyState(newState)
			},
		})
		return () => view.current?.destroy()
	}, [])

	useEffect(() => {
		if (myState) {
			// @ts-ignore
			contentRef.current = defaultMarkdownSerializer.serialize(
				myState?.doc
			)
			onContentChange(contentRef.current)
		}
	}, [myState])

	return (
		<div
			className='ohm-w-full ohm ohm-prose ohm-prose-lg ohm-max-w-none dark:ohm-prose-invert prose-pre:ohm-not-prose'
			id='editor'
			// dir={dir}
			// rtl={isRTL}
			// readOnly={readOnly}
			// readOnlyWriteCheckboxes={readOnlyWriteCheckboxes}
			ref={editorRef}
		/>
	)
}

export default OhHiMarkdown
