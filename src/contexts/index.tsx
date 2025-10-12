import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "./theme"

// src/contexts
export function GlobalProvider({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            {children}
            <Toaster position="top-right"/>
        </ThemeProvider>
    )
}