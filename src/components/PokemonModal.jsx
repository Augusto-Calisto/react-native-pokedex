// React
import React, { useEffect, useState, useRef } from "react";

// React Native
import { Modal, View, Text, StyleSheet, TouchableOpacity, Animated, ActivityIndicator, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Expo
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

// Context
import { useTheme } from "../context/ThemeProvider";
import { TYPE_COLORS, TYPE_GRADIENTS } from "../constants/typeColors";

// Components
import { StatBar } from "./StatBar";


import { formatarNomePokemon, formatarNumeroPokemon, extrairDescricaoPokemon, extrairGeneroPokemon } from "../utils/pokemonUtils";
import { useEvolucaoPokemon } from "../hooks/useEvolucaoPokemon";
import { EvolutionChain } from "./EvolutionChain";
import { getOfficialArtwork } from "../api/pokemons";
import { useEspeciePokemon } from "../hooks/useEspeciePokemon";
import { useFavorites } from "../context/FavoriteProvider";

// Dimensions
const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");


export function PokemonModal({ pokemon, isVisivel, isMarcadoFavorito, onClose, onSelectPokemon }) {	
	
	// ------------------------ Constantes ---------------------------------------
	const TABS = [
		{ key: "about", label: "Sobre", icon: "information-circle" },
		{ key: "stats", label: "Stats", icon: "bar-chart" },
		{ key: "evolution", label: "Evolução", icon: "git-branch" },
		{ key: "moves", label: "Movimentos", icon: "flash" },
	];
    
	// --------------------------- Hook's ---------------------------------------
    const { cores, isTemaEscuro } = useTheme();
	
	const insets = useSafeAreaInsets();

	const { toggleFavorito } = useFavorites();

    const { data: especiePokemon } = useEspeciePokemon(pokemon?.id);
		
	const { data: evolucaoPokemon, isLoading } = useEvolucaoPokemon(especiePokemon?.evolution_chain?.url, {
  		enabled: !!especiePokemon?.evolution_chain?.url
	});


	// --------------------------- States ------------------------------------------
	const [activeTab, setActiveTab] = useState("about");
	const [shiny, setShiny] = useState(false);
	const [estagiosEvolucao, setEstagiosEvolucao] = useState(null);


	// --------------------------- Refs --------------------------------------------
	const slideAnim = useRef(new Animated.Value(SCREEN_H)).current;
	const spriteScaleAnim = useRef(new Animated.Value(0.5)).current;
	const spriteOpacityAnim = useRef(new Animated.Value(0)).current;


	// --------------------------- Effects ----------------------------------------
	useEffect(() => {
		if (isVisivel && pokemon) {
			setActiveTab("about");

			Animated.parallel([
				Animated.spring(slideAnim, {
					toValue: 0,
					tension: 80,
					friction: 12,
					useNativeDriver: true,
				}),

				Animated.spring(spriteScaleAnim, {
					toValue: 1,
					tension: 80,
					friction: 10,
					useNativeDriver: true,
					delay: 150,
				}),

				Animated.timing(spriteOpacityAnim, {
					toValue: 1,
					duration: 400,
					delay: 100,
					useNativeDriver: true,
				}),
			]).start();

		} else {
			Animated.spring(slideAnim, {
				toValue: SCREEN_H,
				tension: 100,
				friction: 15,
				useNativeDriver: true,
			}).start();

			spriteScaleAnim.setValue(0.5);

			spriteOpacityAnim.setValue(0);
		}
	}, [isVisivel, pokemon]);


	useEffect(() => {
		if(evolucaoPokemon) {			
			const estagio = achatarCadeiaEvolutiva(evolucaoPokemon.chain);
			setEstagiosEvolucao(estagio);
		}
	}, [evolucaoPokemon]);


	// --------------------------------- Funções -------------------------------------
	function achatarCadeiaEvolutiva(cadeia) {
		const resultado = [];

		function percorrer(link, profundidade) {
			const partes = link.species.url.split("/").filter(Boolean);
			const id = parseInt(partes[partes.length - 1], 10);

			const detalhe = link.evolution_details?.[0];

			const passo = {
				name: link.species.name,
				id: id,
				trigger: detalhe?.trigger?.name,
				minLevel: detalhe?.min_level,
				item: detalhe?.item?.name,
			};

			if (!resultado[profundidade]) {
				resultado[profundidade] = [];
			}

			resultado[profundidade].push(passo);

			link.evolves_to.forEach(proximo => percorrer(proximo, profundidade + 1));
		}

		percorrer(cadeia, 0);

		return resultado;
	}

	const handleClose = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		onClose();
	};

	const handleFavoriteToggle = (idPokemon) => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		toggleFavorito(idPokemon)
	};

	const handleShinyToggle = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		setShiny(prev => !prev);
	};

	if (!pokemon) return null;

// ------------------------------------------------------------------------------------------------
	const primaryType = pokemon.types[0]?.type.name ?? "normal";

	const gradient = TYPE_GRADIENTS[primaryType] ?? ["#888", "#444"];

	const spriteUri = getOfficialArtwork(pokemon.id, shiny);

	const description = especiePokemon ? extrairDescricaoPokemon(especiePokemon) : null;

	const genus = especiePokemon ? extrairGeneroPokemon(especiePokemon) : null;

	const safeColor1 = (gradient?.[0] || "#888888") + "FF";

	const safeColor2 = (gradient?.[1] || "#444444") + "CC";

	const safeColor3 = (isTemaEscuro ? (cores?.surface || "#121212") : "#ffffff") + "00";
// --------------------------------------------------------------------------------------------

	return (
		<Modal visible={isVisivel} transparent animationType="none" onRequestClose={handleClose}>
			<View style={styles.overlay}>
				<TouchableOpacity style={styles.backdrop} onPress={handleClose} activeOpacity={1} />

				<Animated.View
					style={[
						styles.sheet,
						{ backgroundColor: isTemaEscuro ? cores.surface : cores.lightSurface ?? "#fff" },
						{ transform: [{ translateY: slideAnim }] },
						{ paddingBottom: insets.bottom + 400 },
						{ flex: 1 }
					]}
				>
					<LinearGradient colors={[safeColor1, safeColor2, safeColor3]} style={styles.headerGradient}>
						<View style={[styles.topBar, { paddingTop: 12 }]}>
							<TouchableOpacity onPress={handleClose} style={styles.iconButton}>
								<Ionicons name="chevron-down" size={26} color="#fff" />
							</TouchableOpacity>

							<View style={styles.topBarRight}>
								<TouchableOpacity onPress={handleShinyToggle} style={[styles.iconButton, shiny && styles.shinyActive]}>
									<Text style={styles.shinyIcon}> 
                                        { shiny ? "✨" : "⭐"} 
                                    </Text>
								</TouchableOpacity>

								<TouchableOpacity onPress={() => handleFavoriteToggle(pokemon.id)} style={styles.iconButton}>
									<Ionicons
										name={isMarcadoFavorito ? "heart" : "heart-outline"}
										size={24}
										color={isMarcadoFavorito ? "#FF6B6B" : "#fff"}
									/>
								</TouchableOpacity>
							</View>
						</View>

						<Text style={styles.headerNumber}>
							#{ formatarNumeroPokemon(pokemon.id) }
						</Text>

						<Text style={styles.headerName}>
							{ formatarNomePokemon(pokemon.name) }
						</Text>

						{genus && <Text style={styles.headerGenus}> { genus } </Text>}

						<View style={styles.typesRow}>
							{pokemon.types.map(t => {
								const typeColor = TYPE_COLORS[t.type.name]?.primary || "#888888";

								return (
									<View
										key={t.slot}
										style={[styles.typeBadge, { backgroundColor: typeColor + "CC" }]}
									>
										<Text style={styles.typeBadgeText}>
											{ t.type.name?.toUpperCase() }
										</Text>
									</View>
								);
							})}
						</View>

						<Animated.Image
							source={{ uri: spriteUri }}
							style={[
								styles.sprite,
								{
									opacity: spriteOpacityAnim,
									transform: [{ scale: spriteScaleAnim }],
								},
							]}
							resizeMode="contain"
						/>
					</LinearGradient>

					{/* Tab bar */}
					<View style={[styles.tabBar, { borderBottomColor: cores.border }]}>
						{TABS.map(tab => {
							const isActive = activeTab === tab.key;

							return (
								<TouchableOpacity
									key={tab.key}
									style={[styles.tab, isActive && { borderBottomColor: gradient[0], borderBottomWidth: 2.5 }]}
									onPress={() => setActiveTab(tab.key)}
								>
									<Ionicons
										name={tab.icon}
										size={16}
										color={isActive ? gradient[0] : cores.textMuted}
									/>

									<Text
										style={[
											styles.tabLabel,
											{ color: isActive ? gradient[0] : cores.textMuted },
											isActive && { fontWeight: "700" },
										]}
									>
										{ tab.label }
									</Text>
								</TouchableOpacity>
							);
						})}
					</View>

					{/* Content */}
					<View style={{ padding: 15 }} key={pokemon.id}>

						{isLoading && activeTab !== "stats" && (
							<ActivityIndicator
								color={gradient[0]}
								size="small"
								style={styles.loader}
							/>
						)}

						{/* ABOUT */}
						{activeTab === "about" && (
							<View>
								{description && (
									<View style={[styles.descBox, { backgroundColor: cores.card }]} key={`${pokemon.id}-description`}>
										<Text style={[styles.description, { color: cores.textPrimary }]}>
											{description}
										</Text>
									</View>
								)}

								<View style={styles.infoGrid} key={`${pokemon.id}-info`}>
									<InfoTile
										label="Altura"
										value={`${(pokemon.height / 10).toFixed(1)} m`}
										colors={cores}
									/>

									<InfoTile
										label="Peso"
										value={`${(pokemon.weight / 10).toFixed(1)} kg`}
										colors={cores}
									/>

									<InfoTile
										label="Exp. Base"
										value={String(pokemon.base_experience ?? "—")}
										colors={cores}
									/>

									{especiePokemon && (
										<>
											<InfoTile
												label="Taxa captura"
												value={String(especiePokemon.capture_rate)}
												colors={cores}
											/>

											<InfoTile
												label="Felicidade base"
												value={String(especiePokemon.base_happiness)}
												colors={cores}
											/>

											<InfoTile
												label="Raridade"
												value={
													especiePokemon.is_mythical
														? "🌟 Mítico"
														: especiePokemon.is_legendary
															? "✨ Lendário"
															: "— Normal"
												}
												colors={cores}
											/>
										</>
									)}
								</View>

								<Text style={[styles.sectionTitle, { color: cores.textPrimary }]}>
									Habilidades
								</Text>

								<View style={styles.abilitiesRow} key={`${pokemon.id}-abilities`}>
									{pokemon.abilities.map(a => (
										<View
											key={a.ability.name}
											style={[
												styles.abilityBadge,
												{ backgroundColor: cores.card, borderColor: cores.border },
												a.is_hidden && { borderStyle: "dashed", borderColor: gradient[0] },
											]}
										>
											<Text style={[styles.abilityText, { color: cores.textPrimary }]}>
												{ formatarNomePokemon(a.ability.name) }

												{a.is_hidden && (
													<Text style={{ color: gradient[0], fontSize: 10 }}> (oculta)</Text>
												)}
											</Text>
										</View>
									))}
								</View>
							</View>
						)}

						{/* STATS */}
						{activeTab === "stats" && (
							<View key={`${pokemon.id}-stats`}>
								{pokemon.stats.map((s, i) => (
									<StatBar
										key={s.stat.name}
										nomeEstatistica={s.stat.name}
										valorEstatistica={s.base_stat}
										delay={i * 80}
									/>
								))}

								<View style={[styles.totalBox, { backgroundColor: cores.card }]}>
									<Text style={[styles.totalLabel, { color: cores.textSecondary }]}>
										Total
									</Text>

									<Text style={[styles.totalValue, { color: gradient[0] }]}>
										{ pokemon.stats.reduce((acc, s) => acc + s.base_stat, 0) }
									</Text>
								</View>
							</View>
						)}

						{/* EVOLUTION */}
						{activeTab === "evolution" && (
							<View key={`${pokemon.id}-evolucao`}>
								{isLoading ? (
									<>
										<ActivityIndicator
											color={gradient[0]}
											style={styles.loader}
										/>

										<Text style={{ color: "red", fontSize: 12, textAlign: "center" }}>
											Carregando evolução...
										</Text>
									</>

								) : estagiosEvolucao ? (
									<EvolutionChain
										estagios={estagiosEvolucao}
										onPokemonSelecionado={(name, id) => {
											onSelectPokemon?.(name, id);
										}}
									/>

								) : (
									<Text style={[styles.empty, { color: cores.textMuted }]}>
										Sem dados de evolução
									</Text>
								)}
							</View>
						)}

						{/* MOVES */}
						{activeTab === "moves" && (
							<View style={styles.movesGrid} key={`${pokemon.id}-moves`}>
								{pokemon.moves.slice(0, 40).map(m => (
									<View
										key={m.move.name}
										style={[styles.moveBadge, { backgroundColor: cores.card, borderColor: cores.border }]}
									>
										<Text style={[styles.moveText, { color: cores.textSecondary }]}>
											{ formatarNomePokemon(m.move.name) }
										</Text>
									</View>
								))}
							</View>
						)}
					</View>
				</Animated.View>
			</View>
		</Modal>
	);
}

function InfoTile({ label, value, colors }) {
	return (
		<View style={[styles.infoTile, { backgroundColor: colors.card }]}>
			<Text style={[styles.infoLabel, { color: colors.textMuted }]}>
				{ label }
			</Text>

			<Text style={[styles.infoValue, { color: colors.textPrimary }]}>
				{ value }
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		justifyContent: "flex-end",
	},

	backdrop: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "rgba(0,0,0,0.6)",
	},

	sheet: {
		borderTopLeftRadius: 28,
		borderTopRightRadius: 28,
		maxHeight: SCREEN_H * 0.9,
		overflow: "hidden",
		elevation: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: -4 },
		shadowOpacity: 0.3,
		shadowRadius: 12,
	},

	headerGradient: {
		paddingHorizontal: 20,
		paddingBottom: 100,
	},

	topBar: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},

	topBarRight: {
		flexDirection: "row",
		gap: 8,
	},

	iconButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "rgba(255,255,255,0.2)",
		justifyContent: "center",
		alignItems: "center",
	},

	shinyActive: {
		backgroundColor: "rgba(255,215,0,0.4)",
	},

	shinyIcon: {
		fontSize: 18,
	},

	headerNumber: {
		fontSize: 13,
		fontWeight: "700",
		color: "rgba(255,255,255,0.75)",
		marginTop: 12,
		letterSpacing: 0.5,
	},

	headerName: {
		fontSize: 30,
		fontWeight: "900",
		color: "#fff",
		marginTop: 2,
		textShadowColor: "rgba(0,0,0,0.3)",
		textShadowOffset: { width: 0, height: 2 },
		textShadowRadius: 4,
	},

	headerGenus: {
		fontSize: 13,
		fontWeight: "500",
		color: "rgba(255,255,255,0.8)",
		marginTop: 2,
		fontStyle: "italic",
	},

	typesRow: {
		flexDirection: "row",
		gap: 8,
		marginTop: 8,
	},

	typeBadge: {
		paddingHorizontal: 12,
		paddingVertical: 4,
		borderRadius: 999,
	},

	typeBadgeText: {
		fontSize: 11,
		fontWeight: "800",
		color: "#fff",
		letterSpacing: 0.5,
	},

	sprite: {
		width: 170,
		height: 170,
		position: "absolute",
		right: 16,
		bottom: -10,
	},

	tabBar: {
		flexDirection: "row",
		borderBottomWidth: 1,
		marginTop: -20,
	},

	tab: {
		flex: 1,
		paddingVertical: 12,
		alignItems: "center",
		gap: 2,
		borderBottomWidth: 2.5,
		borderBottomColor: "transparent",
	},

	tabLabel: {
		fontSize: 10,
		fontWeight: "600",
		letterSpacing: 0.3,
	},

	content: {
		flex: 1,
	},

	contentInner: {
		padding: 20,
		paddingBottom: 40,
	},

	loader: {
		marginVertical: 20,
	},

	descBox: {
		borderRadius: 14,
		padding: 14,
		marginBottom: 16,
	},

	description: {
		fontSize: 14,
		lineHeight: 22,
		fontStyle: "italic",
	},

	infoGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 10,
		marginBottom: 20,
	},

	infoTile: {
		flex: 1,
		minWidth: "30%",
		borderRadius: 12,
		padding: 12,
		alignItems: "center",
	},

	infoLabel: {
		fontSize: 10,
		fontWeight: "600",
		textTransform: "uppercase",
		letterSpacing: 0.4,
		marginBottom: 4,
	},

	infoValue: {
		fontSize: 15,
		fontWeight: "800",
	},

	sectionTitle: {
		fontSize: 16,
		fontWeight: "800",
		marginBottom: 10,
	},

	abilitiesRow: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 8,
	},

	abilityBadge: {
		borderRadius: 10,
		borderWidth: 1,
		paddingHorizontal: 12,
		paddingVertical: 7,
	},

	abilityText: {
		fontSize: 13,
		fontWeight: "600",
	},

	totalBox: {
		flexDirection: "row",
		justifyContent: "space-between",
		borderRadius: 12,
		padding: 14,
		marginTop: 12,
	},

	totalLabel: {
		fontSize: 14,
		fontWeight: "700",
	},

	totalValue: {
		fontSize: 18,
		fontWeight: "900",
	},

	movesGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 8,
	},

	moveBadge: {
		borderRadius: 8,
		borderWidth: 1,
		paddingHorizontal: 10,
		paddingVertical: 5,
	},

	moveText: {
		fontSize: 12,
		fontWeight: "500",
	},

	empty: {
		textAlign: "center",
		marginTop: 24,
		fontSize: 14,
	}
});