import { useState } from "react";
import CardForm from "../components/features/CardForm";
import CardInfos from "../components/features/CardInfos";
import CardMaps from "../components/features/CardMaps";
import "./Dashboard.css";
import Image from "../components/ui/Image";

const Dashboard: React.FC = () => {

  const [refreshMap, setRefreshMap] = useState<boolean>(false);

  const handleProducteurAdded = () => {
    setRefreshMap(prev => !prev);
  };
  
  return (
    <div className="dashboard-container">
      <div className="dashboard-form-column" id="add-producer">
        <CardForm onProducteurAdded={handleProducteurAdded} />
        <Image src="./src/assets/loca.PNG" alt="Instructions pour ajouter un producteur" className="instruction-img" />
      </div>
      <div className="dashboard-map-column">
        <CardInfos />
        <CardMaps refreshMap={refreshMap} />
      </div>
    </div>
  );
};

export default Dashboard;