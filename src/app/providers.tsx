import type { PropsWithChildren } from 'react'
import { Provider } from 'react-redux'

import { appStore } from '@/app/store'
import { ThemeProvider } from '@/hooks/use-theme'

type AppProvidersProps = PropsWithChildren

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <Provider store={appStore}>
      <ThemeProvider>{children}</ThemeProvider>
    </Provider>
  )
}
