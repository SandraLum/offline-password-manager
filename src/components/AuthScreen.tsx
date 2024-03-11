import { useEffect, useMemo, useState } from 'react'
import { Text, View, ViewStyle } from 'react-native'

import { ParamListBase, useNavigation } from '@react-navigation/native'
import { selectCurrentProfile } from '@src/store/slices/appSlice'
import { useSelector } from 'react-redux'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import * as ScreenCapture from 'expo-screen-capture'

import tw from '@src/libs/tailwind'
import { selectUserSettings } from '@src/store/slices/settingSlice'
import { usePreventScreenCapture } from 'expo-screen-capture'
import { ToastProvider } from '@src/common/contexts/ToastContext'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function AuthScreen({ children, personalizeHeader = false, style, headerShown = true, ...props }: any) {
	const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>()
	const currentProfile = useSelector(selectCurrentProfile)
	const { allowScreenCapture } = useSelector(selectUserSettings)

	usePreventScreenCapture()

	useEffect(() => {
		const init = async () => {
			if (allowScreenCapture) {
				await ScreenCapture.allowScreenCaptureAsync()
			} else {
				await ScreenCapture.preventScreenCaptureAsync()
			}
		}
		init()
	}, [allowScreenCapture])

	useEffect(() => {
		if (!headerShown) {
			navigation.setOptions({
				headerShown: false
			})
		} else if (personalizeHeader && currentProfile?.avatar?.color) {
			const color = currentProfile?.avatar?.color
			const backgroundColor = (currentProfile?.avatar?.style as ViewStyle)?.backgroundColor || 'white'

			const size = 200
			navigation.setOptions({
				headerTitleStyle: {
					color: tw.color('neutral-700')
				},
				headerBackground: () => {
					return (
						<View style={tw.style(`flex w-full h-full opacity-90`, { backgroundColor: color, overflow: 'hidden' })}>
							<View
								style={tw.style(`bg-white absolute rounded-full opacity-30`, {
									backgroundColor,
									top: '35%',
									left: '5%',
									width: size,
									height: size,
									transform: [{ scaleX: 3 }]
								})}
							/>
						</View>
					)
				}
			})
		}
	}, [personalizeHeader, currentProfile?.avatar?.color, currentProfile?.avatar?.style, navigation])

	return (
		<View style={tw.style({ backgroundColor: 'white' }, style)} {...props}>
			{children}
		</View>
	)
}
