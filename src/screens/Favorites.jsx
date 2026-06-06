import { View, FlatList, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

import { PokemonCard } from "../components/PokemonCard";
import { ThemeToggle } from "../components/ThemeToggle";
import EmptyListFavorites from "../components/EmptyListFavorites";

import { useTheme } from "../context/ThemeProvider";
import { useFavorites } from "../context/FavoriteProvider";


export default function FavoritesScreen() {
	const { cores, isTemaEscuro } = useTheme();
	const insets = useSafeAreaInsets();

	const { pokemonsFavoritos, listaIdsPokemonsFavoritos, isLoading } = useFavorites();

	const renderizarPokemon = ({ item }) => {
        const pokemonRenderizar = item;
        
        let nomePokemon = pokemonRenderizar.name || pokemonRenderizar.pokemon.name;

        let id = pokemonRenderizar.id;
        
        return (
            <PokemonCard
                nomePokemon={nomePokemon}
                idPokemon={id}
            />
        )
    }

	return (
		<View style={[styles.container, { backgroundColor: cores.bg }]}>
			<LinearGradient colors={isTemaEscuro ? ["#1A1A2E", "#0D0D1A"] : ["#E8EDF8", "#F0F4FF"]} style={[styles.header, { paddingTop: insets.top + 8 }]}>
				<View style={styles.headerRow}>
					<View>
						<Text style={[styles.headerTitle, { color: cores.textPrimary }]}>
							Favoritos
						</Text>

						<Text style={[styles.headerSub, { color: cores.textSecondary }]}>
							{listaIdsPokemonsFavoritos.length > 0 ? `${listaIdsPokemonsFavoritos.length} salvos` : "Nenhum favorito"}
						</Text>
					</View>

					<ThemeToggle/>
				</View>
			</LinearGradient>

			{isLoading ? (
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color={cores.primary} />

					<Text style={[styles.loadingText, { color: cores.textSecondary }]}>
						Carregando favoritos...
					</Text>
				</View>

			) : (
				<FlatList
					data={pokemonsFavoritos}
					renderItem={renderizarPokemon}
					keyExtractor={item => String(item.id)}
					numColumns={2}
					contentContainerStyle={[styles.list, listaIdsPokemonsFavoritos.length === 0 && styles.listEmpty]}
					ListEmptyComponent={<EmptyListFavorites/>}
					showsVerticalScrollIndicator={true}
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},

	header: {
		paddingBottom: 12,
	},

	headerRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 20,
		paddingBottom: 4,
	},

	headerTitle: {
		fontSize: 28,
		fontWeight: "900",
		letterSpacing: -0.5,
	},

	headerSub: {
		fontSize: 13,
		fontWeight: "500",
		marginTop: 1,
	},

	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		gap: 12,
	},

	loadingText: {
		fontSize: 15,
		fontWeight: "500",
	},

	list: {
		padding: 10,
		paddingBottom: 32,
	},

	listEmpty: {
		flexGrow: 1,
	},

	skeletonCard: {
		flex: 1,
		margin: 6,
		borderRadius: 20,
		minHeight: 180,
		justifyContent: "center",
		alignItems: "center",
	}
});
