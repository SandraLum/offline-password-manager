import tw from 'twrnc'
import { View } from 'react-native'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Container({ style = {}, children, ...props }: any) {
	return (
		<View style={tw.style('flex-1', style)} {...props}>
			{children}
		</View>
	)
}
