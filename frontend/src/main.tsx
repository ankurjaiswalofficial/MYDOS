import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import App from './App.tsx'
import { theme } from './theme.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme} defaultMode="system">
      {/* CssBaseline applies the theme's background to <body>. Without it the
          page keeps the browser's white while every component is dark. */}
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
)
