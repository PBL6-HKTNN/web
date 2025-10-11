import { ThemeProvider } from "./theme"

// src/contexts
export function GlobalProvider({ children }: { children: React.ReactNode }) {
    return <ThemeProvider>{children}</ThemeProvider>
}