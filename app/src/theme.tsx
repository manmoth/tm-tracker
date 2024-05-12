import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      light: '#3b424c',
      main: '#0b1320',
      dark: '#070d16',
      contrastText: '#fff',
    },
    secondary: {
      light: '#a4d2db',
      main: '#8ec7d2',
      dark: '#638b93',
      contrastText: '#000'
    },
    error: {
      main: red.A400,
    },
  },
});

export default theme;