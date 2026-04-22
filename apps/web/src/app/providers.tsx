import { QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import type { ReactNode } from 'react'
import { createAppQueryClient } from '../lib/queryClient'

export function AppProviders({ children }: { children: ReactNode }) {
  const [client] = useState(() => createAppQueryClient())
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

