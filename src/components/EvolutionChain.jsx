import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "../context/ThemeProvider";
import { getOfficialArtwork } from "../api/pokemons";
import { formatarNomePokemon, formatarNumeroPokemon } from "../utils/pokemonUtils";


export function EvolutionChain({ estagios, onPokemonSelecionado }) {
	const { cores } = useTheme();

	if (!estagios || estagios.length === 0) return null;

	return (
		<View style={styles.container}>
			<Text style={[styles.sectionTitle, { color: cores.textPrimary }]}>
				Cadeia de Evolução
			</Text>

			<View style={styles.chain}>
				{estagios.map((stage, stageIdx) => (
					<React.Fragment key={stageIdx}>
						{stageIdx > 0 && (
							<View style={styles.arrowContainer}>
								<Ionicons name="chevron-forward" size={22} color={cores.textMuted} />

								{stage[0]?.minLevel && (
									<Text style={[styles.levelText, { color: cores.textMuted }]}>
										Lv.{ stage[0].minLevel }
									</Text>
								)}

								{stage[0]?.item && (
									<Text style={[styles.levelText, { color: cores.textMuted }]}>
										{ stage[0].item.replace(/-/g, " ") }
									</Text>
								)}
							</View>
						)}

						<View style={styles.stageGroup}>
							{stage.map(step => (
								<TouchableOpacity
									key={step.id}
									style={[styles.evoItem, { backgroundColor: cores.surface }]}
									onPress={() => onPokemonSelecionado(step.name, step.id)}
									activeOpacity={0.8}
								>
									<Image
										source={{ uri: getOfficialArtwork(step.id) }}
										style={styles.evoSprite}
										resizeMode="contain"
									/>

									<Text style={[styles.evoName, { color: cores.textPrimary }]} numberOfLines={1}>
										{ formatarNomePokemon(step.name) }
									</Text>

									<Text style={[styles.evoId, { color: cores.textMuted }]}>
										#{ formatarNumeroPokemon(step.id) }
									</Text>
								</TouchableOpacity>
							))}
						</View>
					</React.Fragment>
				))}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginTop: 8,
	},

	sectionTitle: {
		fontSize: 16,
		fontWeight: "800",
		marginBottom: 14,
		letterSpacing: 0.3,
	},

	chain: {
		flexDirection: "row",
		alignItems: "center",
		flexWrap: "wrap",
		gap: 4,
		justifyContent: "center",
	},

	arrowContainer: {
		alignItems: "center",
		paddingHorizontal: 2,
	},

	levelText: {
		fontSize: 9,
		fontWeight: "600",
		textAlign: "center",
		marginTop: 2,
	},

	stageGroup: {
		alignItems: "center",
		gap: 8,
	},

	evoItem: {
		alignItems: "center",
		borderRadius: 14,
		padding: 10,
		width: 82,
	},

	evoSprite: {
		width: 64,
		height: 64,
	},

	evoName: {
		fontSize: 11,
		fontWeight: "700",
		textAlign: "center",
		marginTop: 4,
	},

	evoId: {
		fontSize: 9,
		fontWeight: "500",
		marginTop: 1,
	}
});
