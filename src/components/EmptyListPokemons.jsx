import { StyleSheet, Text, View } from "react-native";

import { useTheme } from "../context/ThemeProvider";
import { usePokemons } from "../hooks/usePokemons";

export default function EmptyListPokemons() {
    const { cores } = useTheme();
    const { isLoading } = usePokemons();
        
    if (!isLoading) return null;

    return (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}> 🔍 </Text>

            <Text style={[styles.emptyTitle, { color: cores.textPrimary }]}>
                Nenhum Pokémon encontrado
            </Text>

            <Text style={[styles.emptySubtitle, { color: cores.textMuted }]}>
                Tente outro nome ou tipo
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    emptyContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		paddingTop: 60,
	},

	emptyEmoji: {
		fontSize: 48,
		marginBottom: 12,
	},

	emptyTitle: {
		fontSize: 18,
		fontWeight: "700",
		marginBottom: 4,
	},

	emptySubtitle: {
		fontSize: 14,
		fontWeight: "400",
	}
});