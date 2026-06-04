const BASE_URL = "https://pokeapi.co/api/v2";
const QUANTIDADE_POKEMONS_PAGINA = 20;

export async function buscarPokemons(pagina=0) {    
    const offset = pagina * QUANTIDADE_POKEMONS_PAGINA;

    const res = await fetch(`${BASE_URL}/pokemon?limit=${QUANTIDADE_POKEMONS_PAGINA}&offset=${offset}`)

    if (!res.ok) throw new Error(`Erro ao buscar pokémons (offset=${offset} | limit=${QUANTIDADE_POKEMONS_PAGINA})`);

    return res.json();
}

export async function buscarPokemon(idOuNome) {
    const res = await fetch(`${BASE_URL}/pokemon/${idOuNome}`);

    if (!res.ok) throw new Error(`Pokémon '${idOuNome}' não encontrado`);

    return res.json();
}

export async function buscarPokemonPelaUrl(url) {
    const res = await fetch(url);

    if (!res.ok) throw new Error(`URL: '${url}' do pokémon não foi encontrada e/ou não existe`);

    return res.json();
}

export async function buscarPokemonsPeloTipo(tipo) {
    const res = await fetch(`${BASE_URL}/type/${tipo}`);

    if (!res.ok) throw new Error(`Tipo ${tipo} não foi encontrado`);

    return res.json();
}

export async function buscarEvolucoesPokemon(url) {
    const res = await fetch(url);

    if (!res.ok) throw new Error(`Erro ao buscar Evoluções do Pokémon ${nameOrId}`);

    return res.json();
}

export async function buscarEspeciesPokemon(nameOrId) {
	const res = await fetch(`${BASE_URL}/pokemon-species/${nameOrId}`);

    if (!res.ok) throw new Error(`Erro ao buscar Especies do Pokémon ${nameOrId}`);
    
    return res.json();
}

export function getOfficialArtwork(id, shiny=false) {
	if (shiny) {
		return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${id}.png`;
	}

	return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}