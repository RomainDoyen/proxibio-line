import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { UserAuthContext } from "../context/UserAuthContext";
import { UserAuthContextType } from "../types/types";

const PrivateRoute: React.FC = () => {
  const { user } = useContext<UserAuthContextType | undefined>(UserAuthContext) || {};

  return user ? <Outlet /> : <Navigate to={"/login"} />;
};

export default PrivateRoute;
