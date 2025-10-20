import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "./theme"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { clientId } from "@/conf"

// Debug Google Client ID
console.log('Google Client ID loaded:', clientId)

// src/contexts
export function GlobalProvider({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={new QueryClient()}>
            <GoogleOAuthProvider clientId={clientId}>
                <ThemeProvider>
                    {children}
                    <Toaster position="top-right"/>
                </ThemeProvider>
            </GoogleOAuthProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    )
}