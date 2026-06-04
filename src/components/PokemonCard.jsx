import React, { useEffect, useRef, memo, useState } from "react";

import { View, Text, StyleSheet, Animated, TouchableOpacity, Image, ActivityIndicator } from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { PokemonModal } from "./PokemonModal";

import { TYPE_GRADIENTS } from "../constants/typeColors";

import { usePokemon } from "../hooks/useInformacaoPokemon";
import { useTheme } from "../context/ThemeProvider";
import { useFavorites } from "../context/FavoriteProvider";

import { formatarNomePokemon, formatarNumeroPokemon } from "../utils/pokemonUtils";
import { getOfficialArtwork } from "../api/pokemons";


export const PokemonCard = memo(({ nomePokemon, idPokemon }) => {
	
	// ------------------------ Hooks ---------------------------------
	const { data, isLoading } = usePokemon(idPokemon);
	const { isPokemonFavorito, toggleFavorito } = useFavorites();
	const { cores } = useTheme();
	

	// ------------------------ Refs ----------------------------------
	const fadeAnim = useRef(new Animated.Value(0)).current;
	const scaleAnim = useRef(new Animated.Value(0.9)).current;
	const heartScaleAnim = useRef(new Animated.Value(1)).current;


	// ------------------------ States ---------------------------------
	const [pokemon, setPokemon] = useState(null);
	const [tipoPokemon, setTipoPokemon] = useState("normal");
	const [gradient, setGradient] = useState(["#888", "#444"]);
	const [modalVisivel, setModalVisivel] = useState(false);
	
	
	// ------------------------ Effects ---------------------------------
	useEffect(() => {		
		if (data) {
			setPokemon(data);

			const tipoPokemon = data?.types[0].type?.name ?? "normal";

			const gradient = TYPE_GRADIENTS[tipoPokemon] ?? ["#888", "#444"];
			
			setGradient(gradient);

			setTipoPokemon(tipoPokemon);
		}
	}, [data]);

	useEffect(() => {
		Animated.parallel([
			Animated.timing(fadeAnim, {
				toValue: 1,
				duration: 400,
				useNativeDriver: true,
			}),

			Animated.spring(scaleAnim, {
				toValue: 1,
				tension: 80,
				friction: 8,
				useNativeDriver: true,
			}),
		]).start();
	}, []);


	// ------------------------ Funções ------------------------------------------
	const abrirModalDetalhesPokemon = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		setModalVisivel(true);
	};

	const handleFavoritePress = (idPokemon) => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

		Animated.sequence([
			Animated.spring(heartScaleAnim, { toValue: 1.4, useNativeDriver: true, speed: 50 }),
			Animated.spring(heartScaleAnim, { toValue: 1, useNativeDriver: true, speed: 50 }),
		]).start();

		toggleFavorito(idPokemon);
	};


	if (!pokemon || isLoading) {
		return (
			<View style={[styles.skeletonWrapper, { backgroundColor: cores.card }]}>
				<ActivityIndicator size="small" color={cores.primary}/>

				<Text style={[styles.skeletonText, { color: cores.textMuted }]}>
					Carregando...{ nomePokemon }
				</Text>
			</View>
		);
	}

	return (
		<React.Fragment>
			<PokemonModal
				key={pokemon.id}
				pokemon={pokemon}
				isVisivel={modalVisivel}
				onClose={() => setModalVisivel(false)}
				isMarcadoFavorito={isPokemonFavorito(pokemon.id)}
			/>

			<Animated.View style={[styles.wrapper, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
				<TouchableOpacity onPress={abrirModalDetalhesPokemon} activeOpacity={0.85}>
					<LinearGradient
						colors={[gradient[0] + "CC", gradient[1] + "EE"]}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 1 }}
						style={styles.card}
					>
						<View style={[styles.circle, { borderColor: "rgba(255,255,255,0.15)" }]} />

						<Text style={styles.number}>
							{ formatarNumeroPokemon(pokemon.id) }
						</Text>

						<Animated.View style={[styles.heart, { transform: [{ scale: heartScaleAnim }] }]}>
							<TouchableOpacity onPress={() => handleFavoritePress(idPokemon)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
								<Ionicons
									name={isPokemonFavorito(idPokemon) ? "heart" : "heart-outline"}
									size={18}
									color={isPokemonFavorito(idPokemon) ? "#FF6B6B" : "rgba(255,255,255,0.7)"}
								/>
							</TouchableOpacity>
						</Animated.View>

						<Image
							source={{ uri: getOfficialArtwork(pokemon.id) }}
							style={styles.sprite}
							resizeMode="contain"
						/>

						<Text style={styles.name} numberOfLines={1}>
							{ formatarNomePokemon(nomePokemon) }
						</Text>

						<View style={styles.types}>
							{pokemon?.types.map(t => {
								return (
									<View key={t.slot} style={[styles.typeBadge, { backgroundColor: "rgba(255,255,255,0.25)" }]}>
										<Text style={styles.typeText}>
											{ t?.type?.name.toUpperCase() }
										</Text>
									</View>
								);
							})}
						</View>
					</LinearGradient>
				</TouchableOpacity>
			</Animated.View>
		</React.Fragment>
	);
});

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		margin: 6,
	},

	card: {
		borderRadius: 20,
		padding: 14,
		minHeight: 180,
		overflow: "hidden",
		position: "relative",
	},

	circle: {
		position: "absolute",
		width: 130,
		height: 130,
		borderRadius: 65,
		borderWidth: 20,
		right: -30,
		bottom: -30,
	},

	number: {
		fontSize: 11,
		fontWeight: "700",
		color: "rgba(255,255,255,0.7)",
		letterSpacing: 0.5,
	},

	heart: {
		position: "absolute",
		top: 12,
		right: 12,
	},

	sprite: {
		width: 100,
		height: 100,
		alignSelf: "center",
		marginVertical: 4,
	},

	name: {
		fontSize: 14,
		fontWeight: "800",
		color: "#fff",
		textAlign: "center",
		marginTop: 4,
		textShadowColor: "rgba(0,0,0,0.3)",
		textShadowOffset: { width: 0, height: 1 },
		textShadowRadius: 3,
	},

	types: {
		flexDirection: "row",
		justifyContent: "center",
		gap: 4,
		marginTop: 6,
		flexWrap: "wrap",
	},

	typeBadge: {
		paddingHorizontal: 8,
		paddingVertical: 3,
		borderRadius: 999,
	},

	typeText: {
		fontSize: 9,
		fontWeight: "700",
		color: "#fff",
		letterSpacing: 0.5,
	},

	skeletonWrapper: {
		flex: 1,
		margin: 6,
		borderRadius: 20,
		minHeight: 180,
		justifyContent: "center",
		alignItems: "center",
		gap: 8,
	},

	skeletonText: {
		fontSize: 12,
		fontWeight: "500",
	}
});