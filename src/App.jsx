import Root from './pages/root.jsx';
import Login from './pages/login.jsx';
import HomePage from './pages/home.jsx';
import TalentManagementPage from './pages/talents.jsx'; // Added new page


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
        element: <HomePage />,
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
