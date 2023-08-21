import { View } from 'react-native'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Screen({ children, ...props }: any) {
	return <View {...props}>{children}</View>
}
