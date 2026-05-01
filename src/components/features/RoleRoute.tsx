import { useContext, type FC } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserAuthContext } from "../../context/UserAuthContext";
import type { UserAuthContextType } from "../../types/userTypes";
import type { UserRole } from "../../types/userTypes";

type RoleRouteProps = {
  allowedRoles: UserRole[];
};

const RoleRoute: FC<RoleRouteProps> = ({ allowedRoles }) => {
  const context = useContext(UserAuthContext);
  const user = (context as UserAuthContextType | undefined)?.user ?? null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
