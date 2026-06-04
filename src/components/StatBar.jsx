import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

import { useTheme } from "../context/ThemeProvider";

import { PALHETA_CORES } from "../constants/theme";
import { formatarNomeEstatistica } from "../utils/pokemonUtils";


export function StatBar({ nomeEstatistica, valorEstatistica, delay=0 }) {
	
	// ----------------------- Constantes ---------------------------------
	const VALOR_MAXIMO_ESTATISTICA = 255;


	// ------------------------- Hooks -------------------------------------
	const { cores } = useTheme();


	// ------------------------- Refs --------------------------------------
	const widthAnim = useRef(new Animated.Value(0)).current;


	// ----------------------- Propriedades --------------------------------
	const pct = Math.min(valorEstatistica / VALOR_MAXIMO_ESTATISTICA, 1);
	const color = PALHETA_CORES[nomeEstatistica] ?? cores.primary;


	// ------------------------ Effects ------------------------------------
	useEffect(() => {
		Animated.timing(widthAnim, {
			toValue: pct,
			duration: 800,
			delay,
			useNativeDriver: false,
		}).start();
	}, [pct, delay]);


	// ----------------------- Funções --------------------------------------
	const getLabel = () => {
		if (valorEstatistica >= 150) return "🔥";

		if (valorEstatistica >= 100) return "💪";

		if (valorEstatistica >= 70) return "👍";

		return "";
	};

	return (
		<View style={styles.row}>
			<Text style={[styles.label, { color: cores.textSecondary }]}>
				{ formatarNomeEstatistica(nomeEstatistica) }
			</Text>

			<Text style={[styles.value, { color: cores.textPrimary }]}>
				{ getLabel() } { valorEstatistica }
			</Text>

			<View style={[styles.track, { backgroundColor: cores.border }]}>
				<Animated.View
					style={[
						styles.fill,
						{
							backgroundColor: color,
							width: widthAnim.interpolate({
								inputRange: [0, 1],
								outputRange: ["0%", "100%"],
							}),
						},
					]}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	row: {
		flexDirection: "row",
		alignItems: "center",
		marginVertical: 5,
		gap: 8,
	},

	label: {
		width: 60,
		fontSize: 11,
		fontWeight: "700",
		textTransform: "uppercase",
		letterSpacing: 0.5,
	},

	value: {
		width: 46,
		fontSize: 13,
		fontWeight: "700",
		textAlign: "right",
	},

	track: {
		flex: 1,
		height: 8,
		borderRadius: 999,
		overflow: "hidden",
	},

	fill: {
		height: "100%",
		borderRadius: 999,
	}
});