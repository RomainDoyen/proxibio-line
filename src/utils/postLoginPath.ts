import type { UserRole } from "../types/userTypes";

/** Destination après connexion (ou accueil) selon le rôle */
export function postLoginPath(role: UserRole): string {
  return role === "ADMIN" ? "/admin" : "/";
}
