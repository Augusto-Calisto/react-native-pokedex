import { createContext, useContext, useState } from "react";
import { CORES, CORES_CLARAS } from "../constants/theme";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
    
	// States
    const [tema, setTema] = useState("light");

    // Constantes
    const isTemaEscuro = (tema === "dark");
    const coloresDinamicas = {...CORES, ...(isTemaEscuro ? {} : CORES_CLARAS) };

    // Funções
	const alterarTema = () => {
        setTema(prev => (prev === "light" ? "dark" : "light"));
    };

	return (
		<ThemeContext.Provider value={{ tema, isTemaEscuro, alterarTema, cores: coloresDinamicas }}>
			{ children }
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const ctx = useContext(ThemeContext);

	if (!ctx) throw new Error("'useTheme' precisa ser usado com ThemeProvider");

	return ctx;
}