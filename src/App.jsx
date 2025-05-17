import Root from './pages/root.jsx';
import Login from './pages/login.jsx';
import HomePage from './pages/home.jsx';
import TalentManagementPage from './pages/talents.jsx'; // Added new page
import ApplicationsKanbanPage from './pages/applications-kaban.jsx';

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
      },
      {
        path: "applications/:processId",
        element: <ApplicationsKanbanPage />,
      }      
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />
}

export default App
