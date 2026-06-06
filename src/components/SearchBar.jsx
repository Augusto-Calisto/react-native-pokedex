import React, { useEffect, useRef, useState } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity, Animated, Keyboard } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "../context/ThemeProvider";
import { usePokemon } from "../hooks/useInformacaoPokemon";
import { buscarPokemon } from "../api/pokemons";


export function SearchBar({ isModoBusca, onCallbackReceberPokemons, onCallbackRetornarTipoPokemonPadrao }) {
	
	// ------------------------- States -------------------------------------
	const [valorPesquisa, setValorPesquisa] = useState("");


	// ------------------------- Hooks --------------------------------------
	const { cores, isTemaEscuro } = useTheme();
	const { data, isFetched, isLoading } = usePokemon(valorPesquisa);


	// ------------------------- Refs ----------------------------------------
	const scaleAnim = useRef(new Animated.Value(1)).current;


	// ------------------------- Effect ---------------------------------------
	useEffect(() => {
		if(!isModoBusca) {
			setValorPesquisa("");
		}
	}, [isModoBusca]);

	useEffect(() => {
		if(valorPesquisa.length === 0) {
			onCallbackReceberPokemons();
		} else {
			onCallbackRetornarTipoPokemonPadrao();
		}
	}, [valorPesquisa]);
	

	// ------------------------- Funções -----------------------------------------
	const handleFocus = () => {
		Animated.spring(scaleAnim, {
			toValue: 1.02,
			useNativeDriver: true,
			tension: 300,
			friction: 10,
		}).start();
	};

	const handleBlur = () => {
		Animated.spring(scaleAnim, {
			toValue: 1,
			useNativeDriver: true,
			tension: 300,
			friction: 10,
		}).start();
	};

	const buscarPokemonPelaPesquisa = async (podePesquisar) => {
		try {
			if(podePesquisar && valorPesquisa) {
				Keyboard.dismiss();

				const pokemon = await buscarPokemon(valorPesquisa);

				onCallbackReceberPokemons(pokemon);

			} else {
				setValorPesquisa("");

				onCallbackReceberPokemons();
			}

		} catch (err) {			
			setValorPesquisa("");

			onCallbackReceberPokemons(null, err.message);
		}
	}

	return (
		<Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
			<View
				style={[
					styles.inner,
					{
						backgroundColor: isTemaEscuro ? cores.surface : cores.card,
						borderColor: valorPesquisa.length > 0 ? cores.primary : cores.border,
					},
				]}
			>
				<TextInput
					style={[styles.input, { color: cores.textPrimary }]}
					value={valorPesquisa}
					onChangeText={setValorPesquisa}
					placeholder="Buscar Pokémon pelo nome ou ID..."
					placeholderTextColor={cores.textMuted}
					onBlur={handleBlur}
					onFocus={handleFocus}
					autoCorrect={false}
					autoCapitalize="none"
					returnKeyType="search"
					enablesReturnKeyAutomatically={false}
					onSubmitEditing={() => buscarPokemonPelaPesquisa(true)}
				/>

				{valorPesquisa.length > 0 && (
					<TouchableOpacity onPress={() => buscarPokemonPelaPesquisa(false)} hitSlop={styles.hitSlop}>
						<Ionicons name="close-circle" size={18} color={cores.textSecondary} />
					</TouchableOpacity>
				)}

                <TouchableOpacity style={styles.btnSearch}  hitSlop={styles.hitSlop} onPress={() => buscarPokemonPelaPesquisa(true)}>
                    <Ionicons name="search" size={20} color={cores.primary} />
                </TouchableOpacity>
			</View>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginHorizontal: 16,
		marginVertical: 8,
	},

	inner: {
		flexDirection: "row",
		alignItems: "center",
		borderRadius: 16,
		borderWidth: 1.5,
		paddingHorizontal: 14,
		paddingVertical: 10,
	},

	icon: {
		marginRight: 8,
	},

	input: {
		flex: 1,
		fontSize: 15,
		fontWeight: "500",
	},

    hitSlop: {
        top: 8, 
        bottom: 8, 
        left: 8,
        right: 8,
    },

	btnSearch: {
		marginLeft: 25
	}
});