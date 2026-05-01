import type { ProducteurType } from "../../types/productTypes";
import { labelForSellsId, labelForTagId } from "../../constants/producerProfile";

function normalizeUrl(raw: string): string {
  const t = raw.trim();
  if (!t) return "";
  if (/^https?:\/\//i.test(t)) return t;
  return `https://${t}`;
}

function instagramHref(raw: string): string {
  const t = raw.trim();
  if (!t) return "";
  if (/^https?:\/\//i.test(t)) return t;
  const h = t.replace(/^@/, "");
  return `https://www.instagram.com/${encodeURIComponent(h)}`;
}

function facebookHref(raw: string): string {
  const t = raw.trim();
  if (!t) return "";
  if (/^https?:\/\//i.test(t)) return t;
  return `https://www.facebook.com/${encodeURIComponent(t)}`;
}

export function MapProducerPopup({ producteur: p }: { producteur: ProducteurType }): JSX.Element {
  const desc = p.description?.trim();
  const descShort =
    desc && desc.length > 240 ? `${desc.slice(0, 240).trim()}…` : desc;
  const tel = p.phone?.trim();
  const telHref = tel ? `tel:${tel.replace(/\s/g, "")}` : "";
  const mail = p.contactEmail?.trim();
  const web = p.website?.trim();
  const ig = p.instagram?.trim();
  const fb = p.facebook?.trim();

  return (
    <div className="map-popup">
      {p.profileImageUrl ? (
        <div className="map-popup__media">
          <img src={p.profileImageUrl} alt="" className="map-popup__photo" />
        </div>
      ) : null}
      <span className="map-popup__eyebrow">Producteur</span>
      <h3 className="map-popup__title">{p.name}</h3>
      <p className="map-popup__enterprise">{p.nameEnterprise}</p>
      {(p.tags ?? []).length > 0 && (
        <ul className="map-popup__pills" aria-label="Activités">
          {(p.tags ?? []).map((id) => (
            <li key={id} className="map-popup__pill map-popup__pill--tag">
              {labelForTagId(id)}
            </li>
          ))}
        </ul>
      )}
      {(p.sellsCategories ?? []).length > 0 && (
        <ul className="map-popup__pills" aria-label="Produits">
          {(p.sellsCategories ?? []).map((id) => (
            <li key={id} className="map-popup__pill map-popup__pill--sell">
              {labelForSellsId(id)}
            </li>
          ))}
        </ul>
      )}
      {descShort ? <p className="map-popup__desc">{descShort}</p> : null}
      <p className="map-popup__address">{p.address}</p>
      {(tel || mail || web || ig || fb) && (
        <div className="map-popup__contact">
          {tel && (
            <a href={telHref} className="map-popup__link">
              {tel}
            </a>
          )}
          {mail && (
            <a href={`mailto:${encodeURIComponent(mail)}`} className="map-popup__link">
              {mail}
            </a>
          )}
          {web && (
            <a
              href={normalizeUrl(web)}
              className="map-popup__link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Site web
            </a>
          )}
          {ig && (
            <a
              href={instagramHref(ig)}
              className="map-popup__link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
          )}
          {fb && (
            <a
              href={facebookHref(fb)}
              className="map-popup__link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook
            </a>
          )}
        </div>
      )}
    </div>
  );
}
