import { useState } from 'react'
import { View } from 'react-native'
import { Text, Searchbar } from 'react-native-paper'

import { i18n } from '@src/app/locale'
import tw from 'twrnc'

export default function Settings() {
	const [searchQuery, setSearchQuery] = useState('')

	const onChangeSearch = query => setSearchQuery(query)

	return (
		<View style={tw`flex-1 justify-center`}>
			<Searchbar placeholder="Search" onChangeText={onChangeSearch} value={searchQuery} />
			<Text>{i18n.t('navigation.:label:settings')}</Text>
		</View>
	)
}
