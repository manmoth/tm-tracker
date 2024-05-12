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

const router = createBrowserRouter([
  {
    path: "/",
    element: <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
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
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
