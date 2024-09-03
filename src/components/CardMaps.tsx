import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { abIcon, venteDirectIcon } from "../utils/customMarker";
import { supabase } from "../config/index";
import { useState, useEffect } from "react";
import { createClusterCustomIcon } from "../utils/function";
import './CardMaps.css';
import { CardMapsProps, ProducteurType } from "../types/types";

export default function CardMaps({ refreshMap }: CardMapsProps): JSX.Element {
  const [producteurs, setProducteurs] = useState<ProducteurType[]>([]);

  const fetchProducteurs = async (): Promise<void> => {
    try {
      const { data: producteursData, error: producteursError } = await supabase
        .from('Producteur')
        .select('*');

      if (producteursError) {
        throw producteursError;
      }

      const producteursWithPositions = await Promise.all(
        producteursData.map(async (producteur): Promise<ProducteurType> => {
          const { data: positionsData, error: positionsError } = await supabase
            .from('positionProducteur')
            .select('*')
            .eq('producteurId', producteur.id);

          if (positionsError) {
            throw positionsError;
          }

          return {
            ...producteur,
            positionProducteurs: positionsData || [],
          };
        })
      );

      setProducteurs(producteursWithPositions);
    } catch (error) {
      console.error("Erreur lors de la récupération des producteurs :", (error as Error).message);
    }
  };

  useEffect(() => {
    fetchProducteurs();
  }, [refreshMap]);

  return (
    <MapContainer center={[-21.12165459276416, 55.54070004999999]} zoom={10} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup
        chunkedLoading
        iconCreateFunction={createClusterCustomIcon}
      >
        {producteurs.map((producteur, index) => {
          if (!producteur.positionProducteur || producteur.positionProducteur.length === 0) {
            return null;
          }

          const position = producteur.positionProducteur[0];
          return (
            <Marker
              key={index}
              position={[position.latitude, position.longitude]}
              icon={position.marker === 'ab' ? abIcon : venteDirectIcon}
            >
              <Popup>
                <div>
                  <strong>{producteur.name}</strong><br />
                  <em>{producteur.nameEnteprise}</em><br />
                  {producteur.address}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MarkerClusterGroup>
    </MapContainer>
  );
}
