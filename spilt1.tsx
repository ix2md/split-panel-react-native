import React from 'react';
import { Pressable, Text, View } from 'react-native';

import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

type Props = {
    onPressPosition: (index: 0 | 1 | 2) => void;
};

const ScaleButton = ({
    label,
    onPress,
}: {
    label: string;
    onPress: () => void;
}) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <Pressable
            onPressIn={() => {
                scale.value = withTiming(0.9, { duration: 100 });
            }}
            onPressOut={() => {
                scale.value = withTiming(1, { duration: 100 });
            }}
            onPress={onPress}
        >
            <Animated.View
                style={[
                    {
                        backgroundColor: "#eee",
                        height: 100,
                        width: 100,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 12,
                    },
                    animatedStyle,
                ]}
            >
                <Text style={{ fontWeight: "bold", fontSize: 20 }}>{label}</Text>
            </Animated.View>
        </Pressable>
    );
};

export default function Spilt1({ onPressPosition }: Props) {
    return (
        <View
            style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
                backgroundColor: "#fff",
                borderBottomLeftRadius: 16,
                borderBottomRightRadius: 16,
            }}
        >
            <ScaleButton label="1/4" onPress={() => onPressPosition(0)} />
            <ScaleButton label="1/2" onPress={() => onPressPosition(1)} />
            <ScaleButton label="3/4" onPress={() => onPressPosition(2)} />
        </View>
    );
}
