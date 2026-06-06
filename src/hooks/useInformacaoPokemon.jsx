import { useQuery } from "@tanstack/react-query";
import { buscarPokemon } from "../api/pokemons";

export function usePokemon(identificacaoPokemon) {
    return useQuery({
        queryKey: ["pokemon", identificacaoPokemon],
        queryFn: () => buscarPokemon(identificacaoPokemon),
        enabled: !!identificacaoPokemon,
        staleTime: 1000 * 60 * 10, // 10 min cache
    })
}