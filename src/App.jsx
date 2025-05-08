import { useState } from 'react'

import ErrorPage from './pages/error-page.jsx';

import Root from './pages/root.jsx';
import Login from './pages/login.jsx';
import EmptyHome from './pages/empty-home.jsx';
import TalentManagementPage from './pages/talents.jsx'; // Added new page
import { Outlet } from "react-router-dom";


import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "",
        element: <EmptyHome />,
      },
      {
        path: "talents",
        element: <TalentManagementPage />,
      }
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />
}

export default App
