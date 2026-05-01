import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, Tooltip } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { CardMapsProps } from "../../types/uiTypes";
import { ProducteurType } from "../../types/productTypes";
import { createClusterCustomIcon, createProducerMarkerIcon } from "../../utils/customMarker";
import { EnableZoomButton } from "./EnableZoomButton";
import { MapProducerPopup } from "./MapProducerPopup";
import './CardMaps.css';

export default function CardMaps({ refreshMap }: CardMapsProps): JSX.Element {
  const [producteurs, setProducteurs] = useState<ProducteurType[]>([]);

  const fetchProducteurs = async (): Promise<void> => {
    try {
      const res = await fetch('/api/producteurs');
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const producteursWithPositions = (await res.json()) as ProducteurType[];
      setProducteurs(producteursWithPositions);
    } catch (error) {
      console.error("Erreur lors de la récupération des producteurs :", (error as Error).message);
    }
  };

  useEffect(() => {
    fetchProducteurs();
  }, [refreshMap]);

  return (
    <MapContainer
      className="card-maps-leaflet"
      center={[-21.12165459276416, 55.54070004999999]}
      zoom={10}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup
        chunkedLoading
        iconCreateFunction={createClusterCustomIcon}
      >
        {producteurs.map((producteur) => {
          if (!producteur.positionProducteur || producteur.positionProducteur.length === 0) {
            return null;
          }

          const position = producteur.positionProducteur[0];
          return (
            <Marker
              key={producteur.id}
              position={[position.latitude, position.longitude]}
              icon={createProducerMarkerIcon(position.marker)}
            >
              <Popup className="map-popup-shell" maxWidth={340} minWidth={280}>
                <MapProducerPopup producteur={producteur} />
              </Popup>
              <Tooltip
                direction="top"
                offset={[0, -14]}
                opacity={1}
                className="map-marker-tooltip"
              >
                {producteur.nameEnterprise}
              </Tooltip>
            </Marker>
          );
        })}
      </MarkerClusterGroup>
      <EnableZoomButton />
    </MapContainer>
  );
}
