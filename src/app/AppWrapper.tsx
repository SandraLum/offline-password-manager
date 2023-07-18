import React, { ReactNode } from 'react'
import { View } from 'react-native'
import tw from 'twrnc'
import { SafeAreaView } from 'react-native-safe-area-context'

import SessionLoginModal from '@src/components/SessionLoginModal'
import { NavigationContainerRefWithCurrent } from '@react-navigation/core/lib/typescript/src/types'

type Props = {
	children: ReactNode
	isAuthenticated: boolean
	rootNavigation: NavigationContainerRefWithCurrent<ReactNavigation.RootParamList>
}

export default function AppWrapper({ rootNavigation, isAuthenticated, children }: Props) {
	return (
		// <SafeAreaView style={tw`flex-1`} forceInset={{ top: 'never' }} edges={['top', 'left', 'right']}>
		<View style={tw`flex-1`}>
			{children}

			<SessionLoginModal rootNavigation={rootNavigation} isAuthenticated={isAuthenticated} />
		</View>
		//  </SafeAreaView>
	)
}
