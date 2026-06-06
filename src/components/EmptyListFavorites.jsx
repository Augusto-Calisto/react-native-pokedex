import { StyleSheet, Text, View } from "react-native";

import { useTheme } from "../context/ThemeProvider";

export default function EmptyListFavorites() {
    const { cores } = useTheme();

    return (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}> 💔 </Text>

            <Text style={[styles.emptyTitle, { color: cores.textPrimary }]}>
                Sem favoritos ainda
            </Text>

            <Text style={[styles.emptySubtitle, { color: cores.textMuted }]}>
                Toque no ❤️ em qualquer Pokémon para salvar
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
        fontSize: 56,
        marginBottom: 12,
    },

    emptyTitle: {
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 6,
    },

    emptySubtitle: {
        fontSize: 14,
        textAlign: "center",
        paddingHorizontal: 32,
        lineHeight: 22,
    }
});