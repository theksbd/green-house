import { auth } from "./auth";
import { Navigate } from "react-router-dom";

export const RequireLogin = ({ children }) => {
  if (auth()) {
    return children;
  }
  return <Navigate to="/" />;
};
