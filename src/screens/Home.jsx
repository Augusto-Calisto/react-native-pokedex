import { useEffect, useMemo, useState } from "react";
import { StyleSheet, View, Text, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { TypeFilter } from "../components/TypeFilter";
import { ThemeToggle } from "../components/ThemeToggle";
import { SearchBar } from "../components/SearchBar";
import PokemonList from "../components/PokemonList";

import { useTipoPokemon } from "../hooks/useTipoPokemon";
import { usePokemons } from "../hooks/usePokemons";
import { useTheme } from "../context/ThemeProvider";


export default function Home() {

    // -------------------------- States --------------------------------
    const [pokemons, setPokemons] = useState([]);
    const [tipoPokemons, setTipoPokemons] = useState(null);
	const [isModoBusca, setIsModoBusca] = useState(false);


    // -------------------------- Hooks ---------------------------------
	const { cores, isTemaEscuro } = useTheme();
    const insets = useSafeAreaInsets();

    const { data: dadosPokemons } = usePokemons();
    const { pokemonsMesmoTipo } = useTipoPokemon(tipoPokemons);


    // -------------------------- Effects --------------------------------
    useEffect(() => {
        if(tipoPokemons === null && !isModoBusca) {
            if (dadosPokemons?.pages) {
                const lista = dadosPokemons.pages.flatMap(page => page.results);            
                setPokemons(lista);
            }
        }
    }, [tipoPokemons, dadosPokemons, isModoBusca]);


    useEffect(() => {
        if (pokemonsMesmoTipo) {
			setIsModoBusca(false);
            setPokemons(pokemonsMesmoTipo.pokemon);
        }
    }, [pokemonsMesmoTipo]);


	// -------------------------- Funções ----------------------------------
	const receberPokemonBusca = (pokemonEncontrado, mensagemErro) => {
		if(pokemonEncontrado) {							
			pokemons.length = 0;

			setPokemons([pokemonEncontrado]);

			setIsModoBusca(true);

		} else {											
			if(mensagemErro) {
				Alert.alert("ATENÇÃO", mensagemErro);
			}

			setIsModoBusca(false);
		}
	}

    const handleTypeChange = (tipo) => {
		setTipoPokemons(tipo);
	};

    const totalPokemons = useMemo(() => {
        return pokemons.length;
    }, [pokemons])

    return (
        <View style={[styles.container, { backgroundColor: cores.bg }]}>
			<LinearGradient colors={isTemaEscuro ? ["#1A1A2E", "#0D0D1A"] : ["#E8EDF8", "#F0F4FF"]} style={[styles.header, { paddingTop: insets.top + 8 }]}>
				<View style={styles.headerRow}>
					<View>
						<Text style={[styles.headerTitle, { color: cores.textPrimary }]}>
							Pokédex
						</Text>

						<Text style={[styles.headerSub, { color: cores.textSecondary }]}>
							{ totalPokemons > 0 ? `${totalPokemons} Pokémon(s)` : "Busque e descubra!" }
						</Text>
					</View>

					<ThemeToggle/>
				</View>

				<SearchBar
					isModoBusca={isModoBusca}
					onCallbackRetornarTipoPokemonPadrao={() => setTipoPokemons(null)}
                    onCallbackReceberPokemons={(pokemonEncontrado, mensagemErro) => receberPokemonBusca(pokemonEncontrado, mensagemErro)}
                />

				{!isModoBusca && (
					<TypeFilter
						tipoSelecionado={tipoPokemons}
						onTipoSelecionado={(tipo) => handleTypeChange(tipo)}
					/>
				)}
			</LinearGradient>

            <PokemonList pokemons={pokemons}/>
        </View>
    )
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},

	header: {
		paddingBottom: 8,
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

	list: {
		padding: 10,
		paddingBottom: 32,
	},

	listEmpty: {
		flexGrow: 1,
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

	footer: {
		padding: 20,
		alignItems: "center",
		gap: 8,
	},

	footerText: {
		fontSize: 13,
		fontWeight: "500",
	},

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
	},
});