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
					comment: 'var(--code-comment)',
					punctuation: 'var(--code-punctuation)',
					number: 'var(--code-number)',
					property: 'var(--code-property)',
					tag: 'var(--code-tag)',
					string: 'var(--code-string)',
					selector: 'var(--code-selector)',
					attr: 'var(--code-attr)',
					entity: 'var(--code-entity)',
					keyword: 'var(--code-keyword)',
					function: 'var(--code-function)',
					statement: 'var(--code-statement)',
					placeholder: 'var(--code-placeholder)',
					inserted: 'var(--code-inserted)',
					important: 'var(--code-important)',
				},

				foreground: {
					DEFAULT: 'hsl(var(--foreground) / <alpha-value>)',
					subtle: 'hsl(var(--foreground-subtle) / <alpha-value>)',
					muted: 'hsl(var(--foreground-muted) / <alpha-value>)',
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
			listStyleType: {
				'lower-alpha': 'lower-alpha',
				'lower-roman': 'lower-roman',
			},
		},
	},
}
