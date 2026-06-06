import { useQuery } from "@tanstack/react-query";
import { buscarPokemonsPeloTipo } from "../api/pokemons";

export function useTipoPokemon(tipo) {
    const query = useQuery({
        queryKey: ["pokemonsPorTipo", tipo],
        queryFn: () => buscarPokemonsPeloTipo(tipo),
        enabled: !!tipo,   // só executa quando tipo existir
        staleTime: 1000 * 60 * 10,  // 10 min cache
    });

    return {
        ...query,
        pokemonsMesmoTipo: query.data
    }
}