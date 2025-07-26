import { createBrowserRouter } from "react-router-dom";
import Layout from "./pages/Layout";
import Login from "./pages/LoginPage";
import Signup from "./pages/SignUpPage";
import AdminRoutes from "./pages/AdminRoutes";
import Dashboard from "./pages/Dashboard";

import ItemsPage from "./pages/BooksPage.tsx";

import BooksPage from "./pages/BooksPage";
import ReadersPage from "./pages/ReadersPage";
import LendingPage from "./pages/LendingPage";
import HomePage from "./pages/HomePage.tsx";
import OverdueManagementPage from "./pages/OverdueManagementPage";
import UsersPage from "./pages/UserPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      {
        element: <AdminRoutes />,
        children: [
          { path: "/dashboard", element: <Dashboard /> },
          { path: "/dashboard/items", element: <ItemsPage /> },
          { path: "/dashboard/books", element: <BooksPage /> },
          { path: "/dashboard/readers", element: <ReadersPage /> },
          { path: "/dashboard/lending", element: <LendingPage /> },
          { path: "/dashboard/overdue", element: <OverdueManagementPage /> },
          { path: "/dashboard/user", element: <UsersPage /> },
        ],
      },
    ],
  },
]);

export default router;
