import * as React from 'react'
import {EditorView} from 'prosemirror-view'
import LinkEditor, {SearchResult} from './LinkEditor'
import FloatingToolbar from './FloatingToolbar'
import createAndInsertLink from '../commands/createAndInsertLink'
import baseDictionary from '../dictionary'
import {useEffect, useRef, useState} from "react";

type Props = {
    isActive: boolean
    view: EditorView
    tooltip: typeof React.Component | React.FC<any>
    dictionary: typeof baseDictionary
    onCreateLink?: (title: string) => Promise<string>
    onSearchLink?: (term: string) => Promise<SearchResult[]>
    onClickLink: (href: string, event: MouseEvent) => void
    onShowToast?: (msg: string, code: string) => void
    onClose: () => void
}

function isActive(props: Props) {
    const {view} = props
    const {selection} = view.state

    try {
        const paragraph = view.domAtPos(selection.from)
        return props.isActive && !!paragraph.node
    } catch (err) {
        return false
    }
}

export default function LinkToolbar(props: Props) {
    const menuRef = useRef<HTMLDivElement>(null)
    const [left, setLeft] = useState(-1000)
    const [top, setTop] = useState<number>()
    const {onCreateLink, onClose, ...rest} = props
    const {selection} = props.view.state
    const active = isActive(props)


    useEffect(() => {
        if (window) {
            window.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            window.removeEventListener('mousedown', handleClickOutside)
        }
    }, []);

    const handleClickOutside = (ev) => {
        if (
            ev.target &&
            menuRef.current &&
            menuRef.current.contains(ev.target)
        ) {
            return
        }

        props.onClose()
    }

    const handleOnCreateLink = async (title: string) => {
        const {dictionary, onCreateLink, view, onClose, onShowToast} =
            props

        onClose()
        view.focus()

        if (!onCreateLink) {
            return
        }

        const {dispatch, state} = view
        const {from, to} = state.selection
        if (from !== to) {
            // selection must be collapsed
            return
        }

        const href = `creating#${title}…`

        // Insert a placeholder link
        dispatch(
            view.state.tr
                .insertText(title, from, to)
                .addMark(
                    from,
                    to + title.length,
                    state.schema.marks.link.create({href})
                )
        )

        createAndInsertLink(view, title, href, {
            onCreateLink,
            onShowToast,
            dictionary,
        })
    }

    const handleOnSelectLink = ({ href, title }: {
        href: string
        title: string
        from: number
        to: number
    }) => {
        const {view, onClose} = props

        onClose()
        props.view.focus()

        const {dispatch, state} = view
        const {from, to} = state.selection
        if (from !== to) {
            // selection must be collapsed
            return
        }

        dispatch(
            view.state.tr
                .insertText(title, from, to)
                .addMark(
                    from,
                    to + title.length,
                    state.schema.marks.link.create({href})
                )
        )
    }

    return (
        <FloatingToolbar ref={menuRef} active={active} {...rest}>
            {active && (
                <LinkEditor
                    // @ts-ignore
                    from={selection.from}
                    to={selection.to}
                    onCreateLink={
                        onCreateLink ? handleOnCreateLink : undefined
                    }
                    onSelectLink={handleOnSelectLink}
                    onRemoveLink={onClose}
                    {...rest}
                />
            )}
        </FloatingToolbar>
    )
}
