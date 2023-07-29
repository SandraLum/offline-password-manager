import { useRef, useEffect, useState } from 'react'

import { useSelector } from 'react-redux'
import { Text, FlatList, View } from 'react-native'
import { Button, Card } from 'react-native-paper'

import tw from 'twrnc'

import { MaterialCommunityIcons } from '@expo/vector-icons'

export default function CategoryIcon(props: OPM.CategoryIcon) {
	const {
		name,
		color = tw.color('gray-200'),
		backgroundColor = tw.color('gray-700'),
		size = 32,
		padding = 2,
		style
	} = props

	const iconSize = size * 0.7
	const iconWH = size + padding

	return (
		<MaterialCommunityIcons
			name={name}
			size={iconSize}
			color={color}
			style={tw.style(
				`rounded-full`,
				{
					width: iconWH,
					height: iconWH,
					backgroundColor: backgroundColor,
					textAlign: 'center',
					verticalAlign: 'middle'
				},
				style
			)}
		/>
	)
}
