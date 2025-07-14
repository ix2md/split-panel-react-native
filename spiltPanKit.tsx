import React from 'react';
import { Dimensions, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
    runOnJS,
    useAnimatedReaction,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

import Spilt1 from '@/components/spiltPanKit/spilt1';
import Spilt2 from '@/components/spiltPanKit/spilt2';

export default function SpiltPanKit() {
    const { height } = Dimensions.get("screen");
    const [currentIndex, setCurrentIndex] = React.useState(1);
    const positions = [height * 0.2, height * 0.4, height * 0.65];
    const translateY = useSharedValue(positions[1]);
    const startY = useSharedValue(translateY.value);

    const gesture = Gesture.Pan()
        .onStart(() => {
            startY.value = translateY.value;
        })
        .onUpdate((event) => {
            const raw = startY.value + event.translationY;

            const min = positions[0];
            const max = positions[2];

            if (raw < min) {

                translateY.value = min - Math.pow(min - raw, 0.7);
            } else if (raw > max) {

                translateY.value = max + Math.pow(raw - max, 0.7);
            } else {
                translateY.value = raw;
            }
        })
        .onEnd(() => {

            const closest = positions.reduce((prev, curr) =>
                Math.abs(curr - translateY.value) < Math.abs(prev - translateY.value)
                    ? curr
                    : prev
            );


            translateY.value = withSpring(closest, {
                damping: 20,
                stiffness: 150,
            });
        });

    const topStyle = useAnimatedStyle(() => ({
        height: translateY.value,
    }));

    const dividerStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    const bottomStyle = useAnimatedStyle(() => ({
        top: translateY.value + 30,
        bottom: 0,
    }));
    useAnimatedReaction(
        () => translateY.value,
        (value) => {
            const closest = positions.reduce((prev, curr) =>
                Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
            );
            const index = positions.indexOf(closest);
            runOnJS(setCurrentIndex)(index);
        },
        [positions]
    );

    return (
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#eee" }}>
            <GestureDetector gesture={gesture}>
                <View style={{ flex: 1 }}>
                    <Animated.View style={[{ width: '100%', position: 'absolute' }, topStyle]}>
                        <Spilt1 onPressPosition={(index) => {
                            translateY.value = withSpring(positions[index], { damping: 20 });
                        }} />
                    </Animated.View>


                    <Animated.View
                        style={[
                            dividerStyle,
                            {
                                position: 'absolute',
                                width: '100%',
                                height: 30,
                                zIndex: 10,
                                alignItems: "center",
                                justifyContent: "center"
                            },
                        ]}
                    >
                        <View style={{ width: 60, height: 7, backgroundColor: "#999", borderRadius: 9999 }} />
                    </Animated.View>


                    <Animated.View
                        style={[
                            {
                                position: 'absolute',
                                width: '100%',
                            },
                            bottomStyle,
                        ]}
                    >
                        <Spilt2 translateY={translateY} positions={positions} currentIndex={currentIndex} onPressPosition={(index) => {
                            translateY.value = withSpring(positions[index], { damping: 20 });
                        }} />
                    </Animated.View>
                </View>
            </GestureDetector>
        </GestureHandlerRootView>
    );
}
