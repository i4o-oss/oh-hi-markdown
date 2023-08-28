/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	prefix: 'ohm-',
	plugins: [require('@tailwindcss/typography')],
	theme: {
		extend: {},
	},
}
