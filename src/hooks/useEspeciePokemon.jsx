import { useQuery } from "@tanstack/react-query";
import { buscarEspeciesPokemon } from "../api/pokemons";

export function useEspeciePokemon(identificacaoPokemon) {
    return useQuery({
        queryKey: ["pokemonEspecies", identificacaoPokemon],
        queryFn: () => buscarEspeciesPokemon(identificacaoPokemon),
        enabled: !!identificacaoPokemon,
        staleTime: 1000 * 60 * 10, // 10 min cache
    })
}