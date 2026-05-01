import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserAuthContext } from "../../context/UserAuthContext";
import { UserAuthContextType } from "../../types/userTypes";

const PrivateRoute: React.FC = () => {
  const ctx = useContext(UserAuthContext);
  const user = (ctx as UserAuthContextType | undefined)?.user ?? null;

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
