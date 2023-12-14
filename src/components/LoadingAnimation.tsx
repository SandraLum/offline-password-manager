import { ReactNode, useEffect } from 'react'
import Animated, {
	AnimationCallback,
	Easing,
	interpolateColor,
	runOnJS,
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withSequence,
	withSpring,
	withTiming
} from 'react-native-reanimated'
import tw from 'twrnc'

type Props = {
	children?: ReactNode | undefined
	height?: number | undefined
	width?: number | undefined
	backgroundColor?: string
	borderRadius?: number | undefined
	duration?: number | undefined
	style?: {} | undefined
	bounce?: boolean
	startMorph?: boolean
	morphOptions?: { backgroundColor?: string; borderRadius?: number; callBack?: AnimationCallback } | undefined
}

export default function LoadingAnimation({
	children,
	height = 120,
	width = 120,
	backgroundColor = tw.color('yellow-200'), //'#b58df1',
	borderRadius = 20,
	duration = 2000,
	style = {},
	bounce = false,
	startMorph = false,
	morphOptions
}: Props) {
	duration = duration || 2000
	const easing = Easing.bezier(0.25, -0.5, 0.25, 1)
	const sv = useSharedValue(0)
	const sh = useSharedValue(height)
	const sw = useSharedValue(width)
	const sbr = useSharedValue(borderRadius)
	const sbgc = useSharedValue(0)

	useEffect(() => {
		sv.value = withRepeat(withTiming(1, { duration, easing }), -1)
		sbgc.value = 0
		sbr.value = borderRadius
	}, [])

	useEffect(() => {
		if (startMorph) {
			if (morphOptions?.borderRadius) {
				sbr.value = morphOptions?.borderRadius
			}
			if (morphOptions?.backgroundColor) {
				sbgc.value = withTiming(1, { duration: 1000 }, () => {
					if (morphOptions?.callBack) {
						runOnJS(morphOptions.callBack)()
					}
				})
			}
		}
	}, [startMorph])

	useEffect(() => {
		if (bounce) {
			const percentage = 1.25
			sh.value = withRepeat(withTiming(height * percentage, { duration: 500 }), -1, true)
			sw.value = withRepeat(withTiming(width * percentage * 1.13, { duration: 500 }), -1, true)
		} else {
			sh.value = height
			sw.value = width
		}
	}, [bounce])

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ rotate: `${sv.value * 360}deg` }],
		borderRadius: withTiming(sbr.value, {
			duration: 1500,
			easing: Easing.linear
		}),
		height: sh.value,
		width: sw.value,
		backgroundColor:
			morphOptions?.backgroundColor && backgroundColor
				? interpolateColor(sbgc.value, [0, 1], [backgroundColor, morphOptions.backgroundColor])
				: backgroundColor
	}))

	return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
}
