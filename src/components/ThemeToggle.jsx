import React, { useRef } from "react";
import { TouchableOpacity, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { useTheme } from "../context/ThemeProvider";


export function ThemeToggle() {

    // -------------------------- Hooks --------------------------------
    const { isTemaEscuro, alterarTema, cores } = useTheme();


    // -------------------------- Ref --------------------------------
    const rotateAnim = useRef(new Animated.Value(0)).current;


    // -------------------------- Funções --------------------------------
    const handleToggle = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        Animated.timing(rotateAnim, {
            toValue: isTemaEscuro ? 1 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => rotateAnim.setValue(0));

        alterarTema();
    };

    const rotation = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"],
    });

    return (
        <TouchableOpacity onPress={handleToggle} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                <Ionicons
                    name={isTemaEscuro ? "sunny" : "moon"}
                    size={22}
                    color={isTemaEscuro ? "#FFD700" : cores.textSecondary}
                />
            </Animated.View>
        </TouchableOpacity>
    );
}