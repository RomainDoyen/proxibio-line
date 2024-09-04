import { useState } from "react";
import "./Dashboard.css";
import CardInfos from "../components/CardInfos";
import CardForm from "../components/CardForm";
import CardMaps from "../components/CardMaps";

const Dashboard: React.FC = () => {

  const [refreshMap, setRefreshMap] = useState<boolean>(false);

  const handleProducteurAdded = () => {
    // Changer l'état pour rafraîchir la carte
    setRefreshMap(prev => !prev);
  };
  
  return (
    <>
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