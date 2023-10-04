import { ScrollView } from 'react-native'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Content({ children, contentContainerStyle, ...props }: any) {
	return (
		<ScrollView
			horizontal={false}
			showsVerticalScrollIndicator={true}
			showsHorizontalScrollIndicator={false}
			contentContainerStyle={contentContainerStyle}
			{...props}
		>
			{children}
		</ScrollView>
	)
}
