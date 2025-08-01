import { Route, Routes } from "react-router-dom";
import Dashboard from "../views/Dashboard/Dashboard";
import Login from "../views/Login/Login";
import type { ComponentType } from "react";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

export interface AppRoute {
  path: string;
  element: ComponentType;
  protected?: boolean;
  publicOnly?: boolean;
}

// Array of route definitions
export const routes: AppRoute[] = [
  {
    path: "/",
    element: Dashboard,
    protected: true,
  },
  {
    path: "/login",
    element: Login,
    publicOnly: true,
  },
];

// Render routes correctly
export const renderRoutes = (routes: AppRoute[]) => {
  return (
    <Routes>
      {routes?.map((route, idx) => {
        const Component = route.element;
        return (
          <Route
            key={idx}
            path={route.path}
            element={
              route.protected ? (
                <ProtectedRoute>
                  <Component />
                </ProtectedRoute>
              ) : route.publicOnly ? (
                <PublicRoute>
                  <Component />
                </PublicRoute>
              ) : (
                <Component />
              )
            }
          />
        );
      })}
    </Routes>
  );
};
