import { useEffect } from 'react'
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated'
import tw from 'twrnc'

export default function LoadingAnimation({
	height = 120,
	width = 120,
	backgroundColor = tw.color('yellow-200'), //'#b58df1',
	borderRadius = 20,
	style = {}
}) {
	const duration = 2000
	const easing = Easing.bezier(0.25, -0.5, 0.25, 1)
	const sv = useSharedValue(0)

	const baseStyle = {
		height: height,
		width: width,
		backgroundColor: backgroundColor,
		borderRadius: borderRadius
	}

	useEffect(() => {
		sv.value = withRepeat(withTiming(1, { duration, easing }), -1)
	}, [])

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ rotate: `${sv.value * 360}deg` }]
	}))

	return <Animated.View style={[baseStyle, style, animatedStyle]} />
}
