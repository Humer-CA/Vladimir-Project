import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import LoginPage from "../Layout/LoginPage";

export const PrivateRoutes = () => {
  const token = localStorage.getItem("token");
  let auth = { token };
  return auth.token ? <Outlet /> : <Navigate to="/login" />;
  // return <Outlet />;
};

export const LoginRoutes = () => {
  const token = localStorage.getItem("token");
  let auth = { token };
  return auth.token ? <Navigate to="/" /> : <LoginPage />;
  // return <Outlet />;
};
