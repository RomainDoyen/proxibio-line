# ProxyBioLine

## Description

Short circuit between the producer and the consumer of the product. The producer can sell his products directly to the consumer without going through intermediaries. The consumer can buy the product directly from the producer.

## Install dependencies

```bash
yarn install
```

## Config .env file

Create a `.env` file in the root of the project and add the following content:

### Appwrite API

```bash
VITE_APPWRITE_PROJECT_ID=<YOUR_APPWRITE_PROJECT_ID>
```

### Supabase API

```bash
VITE_SUPABASE_URL=<YOUR_SUPABASE_URL>
VITE_SUPABASE_ANON_KEY=<YOUR_SUPABASE_ANON_KEY>
```

### Prisma

```bash
DATABASE_URL=<YOUR_DATABASE_URL>
```
Run a migration to create your database tables with Prisma Migrate

```bash
npx prisma migrate dev --name init
```
Generate Prisma Client

```bash
npx prisma generate
```
## Run the project

```bash
yarn dev
```
