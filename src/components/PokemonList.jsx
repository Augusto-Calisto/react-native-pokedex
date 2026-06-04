import React, { useEffect, useRef } from "react";
import { FlatList, Platform, StyleSheet } from "react-native"

import LoadingPokemons from "./LoadingPokemons";
import EmptyListPokemons from "./EmptyListPokemons";
import { PokemonCard } from "./PokemonCard";

import { usePokemons } from "../hooks/usePokemons";


export default function PokemonList({ pokemons, scrollToTop }) {

    // ------------------------- Hooks ---------------------------------------
    const { fetchNextPage, hasNextPage, isFetchingNextPage } = usePokemons();


    // ------------------------- Refs ----------------------------------------
    const flatListRef = useRef(null);


    // ------------------------- Effects -------------------------------------
    useEffect(() => {
        if(scrollToTop) {
            irParaOTopo();
        }
    }, [scrollToTop]);


    // ------------------------- Funções --------------------------------------
    const irParaOTopo = () => {
        flatListRef.current?.scrollToOffset({ 
            offset: 0,
            animated: true
        });
    };
    
    const buscarProximaRemessaPokemons = () => {
        if(hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }

    const renderizarPokemon = ({ item }) => {
        // Quando carrega tela, pokemons vem { name: "", url }
        // Quando filtra-se por tipo. Vem objeto: { pokemon: { name: "", url: "" } }

        const pokemonRenderizar = item;

        let nomePokemon = pokemonRenderizar.name || pokemonRenderizar.pokemon.name;

        let id = pokemonRenderizar.id;

        const contemCampoUrl = Object.hasOwn(pokemonRenderizar, "url");

        const contemCampoPokemon = Object.hasOwn(pokemonRenderizar, "pokemon");

        if(contemCampoUrl || contemCampoPokemon) {            
            const urlPokemonRenderizar = pokemonRenderizar?.url || pokemonRenderizar?.pokemon.url;
            
            const parts = urlPokemonRenderizar.split("/").filter(Boolean);

            id = parseInt(parts[parts.length - 1], 10);
        }
        
		return (
            <PokemonCard
                nomePokemon={nomePokemon}
                idPokemon={id}
            />
        )
    }

    return (
        <React.Fragment>
            <FlatList
                ref={flatListRef}
                data={pokemons}
                renderItem={renderizarPokemon}
                keyExtractor={(item, index) => String(index)}
                onEndReached={buscarProximaRemessaPokemons}
                onEndReachedThreshold={0.5}
                ListEmptyComponent={<EmptyListPokemons/>}
                ListFooterComponent={<LoadingPokemons/>}
                numColumns={2}
                showsVerticalScrollIndicator={true}
                removeClippedSubviews={Platform.OS === "android"}
                maxToRenderPerBatch={10}
                windowSize={5}
                contentContainerStyle={[
                    styles.list,
                    pokemons.length === 0 && styles.listEmpty,
                ]}
            />
        </React.Fragment>
    )
}

const styles = StyleSheet.create({
	list: {
		padding: 10,
		paddingBottom: 32
	},

	listEmpty: {
		flexGrow: 1
	}
});