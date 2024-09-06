import { useMap } from "react-leaflet";
import { useState } from "react";
import './EnableZoomButton.css';
import Button from "../ui/Button";

export function EnableZoomButton(): JSX.Element {
  const map = useMap();
  const [zoomEnabled, setZoomEnabled] = useState<boolean>(false);

  const handleEnableZoom = () => {
    map.scrollWheelZoom.enable();
    setZoomEnabled(true);
    // alert("Zoom réactivé !");
  };

  const handleDisableZoom = () => {
    map.scrollWheelZoom.disable();
    setZoomEnabled(false);
    // alert("Zoom désactivé !");
  };

  return (
    <div className="zoom-control-buttons">
      {!zoomEnabled && (
        <Button 
          text="Activer le zoom" 
          onClick={handleEnableZoom} 
          className="enable-zoom-button"
        />
      )}
      {zoomEnabled && (
        <Button
          text="Désactiver le zoom"
          onClick={handleDisableZoom}
          className="disable-zoom-button"
        />
      )}
    </div>
  );
}