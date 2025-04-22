/** @type {import('tailwindcss').Config} */
export default {
	content: [
	  "./index.html",
	  "./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
	  extend: {
		colors: {
		  primary: '#99BC85',
		  secondary: '#C1C2C0',
		  cream: '#FAF1E6',
		  background: '#FDFAF6',
		}
	  },
	},
	plugins: [],
  }