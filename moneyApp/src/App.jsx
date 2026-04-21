import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Login from "./pages/login";
import Income from "./pages/income";
import Investments from "./pages/investments";
import Expenses from "./pages/DebtExpenses";
import Links from "./pages/links";
import CreateAcc from "./pages/createAcc";
import Profile from "./pages/profile";
import CalculatorPage from "./pages/calc";
import Advice from "./pages/Advice";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "income", element: <Income /> },
      { path: "investments", element: <Investments /> },
      { path: "expenses", element: <Expenses /> },
      { path: "advice", element: <Advice /> },
      { path: "create-account", element: <CreateAcc /> },
      { path: "links", element: <Links /> },
      { path: "profile", element: <Profile /> },
      { path: "calculator", element: <CalculatorPage /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}