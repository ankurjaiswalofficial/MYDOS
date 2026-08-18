import { createTheme } from '@mui/material/styles'

// One theme object, both colour schemes. MUI v6+ resolves `light`/`dark` from
// the user's OS setting at runtime, so there is no toggle to wire up and no
// flash of the wrong palette on first paint.
export const theme = createTheme({
  colorSchemes: { light: true, dark: true },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: '"Inter", system-ui, -apple-system, "Segoe UI", sans-serif',
    button: { textTransform: 'none', fontWeight: 600 },
  },
})
