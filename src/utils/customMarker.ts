import { Icon } from "leaflet";
import { IconOption } from "../types/types";

// Créer une icône personnalisée
export const abIcon: Icon = new Icon<IconOption>({
  iconUrl: "./src/assets/ab.png",
  iconSize: [38, 38] // taille de l'icône
});

export const venteDirectIcon: Icon = new Icon<IconOption>({
  iconUrl: "./src/assets/vente-direct.png",
  iconSize: [38, 38] // taille de l'icône
});