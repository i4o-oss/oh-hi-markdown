import type { LinksFunction } from '@remix-run/node'
import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from '@remix-run/react'
import ohmStyles from '@i4o/ohm/main.css'
import styles from '~/main.css'

export const links: LinksFunction = () => [
	{ rel: 'preconnect', href: 'https://fonts.googleapis.com' },
	{ rel: 'preconnect', href: 'https://fonts.gstatic.com' },
	{
		rel: 'stylesheet',
		href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Merriweather:ital,wght@0,400;0,700;1,400;1,700&family=Source+Code+Pro&display=swap',
		crossOrigin: 'anonymous',
	},
	{ rel: 'stylesheet', href: ohmStyles },
	{ rel: 'stylesheet', href: styles },
]

export default function App() {
	return (
		<html className='ohm-dark dark' lang='en'>
			<head>
				<meta charSet='utf-8' />
				<meta
					name='viewport'
					content='width=device-width,initial-scale=1'
				/>
				<title>oh-hi-markdown Demo</title>
				<Meta />
				<Links />
			</head>
			<body className='h-screen w-screen overflow-x-hidden bg-white dark:bg-[#090909]'>
				<Outlet />
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	)
}
