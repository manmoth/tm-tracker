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
import GamesCurrent from './GamesCurrent.tsx'
import GamesPrevious from './GamesPrevious.tsx'
import Track from './Track.tsx'
import { QueryClient, QueryClientProvider } from 'react-query'
import StatsCurrent from './StatsCurrent.tsx'
import StatsPrevious from './StatsPrevious.tsx'

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
        element: <GamesCurrent />,
      },
      {
        path: "track",
        element: <Track />,
      },
      {
        path: "statsCurrent",
        element: <StatsCurrent />,
      },
      {
        path: "gamesPrevious",
        element: <GamesPrevious />,
      },
      {
        path: "statsPrevious",
        element: <StatsPrevious />,
      },
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
