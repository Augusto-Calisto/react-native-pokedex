import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";

import { useTheme } from "../context/ThemeProvider";

import Home from "./Home";
import FavoritesScreen from "./Favorites";

import { FavoritesProvider } from "../context/FavoriteProvider";


const Tab = createBottomTabNavigator();

export default function TabsLayout() {
    const { cores, isTemaEscuro } = useTheme();

    return (
        <FavoritesProvider>
            <Tab.Navigator
                key="navegacao-telas"
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: {
                        backgroundColor: isTemaEscuro ? cores.surface : "#fff",
                        borderTopColor: cores.border,
                        borderTopWidth: 1,
                        height: Platform.OS === "ios" ? 85 : 108,
                        paddingBottom: Platform.OS === "ios" ? 24 : 8,
                        paddingTop: 8,
                        elevation: 0,
                    },
                    tabBarActiveTintColor: cores.primary,
                    tabBarInactiveTintColor: cores.textMuted,
                    tabBarLabelStyle: {
                        fontSize: 11,
                        fontWeight: "600",
                    },
                }}
            >
                <Tab.Screen
                    key="tela-exibicao-pokemons"
                    name="index"
                    component={Home}
                    options={{
                        title: "Pokédex",
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="grid" size={size} color={color} />
                        ),
                    }}
                />

                <Tab.Screen
                    key="tela-pokemons-favoritos"
                    name="favorites"
                    component={FavoritesScreen}
                    options={{
                        title: "Favoritos",
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="heart" size={size} color={color} />
                        ),
                    }}
                />
            </Tab.Navigator>
        </FavoritesProvider>
    );
}