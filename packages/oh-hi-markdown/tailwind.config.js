/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	darkMode: 'class',
	prefix: 'ohm-',
	plugins: [require('@tailwindcss/typography')],
	theme: {
		extend: {
			colors: {
				code: {
					DEFAULT: 'hsl(var(--code-bg) / <alpha-value>)',
					border: 'hsl(var(--code-border) / <alpha-value>)',
				},

				foreground: {
					DEFAULT: 'hsl(var(--foreground) / <alpha-value>)',
					subtle: 'hsl(var(--foreground-subtle) / <alpha-value>)',
				},
				primary: {
					DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
				},
			},
			fontFamily: {
				mono: 'var(--font-mono)',
				sans: 'var(--font-sans)',
				serif: 'var(--font-serif)',
			},
		},
	},
}
