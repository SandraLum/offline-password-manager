import { useState } from 'react'

import { IconButton, Menu, Divider } from 'react-native-paper'

import tw from '@src/libs/tailwind'
import { i18n } from '@src/app/locale'

export default function VertMenu(props) {
	// eslint-disable-next-line no-unused-vars
	const { data, ...iconProps } = props

	const [visible, setVisible] = useState(false)
	const openMenu = () => setVisible(true)
	const closeMenu = () => setVisible(false)

	return (
		<Menu
			visible={visible}
			onDismiss={closeMenu}
			anchor={<IconButton {...iconProps} icon="dots-vertical" onPress={openMenu} style={tw`m-0`} />}
		>
			<Menu.Item onPress={() => {}} title={i18n.t('categories:card:menu:edit-category')} />
			<Menu.Item onPress={() => {}} title={i18n.t('categories:card:menu:delete-category')} />
			{/* <Divider />
			<Menu.Item onPress={closeMenu} title={i18n.t('categories:card:menu:close')} /> */}
		</Menu>
	)
}
