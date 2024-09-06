import L, { Icon, point, Point, DivIcon, MarkerCluster } from "leaflet";
import { IconOption } from "../types/mapTypes";

// Créer une icône personnalisée
export const abIcon: Icon = new Icon<IconOption>({
  iconUrl: "./src/assets/ab.png",
  iconSize: [38, 38] // taille de l'icône
});

export const venteDirectIcon: Icon = new Icon<IconOption>({
  iconUrl: "./src/assets/vente-direct.png",
  iconSize: [38, 38] // taille de l'icône
});

export const createClusterCustomIcon = function (cluster: MarkerCluster): DivIcon {
  return L.divIcon({
    html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
    className: "custom-marker-cluster",
    iconSize: point(33, 33, true) as Point
  });
};