import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from '@emotion/react'
import { CssBaseline } from '@mui/material';
import theme from './theme.tsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ErrorPage from './ErrorPage.tsx'
import Games from './Games.tsx'
import Track from './Track.tsx'
import { QueryClient, QueryClientProvider } from 'react-query'
import Stats from './Stats.tsx'

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: "/",
    element: <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ThemeProvider>,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Games />,
      },
      {
        path: "track",
        element: <Track />,
      },
      {
        path: "stats",
        element: <Stats />,
      },
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
