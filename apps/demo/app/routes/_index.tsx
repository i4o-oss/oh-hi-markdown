import type { V2_MetaFunction } from '@remix-run/node'
import Editor from '@i4o/ohm'
import { useRef } from 'react'

export const meta: V2_MetaFunction = () => {
	return [
		{ title: 'New Remix App' },
		{ name: 'description', content: 'Welcome to Remix!' },
	]
}

export default function Index() {
	const content = useRef<string>('')

	const changeHandler = (value: string) => {
		content.current = value
	}

	return (
		<div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }}>
			<h1>Welcome to Remix</h1>
			{/* 
            // @ts-ignore */}
			<Editor value={content.current} onChange={changeHandler} />
		</div>
	)
}
