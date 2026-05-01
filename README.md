# ProxyBioLine

## Description

Short circuit between the producer and the consumer of the product. The producer can sell his products directly to the consumer without going through intermediaries. The consumer can buy the product directly from the producer.

## Install dependencies

```bash
yarn install
```

## Config .env file

Copy `.env.example` to `.env` and fill in the values.

### Neon (PostgreSQL) + API locale

Les **comptes utilisateurs**, les **producteurs** et leurs positions sont stockés dans **Neon**. Le frontend appelle une API Express (`server/index.ts`) avec Prisma ; `DATABASE_URL` et `JWT_SECRET` restent côté serveur uniquement.

```bash
DATABASE_URL=<URL_de_connexion_Neon>
API_PORT=3001
JWT_SECRET=<chaîne_secrète_longue>
```

Dans la console Neon, copie l’URL **pooled** (pour l’app). Pour `prisma migrate`, si tu rencontres des erreurs avec le pooler, ajoute une URL **direct** (non `-pooler`) et `directUrl` dans `prisma/schema.prisma` (voir [doc Prisma + Neon](https://www.prisma.io/docs/guides/database/neon)).

Créer / mettre à jour les tables :

```bash
npx prisma migrate dev
```

Générer le client Prisma :

```bash
npx prisma generate
```

**Session :** après connexion ou inscription, un cookie httpOnly `proxibio_session` est posé. Les requêtes `fetch` vers `/api/auth/*` utilisent `credentials: "include"` ; le proxy Vite transmet les cookies en dev.

## Run the project

Lance Vite et l’API en parallèle :

```bash
yarn dev
```

Pour le frontend seul (sans API) :

```bash
yarn dev:web
```

## Production

Le build Vite (`npm run build`) ne contient pas l’API : il faut déployer `server/` avec les mêmes variables d’environnement, configurer CORS / cookies selon ton domaine, et faire pointer le frontend vers cette API (ou reverse-proxy `/api`).
