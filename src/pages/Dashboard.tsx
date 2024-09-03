import { useContext, useState } from "react";
// import "./Dashboard.css";
import { UserAuthContext } from "../context/UserAuthContext";
import { UserAuthContextType } from "../types/types";
import CardInfos from "../components/CardInfos";
import CardForm from "../components/CardForm";
import CardMaps from "../components/CardMaps";

const Dashboard: React.FC = () => {
  const { user } = useContext<UserAuthContextType | undefined>(UserAuthContext) || {};

  const [refreshMap, setRefreshMap] = useState<boolean>(false);

  const handleProducteurAdded = () => {
    // Change the state to trigger the map refresh
    setRefreshMap(prev => !prev);
  };

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
          <CardForm onProducteurAdded={handleProducteurAdded} />
          <img src="./src/assets/loca.PNG" />
        </div>
        <div className="map-container">
          <CardInfos />
          <CardMaps refreshMap={refreshMap} />
        </div>
      </div>
    </>
  );
};

export default Dashboard;