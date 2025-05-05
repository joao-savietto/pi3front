import { useState } from 'react'

import ErrorPage from './pages/error-page.jsx';

import Root from './pages/root.jsx';
import Login from './pages/login.jsx';
import EmptyHome from './pages/empty-home.jsx';
import { Outlet } from "react-router-dom";


import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Outlet />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Login />
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/home",
        element: <Root />,
        children: [
          {
            path: "",
            element: <EmptyHome />,
          },
          // Add other child routes here as needed
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />
}

export default App
