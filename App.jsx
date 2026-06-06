import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";

import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./src/context/ThemeProvider";

import { queryClient } from "./src/lib/queryClient";
import { setupReactQueryOnline } from "./src/lib/reactQueryOnline";
import { setupReactQueryFocus } from "./src/lib/reactQueryFocus";

import TabsLayout from "./src/screens/TabsLayout";

export default function App() {
	useEffect(() => {
		setupReactQueryFocus();
		setupReactQueryOnline();
  	}, []);

	return (
		<QueryClientProvider client={queryClient}>
			<SafeAreaProvider>
				<ThemeProvider>
					<NavigationContainer>
                        <TabsLayout/>
                    </NavigationContainer>
				</ThemeProvider>
			</SafeAreaProvider>
		</QueryClientProvider>
	)
}