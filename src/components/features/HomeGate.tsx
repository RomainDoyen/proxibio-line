import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import { UserAuthContext } from "../../context/UserAuthContext";
import { UserAuthContextType } from "../../types/userTypes";
import Dashboard from "../../pages/Dashboard";
import Welcome from "../../pages/Welcome";
import "./HomeGate.css";

const HomeGate: React.FC = () => {
  const { user, isLoading } = useContext(UserAuthContext) as UserAuthContextType;

  if (isLoading) {
    return (
      <div className="home-gate-loading" aria-busy="true" aria-live="polite">
        <TailSpin
          height={40}
          width={40}
          color="#5eead4"
          ariaLabel="Chargement"
        />
      </div>
    );
  }

  if (!user) {
    return <Welcome />;
  }
  if (user.role === "ADMIN") {
    return <Navigate to="/admin" replace />;
  }
  return <Dashboard />;
};

export default HomeGate;
