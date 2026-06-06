import { useQuery } from "@tanstack/react-query";
import { buscarEvolucoesPokemon } from "../api/pokemons";

export function useEvolucaoPokemon(urlEvolucaoPokemon, options={}) {
    return useQuery({
        queryKey: ["pokemonEvolucoes", urlEvolucaoPokemon],
        queryFn: () => buscarEvolucoesPokemon(urlEvolucaoPokemon),
        enabled: !!urlEvolucaoPokemon,
        // staleTime: 1000 * 60 * 10, // 10 min cache
        ...options
    })
}