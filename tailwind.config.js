// const colors = require('tailwindcss/colors')
import { colors } from 'tailwindcss/colors'

module.exports = {
	theme: {
		colors: {
			transparent: 'transparent'
			// current: 'currentColor',
			// black: colors.black,
			// white: colors.white,
			// gray: colors.gray,
			// emerald: colors.emerald,
			// indigo: colors.indigo,
			// yellow: colors.yellow
		},
		dropShadow: {
			sm: {
				shadowColor: '#000',
				shadowOffset: {
					width: 1,
					height: 1
				},
				shadowOpacity: 0.4,
				shadowRadius: 4,
				elevation: 5
			},
			DEFAULT: {
				shadowColor: '#000',
				shadowOffset: {
					width: 1,
					height: 1
				},
				shadowOpacity: 0.4,
				shadowRadius: 4,
				elevation: 7
			},
			md: {
				shadowColor: '#000',
				shadowOffset: {
					width: 1,
					height: 1
				},
				shadowOpacity: 0.6,
				shadowRadius: 10,
				elevation: 10
			},
			lg: {
				shadowColor: '#000',
				shadowOffset: {
					width: 1,
					height: 1
				},
				shadowOpacity: 0.6,
				shadowRadius: 10,
				elevation: 15
			},
			xl: {
				shadowColor: '#000',
				shadowOffset: {
					width: 1,
					height: 1
				},
				shadowOpacity: 0.6,
				shadowRadius: 10,
				elevation: 20
			},
			'2xl': {
				shadowColor: '#000',
				shadowOffset: {
					width: 1,
					height: 1
				},
				shadowOpacity: 0.6,
				shadowRadius: 10,
				elevation: 24
			},
			none: {}
		}
		// dropShadow: {
		// 	sm: '0 1px 1px rgb(0 0 0 / 0.05)',
		// 	DEFAULT: ['0 1px 2px rgb(0 0 0 / 0.1)', '0 1px 1px rgb(0 0 0 / 0.06)'],
		// 	md: ['0 4px 3px rgb(0 0 0 / 0.07)', '0 2px 2px rgb(0 0 0 / 0.06)'],
		// 	lg: ['0 10px 8px rgb(0 0 0 / 0.04)', '0 4px 3px rgb(0 0 0 / 0.1)'],
		// 	xl: ['0 20px 13px rgb(0 0 0 / 0.03)', '0 8px 5px rgb(0 0 0 / 0.08)'],
		// 	'2xl': '0 25px 25px rgb(0 0 0 / 0.15)',
		// 	none: '0 0 #0000',
		//   },
	}
}
