import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Folders, {
  action as foldersAction,
  loader as foldersLoader,
} from "./routes/folders.$id";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import Root, { loader as rootLoader } from "./routes/root";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    loader: rootLoader,
    children: [
      {
        path: "/folders/:folderId?",
        element: <Folders />,
        loader: foldersLoader,
        action: foldersAction,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
