import React from "react";
import { ScrollView, TouchableOpacity, Text, StyleSheet } from "react-native";

import { useTheme } from "../context/ThemeProvider";
import { ALL_TYPES, TYPE_COLORS, TYPE_LABELS } from "../constants/typeColors";

export function TypeFilter({ tipoSelecionado, onTipoSelecionado }) {
	const { cores } = useTheme();

	return (
		<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.content} style={styles.scroll}>
			<TouchableOpacity
				style={[
					styles.chip,
					{
						backgroundColor: tipoSelecionado === null ? cores.primary : cores.surface,
						borderColor: tipoSelecionado === null ? cores.primary : cores.border,
					},
				]}
				onPress={() => onTipoSelecionado(null)}
				activeOpacity={0.75}
			>
				<Text
					style={[
						styles.chipText,
						{ color: tipoSelecionado === null ? "#fff" : cores.textSecondary },
					]}
				>
					🔴 Todos
				</Text>
			</TouchableOpacity>

			{ALL_TYPES.map(type => {
				const isActive = tipoSelecionado === type;
				const typeColor = TYPE_COLORS[type]?.primary ?? "#888";

				return (
					<TouchableOpacity
						key={type}
						style={[
							styles.chip,
							{
								backgroundColor: isActive ? typeColor : cores.surface,
								borderColor: isActive ? typeColor : cores.border,
							},
						]}
						onPress={() => onTipoSelecionado(isActive ? null : type)}
						activeOpacity={0.75}
					>
						<Text
							style={[
								styles.chipText,
								{
									color: isActive
										? TYPE_COLORS[type]?.text ?? "#fff"
										: cores.textSecondary,
								},
							]}
						>
							{TYPE_LABELS[type] ?? type}
						</Text>
					</TouchableOpacity>
				);
			})}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	scroll: {
		flexGrow: 0,
	},

	content: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		gap: 8,
		flexDirection: "row",
	},

	chip: {
		paddingHorizontal: 14,
		paddingVertical: 7,
		borderRadius: 999,
		borderWidth: 1.5,
	},

	chipText: {
		fontSize: 12,
		fontWeight: "600",
	},
});