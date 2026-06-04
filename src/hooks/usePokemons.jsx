import { useInfiniteQuery } from "@tanstack/react-query";
import { buscarPokemons } from "../api/pokemons";

export function usePokemons() {
    return useInfiniteQuery({
        queryKey: ["pokemons"],

        queryFn: ({ pageParam = 0 }) => buscarPokemons(pageParam),

        getNextPageParam: (objetoResposta, listaNumeroPaginasCarregadas) => {

            // PokeAPI retorna next=null quando acaba
            if (!objetoResposta.next) {
                return undefined;
            }
            
            // próxima página
            return listaNumeroPaginasCarregadas.length;
        },

        initialPageParam: 0
    })
} 