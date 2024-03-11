/* eslint-disable @typescript-eslint/no-unused-vars */
import tw from '@src/libs/tailwind'
import { CategoryId } from '@src/common/enums'
import { OPMTypes } from '@src/common/types'
import { setIdFormat } from '../utils'

export const Categories: OPMTypes.TemplateCategory[] = [
	{
		id: CategoryId.AllItems,
		name: 'All Items',
		icon: {
			name: 'format-list-bulleted-type',
			bgColor: tw.color('zinc-200'),
			color: tw.color('neutral-800')
		}
		// type: CategoryType.AllItems
	},
	{
		id: CategoryId.Login,
		name: 'Login',
		icon: {
			name: 'key-variant',
			bgColor: tw.color('cyan-500'),
			color: tw.color('neutral-100')
		}
		// type: CategoryType.Login
	},
	{
		id: CategoryId.Banking,
		name: 'Banking',
		icon: {
			name: 'currency-usd',
			bgColor: tw.color('yellow-500'),
			color: tw.color('neutral-100')
		}
		// type: CategoryType.Banking
	},
	{
		id: CategoryId.Email,
		name: 'Email',
		icon: {
			name: 'email',
			bgColor: tw.color('rose-500'),
			color: tw.color('neutral-100')
		}
		// type: CategoryType.Email
	},
	{
		id: CategoryId.CreditCard,
		name: 'Credit Cards',
		icon: {
			name: 'credit-card',
			bgColor: tw.color('sky-500'),
			color: tw.color('neutral-100')
		}
		// type: CategoryType.CreditCard
	},
	{
		id: CategoryId.Office,
		name: 'Office',
		icon: {
			name: 'desktop-tower-monitor',
			bgColor: tw.color('green-400'),
			color: tw.color('neutral-100')
		}
		// type: CategoryType.Office
	},
	{
		id: CategoryId.Password,
		name: 'Password',
		icon: {
			name: 'form-textbox-password',
			bgColor: tw.color('orange-500'),
			color: tw.color('neutral-100')
		}
		// type: CategoryType.Password
	},
	{
		id: CategoryId.School,
		name: 'School',
		icon: {
			name: 'school',
			bgColor: tw.color('violet-400'),
			color: tw.color('neutral-100')
		}
		// type: CategoryType.School
	}
]
