import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { usePokemons } from "../hooks/usePokemons";
import { useTheme } from "../context/ThemeProvider";

export default function LoadingPokemons() {
    const { cores } = useTheme();
    const { isLoading } = usePokemons();
    
    if (!isLoading) return null;

    return (
        <View style={styles.footer}>
            <ActivityIndicator color={cores.primary} size="small"/>

            <Text style={[styles.footerText, { color: cores.textMuted }]}>
                Carregando Pokémon...
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    footer: {
		padding: 20,
		alignItems: "center",
		gap: 8,
	},

	footerText: {
		fontSize: 13,
		fontWeight: "500",
	}
});