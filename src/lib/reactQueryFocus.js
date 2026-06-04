import { AppState, Platform } from "react-native";
import { focusManager } from "@tanstack/react-query";

export function setupReactQueryFocus() {
    if (Platform.OS === "web") return;

    AppState.addEventListener("change", status => {
        focusManager.setFocused(status === "active");
    })
}