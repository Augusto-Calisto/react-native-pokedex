export function formatarNomePokemon(nome) {    
	if (!nome) return "";
    
    const normalizado = nome
        .toLowerCase()
        .replace(/-/g, " ")
        .replace(/\b\w/g, l => l.toUpperCase());

    return normalizado;
}

export function formatarNumeroPokemon(numero) {
    return String(numero).padStart(3, "0");
}

export function formatarNomeEstatistica(nomeEstatistica) {	
	const map = {
		"hp": "HP",
		"attack": "ATK",
		"defense": "DEF",
		"special-attack": "Sp.ATK",
		"special-defense": "Sp.DEF",
		"speed": "SPD",
	};

	return map[nomeEstatistica] ?? nomeEstatistica;
}

export function extrairDescricaoPokemon(species) {	
	const entry = species.flavor_text_entries.find(e => e.language.name === "en");

	return entry
		? entry.flavor_text.replace(/\f/g, " ").replace(/\n/g, " ").trim()
		: "No description available";
}

export function extrairGeneroPokemon(species) {
	const genus = species.genera.find(g => g.language.name === "en");
	return genus ? genus.genus : "";
}