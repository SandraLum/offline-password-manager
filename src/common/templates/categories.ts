/* eslint-disable @typescript-eslint/no-unused-vars */
import tw from 'twrnc'
import { CategoryType } from '@src/common/enums'
import { OPMTypes } from '@src/common/types'

type Categories = {
	[key: string]: Omit<OPMTypes.TemplateCategory, 'type'> & { type: CategoryType }
}

const setIdFormat = (id: string) => `[${id}]`

export const Categories: OPMTypes.TemplateCategory[] = [
	{
		// id: setIdFormat(CategoryType.AllItems),
		name: 'All Items',
		icon: {
			name: 'format-list-bulleted-type',
			bgColor: tw.color('zinc-200'),
			color: tw.color('neutral-800')
		},
		type: CategoryType.AllItems
	},
	{
		// id: setIdFormat(CategoryType.Login),
		name: 'Login',
		icon: {
			name: 'key-variant',
			bgColor: tw.color('cyan-500'),
			color: tw.color('neutral-100')
		},
		type: CategoryType.Login
	},
	{
		// id: setIdFormat(CategoryType.Banking),
		name: 'Banking',
		icon: {
			name: 'currency-usd',
			bgColor: tw.color('yellow-500'),
			color: tw.color('neutral-100')
		},
		type: CategoryType.Banking
	},
	{
		// id: setIdFormat(CategoryType.Email),
		name: 'Email',
		icon: {
			name: 'email',
			bgColor: tw.color('rose-500'),
			color: tw.color('neutral-100')
		},
		type: CategoryType.Email
	},
	{
		// id: setIdFormat(CategoryType.CreditCard),
		name: 'Credit Cards',
		icon: {
			name: 'credit-card',
			bgColor: tw.color('sky-500'),
			color: tw.color('neutral-100')
		},
		type: CategoryType.CreditCard
	},
	{
		// id: setIdFormat(CategoryType.Office),
		name: 'Office',
		icon: {
			name: 'desktop-tower-monitor',
			bgColor: tw.color('green-400'),
			color: tw.color('neutral-100')
		},
		type: CategoryType.Office
	},
	{
		// id: setIdFormat(CategoryType.Password),
		name: 'Password',
		icon: {
			name: 'password',
			bgColor: tw.color('orange-500'),
			color: tw.color('neutral-100')
		},
		type: CategoryType.Password
	},
	{
		// id: setIdFormat(CategoryType.School),
		name: 'School',
		icon: {
			name: 'school',
			bgColor: tw.color('violet-400'),
			color: tw.color('neutral-100')
		},
		type: CategoryType.School
	}
]
