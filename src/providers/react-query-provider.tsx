"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

type ReactQueryProviderProps = {
    children: React.ReactNode
}

const client = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
})

export const ReactQueryProvider = ({ children }: ReactQueryProviderProps) => {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
