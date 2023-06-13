import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
// routes
import { ProSidebarProvider } from 'react-pro-sidebar';
import { ThemeProvider, createTheme } from '@mui/material';
import { useEffect } from 'react';
import Router from './routes/routes';

// ----------------------------------------------------------------------

const theme = createTheme({
  palette: {
    primary: {
      main: '#0FB203',
    },
    secondary: {
      main: '#0FB203',
    },
  },
  typography: {
    fontFamily: 'Poppins',
  },
});

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <ProSidebarProvider>
            <Router />
          </ProSidebarProvider>
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}