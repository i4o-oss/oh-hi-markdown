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
		<div className='flex w-full justify-center'>
			<div className='flex w-full max-w-3xl flex-col gap-y-16 py-16'>
				<h1 className='text-xl'>Welcome to Remix</h1>
				{/*
                // @ts-ignore */}
				<Editor
					placeholder='Start Writing...'
					value={content.current}
					onChange={changeHandler}
				/>
			</div>
		</div>
	)
}
