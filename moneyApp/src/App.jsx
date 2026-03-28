import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import Home from  "./pages/Home";
import Constants from "./pages/Constants";
import NotFound from "./pages/NotFound";
import Example from "./pages/Example";
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
      { path: "constants", element: <Constants /> },
      { path: "example", element: <Example />},
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
