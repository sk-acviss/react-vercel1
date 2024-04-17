import React, { Suspense } from "react";
import "./App.css";

import "./assets/css/common.scss";
import {
  Navigate,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { SnackbarProvider } from "notistack";
import Login from "@components/common/login";
const Layout = React.lazy(() => import("@components/layout/layout"));
function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route
          path="/"
          element={
            localStorage.getItem("acvissToken") ? (
              <Suspense fallback={<div id="loader"></div>}>
                <Layout />
              </Suspense>
            ) : (
              <Navigate to={"/login"} />
            )
          }
        />
        <Route
          path="/login"
          element={
            localStorage.getItem("acvissToken") ? (
              <Navigate to={"/"} />
            ) : (
              <Suspense fallback={<div id="loader"></div>}>
                <Login />
              </Suspense>
            )
          }
        />
        <Route
          path="/:section/:details"
          element={
            localStorage.getItem("acvissToken") ? (
              <Suspense fallback={<div id="loader"></div>}>
                <Layout />
              </Suspense>
            ) : (
              <Navigate to={"/"} />
            )
          }
        />
        <Route
          path="/:section"
          element={
            localStorage.getItem("acvissToken") ? (
              <Suspense fallback={<div id="loader"></div>}>
                <Layout />
              </Suspense>
            ) : (
              <Navigate to={"/login"} />
            )
          }
        />
      </>
    )
  );
  return (
    <>
      <SnackbarProvider
        autoHideDuration={2000}
        maxSnack={3}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <div className="App">
          <RouterProvider router={router} />
        </div>
      </SnackbarProvider>
    </>
  );
}

export default App;
