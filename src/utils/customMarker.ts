import L, { point, Point, DivIcon, MarkerCluster } from "leaflet";
import abUrl from "../assets/ab.png?url";
import vdUrl from "../assets/vente-direct.png?url";

const AB_IMG = abUrl;
const VD_IMG = vdUrl;

const PIN_W = 46;
const PIN_H = 54;

/** Épingle carte : ancrage bas-centre, image dans un disque bordé dégradé */
export function createProducerMarkerIcon(markerType: string): DivIcon {
  const isAb = markerType === "ab";
  const imgSrc = isAb ? AB_IMG : VD_IMG;
  const variant = isAb ? "ab" : "vd";

  return L.divIcon({
    className: "map-marker-pin-wrap",
    html: `
      <div class="map-marker-pin map-marker-pin--${variant}">
        <div class="map-marker-pin__ring">
          <div class="map-marker-pin__face">
            <img src="${imgSrc}" alt="" width="34" height="34" decoding="async" />
          </div>
        </div>
        <div class="map-marker-pin__point" aria-hidden="true"></div>
      </div>
    `,
    iconSize: point(PIN_W, PIN_H) as Point,
    iconAnchor: point(PIN_W / 2, PIN_H) as Point,
    popupAnchor: point(0, -PIN_H + 10) as Point,
  });
}

export const createClusterCustomIcon = function (cluster: MarkerCluster): DivIcon {
  const n = cluster.getChildCount();
  const size = n < 10 ? 40 : n < 100 ? 46 : 52;
  return L.divIcon({
    html: `<span class="cluster-icon"><span class="cluster-icon__value">${n}</span></span>`,
    className: "custom-marker-cluster",
    iconSize: point(size, size, true) as Point,
  });
};
