import { useContext } from "react";
// import "./Dashboard.css";
import { UserAuthContext } from "../context/UserAuthContext";
import { UserAuthContextType } from "../types/types";

const Dashboard: React.FC = () => {
  const { user } = useContext<UserAuthContextType | undefined>(UserAuthContext) || {};

  // console.log(user);
  
  return (
    <>
      <div className="user-info">
        <h2>Utilisateur actuellement connecté</h2>
        <div className="user-details">
          <p>Nom: {user?.name || user?.providerUid || ""}</p>
          <p>Email: {user?.email || user?.providerUid || ""}</p>
        </div>
      </div>
      <div className="dashboard-container">
        <div className="form-container">

          <img src="./src/assets/loca.PNG" />
        </div>
        <div className="map-container">

        </div>
      </div>
    </>
  );
};

export default Dashboard;