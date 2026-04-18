import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import NotFound from "./pages/NotFound";
import Home from  "./pages/Home";
import Login from "./pages/login";
import Income from "./pages/income";
import Investments from "./pages/investments";
import Expenses from "./pages/DebtExpenses";
import Links from "./pages/links";
// Add additional pages from the pages file like above
// Include them as a path under children
// Currently, links are used in the header

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: "Login", element: <Login />},
      { path: "Income", element: <Income />},
      { path: "Investments", element: <Investments />},
      { path: "Expenses", element: <Expenses />},
      { path: "Links", element: <Links /> },
      
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
