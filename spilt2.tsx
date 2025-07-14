import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
    FadeInUp,
    FadeOut,
    interpolate,
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';

type Props = {
    translateY: Animated.SharedValue<number>,
    positions: number[],
    currentIndex: number,
    onPressPosition: (index: 0 | 1 | 2) => void;

}

export default function Spilt2({ translateY, positions, currentIndex, onPressPosition }: Props) {
    const AnimatedPressable = Animated.createAnimatedComponent(Pressable)
    const animatedBoxStyle = useAnimatedStyle(() => {

        const size = interpolate(
            translateY.value,
            [positions[0], positions[1], positions[2]],
            [180, 120, 80],

        )
        const color = interpolateColor(
            translateY.value,
            [positions[0], positions[1], positions[2]],
            ["#3d56e5", "#f3b606", "#c70404"],

        )

        return {
            height: size,
            width: size,
            backgroundColor: color
        }
    })

    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <View style={{
            flex: 1,
            backgroundColor: "#fff",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16
        }}>
            {currentIndex === 0 && (
                <AnimatedPressable
                    onPressIn={() => {
                        scale.value = withTiming(0.9, { duration: 100 });
                    }}
                    onPressOut={() => {
                        scale.value = withTiming(1, { duration: 100 });
                    }}
                    onPress={() => onPressPosition(1)}
                    entering={FadeInUp}
                    exiting={FadeOut}
                    style={[{
                        marginTop: 16,
                        alignItems: "center",
                        justifyContent: "center",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0
                    }, animatedStyle]}>
                    <Text style={{
                        paddingHorizontal: 16,
                        paddingVertical: 5,
                        backgroundColor: '#eee',
                        borderRadius: 999,
                        fontWeight: "bold",
                    }}>Close</Text>
                </AnimatedPressable>
            )}
            <View style={{
                flex: 1,

                justifyContent: "center",
                alignItems: "center",
            }}>
                <Animated.View style={[
                    {
                        borderRadius: 12,
                    },
                    animatedBoxStyle
                ]} />
            </View>
        </View>
    )
}

