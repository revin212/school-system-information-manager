import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import faviconUrl from './assets/ikon-sekolah.png'
import { AppProviders } from './app/providers'
import { AppRouter } from './app/router'

{
  let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
  if (!link) {
    link = document.createElement('link')
    link.rel = 'icon'
    document.head.appendChild(link)
  }
  link.type = 'image/png'
  link.href = faviconUrl
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <AppRouter />
    </AppProviders>
  </StrictMode>,
)
