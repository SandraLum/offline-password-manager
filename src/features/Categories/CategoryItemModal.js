import { useState, useRef, useImperativeHandle, forwardRef } from 'react'
import { useSelector } from 'react-redux'
import { View, ScrollView, FlatList } from 'react-native'
import { Text, Button, Avatar, Card, IconButton, Badge, Menu, Divider, Modal } from 'react-native-paper'
import tw from '@src/libs/tailwind'
import { i18n } from '@src/app/locale'

// SL TODO: For editing category?
const CategoryItemModal = forwardRef(function AddCategoryItemModal(_props, ref) {
	const [visible, setVisible] = useState(false)
	const [category, setCategory] = useState({})

	const showModal = () => setVisible(true)
	const hideModal = () => setVisible(false)

	useImperativeHandle(ref, () => ({
		show(category) {
			setCategory(category)
			showModal()
		},
		hide() {
			hideModal()
		}
	}))

	return (
		<Modal visible={visible} onDismiss={hideModal} contentContainerStyle={tw`bg-white p-5 m-3`}>
			<View>
				<Text>{category.name}</Text>
			</View>
		</Modal>
	)
})

export default CategoryItemModal
