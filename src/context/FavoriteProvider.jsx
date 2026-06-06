import { createContext, useCallback, useContext, useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { useQuery } from "@tanstack/react-query";

import { buscarPokemon } from "../api/pokemons";

const STORAGE_KEY = "@pokedex:favorites";
const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
    const [listaIdsPokemonsFavoritos, setListaIdsPokemonsFavoritos] = useState([]);
    const [armazenamentoPronto, setArmazenamentoPronto] = useState(false);

    useEffect(() => {
        carregarListaPokemonsFavoritos();
    }, []);

    async function carregarListaPokemonsFavoritos() {
        try {
            const stringLista = await AsyncStorage.getItem(STORAGE_KEY);
            
            setListaIdsPokemonsFavoritos(stringLista ? JSON.parse(stringLista) : []);

        } catch (e) {
            console.error("Erro ao ler favoritos:", e);

            throw new Error("Erro ao ler favoritos");

        } finally {
            setArmazenamentoPronto(true);
        }
    }

    const salvarListaIdsPokemonsFavoritos = useCallback(async (listaIDS) => {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(listaIDS));
    }, []);

    const adicionarFavorito = useCallback(async (id) => {
        setListaIdsPokemonsFavoritos(prev => {
            if (prev.includes(id)) {
                return prev;
            }

            const listaAtualizada = [...prev, id];

            salvarListaIdsPokemonsFavoritos(listaAtualizada);

            return listaAtualizada;
        });
    }, [salvarListaIdsPokemonsFavoritos]);


    const removerFavorito = useCallback(async (id) => {
        setListaIdsPokemonsFavoritos(prev => {
            const listaAtualizada = prev.filter(i => i != id);

            salvarListaIdsPokemonsFavoritos(listaAtualizada);

            return listaAtualizada;
        });
    }, [salvarListaIdsPokemonsFavoritos]);


    const toggleFavorito = useCallback((id) => {
        if(listaIdsPokemonsFavoritos.includes(id)) {
            removerFavorito(id);
        } else {
            adicionarFavorito(id);
        }
    }, [listaIdsPokemonsFavoritos, adicionarFavorito, removerFavorito]);


    const query = useQuery({
        queryKey: ["pokemonsFavoritos", listaIdsPokemonsFavoritos],
        queryFn: () => Promise.all(listaIdsPokemonsFavoritos.map(id => buscarPokemon(id))),
        enabled: armazenamentoPronto && listaIdsPokemonsFavoritos.length > 0,
        staleTime: 1000 * 60 * 2,
    });

    return (
        <FavoritesContext.Provider value={{
            listaIdsPokemonsFavoritos,
            isPokemonFavorito: (id) => listaIdsPokemonsFavoritos.includes(id),
            adicionarFavorito,
            removerFavorito,
            toggleFavorito,
            pokemonsFavoritos: query.data ?? [],
            isLoading: !armazenamentoPronto || query.isLoading,
            isError: query.isError,
            error: query.error,
        }}>
            { children }
        </FavoritesContext.Provider>
    );
}

export function useFavorites() {
    const context = useContext(FavoritesContext);

    if (!context) throw new Error("useFavorites deve ser usado dentro de FavoritesProvider");

    return context;
}