import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { Navigate, RouterProvider, createBrowserRouter } from "react-router"
import { GuestOnly, Layout, RequireAuth } from "./components/Layout"
import "./i18n"
import "./index.css"
import Account from "./pages/Account"
import Login from "./pages/Login"
import Register from "./pages/Register"
import ResetPassword from "./pages/ResetPassword"
import Wichteln from "./pages/wichteln/Wichteln"

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        element: <GuestOnly />,
        children: [
          { path: "/login", element: <Login /> },
          { path: "/register", element: <Register /> },
          { path: "/passwort-vergessen", element: <ResetPassword /> },
        ],
      },
      {
        element: <RequireAuth />,
        children: [
          { path: "/wichteln", element: <Wichteln /> },
          { path: "/konto", element: <Account /> },
        ],
      },
      { path: "*", element: <Navigate to="/wichteln" replace /> },
    ],
  },
])

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
