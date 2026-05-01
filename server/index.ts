import 'dotenv/config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import type { ContributionStatus, Role } from '@prisma/client';
import { prisma } from './db';
import {
  hashPassword,
  SESSION_COOKIE,
  sessionCookieOptions,
  signSessionToken,
  verifyPassword,
  verifySessionToken,
} from './auth';
import { getAuthUser } from './session';
import { sanitizeProducerProfileBody } from './producerProfilePayload';

const app = express();
const port = Number(process.env.API_PORT) || 3001;

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json({ limit: '2mb' }));

function publicUser(u: { id: string; email: string; name: string; role: Role }) {
  return { id: u.id, email: u.email, name: u.name, role: u.role };
}

function parseBootstrapAdminEmails(): string[] {
  const raw = process.env.ADMIN_BOOTSTRAP_EMAILS || '';
  return raw
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

function csvEscape(cell: string): string {
  const s = String(cell ?? '');
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function seriesLastDays(items: { createdAt: Date }[], days: number): { date: string; count: number }[] {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (days - 1));
  const keys: string[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    keys.push(d.toISOString().slice(0, 10));
  }
  const counts = new Map(keys.map((k) => [k, 0]));
  for (const it of items) {
    const k = new Date(it.createdAt).toISOString().slice(0, 10);
    if (counts.has(k)) counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return keys.map((date) => ({ date, count: counts.get(date) ?? 0 }));
}

app.get('/api/auth/me', async (req, res) => {
  try {
    const token = req.cookies[SESSION_COOKIE] as string | undefined;
    if (!token) {
      res.status(401).json({ error: 'non_authentifié' });
      return;
    }
    const { sub: userId } = verifySessionToken(token);
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(401).json({ error: 'session_invalide' });
      return;
    }
    res.json(publicUser(user));
  } catch {
    res.status(401).json({ error: 'session_invalide' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, name, password } = req.body as {
      email?: string;
      name?: string;
      password?: string;
    };

    if (typeof email !== 'string' || typeof name !== 'string' || typeof password !== 'string') {
      res.status(400).json({ error: 'payload_invalide' });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      res.status(409).json({ error: 'email_déjà_utilisé' });
      return;
    }

    const passwordHash = await hashPassword(password);
    const role: Role = parseBootstrapAdminEmails().includes(normalizedEmail) ? 'ADMIN' : 'USER';

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name: name.trim(),
        passwordHash,
        role,
      },
    });

    const token = signSessionToken(user.id);
    res.cookie(SESSION_COOKIE, token, sessionCookieOptions());
    res.status(201).json(publicUser(user));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'inscription_échouée' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body as { email?: string; password?: string };
    if (typeof email !== 'string' || typeof password !== 'string') {
      res.status(400).json({ error: 'payload_invalide' });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user) {
      res.status(401).json({ error: 'identifiants_invalides' });
      return;
    }

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) {
      res.status(401).json({ error: 'identifiants_invalides' });
      return;
    }

    const token = signSessionToken(user.id);
    res.cookie(SESSION_COOKIE, token, sessionCookieOptions());
    res.json(publicUser(user));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'connexion_échouée' });
  }
});

app.post('/api/auth/logout', (_req, res) => {
  res.clearCookie(SESSION_COOKIE, { path: '/', httpOnly: true, sameSite: 'lax' });
  res.status(204).end();
});

const NOMINATIM_SEARCH = 'https://nominatim.openstreetmap.org/search';
const nominatimFetchHeaders = {
  'User-Agent': 'ProxiBioLine/1.0',
  'Accept-Language': 'fr',
} as const;

app.get('/api/places/search', async (req, res) => {
  try {
    const q = req.query.q;
    if (typeof q !== 'string' || q.trim().length < 2) {
      res.status(400).json({ error: 'requête_trop_courte' });
      return;
    }
    const limitRaw = parseInt(String(req.query.limit), 10);
    const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 10) : 5;
    const url = `${NOMINATIM_SEARCH}?q=${encodeURIComponent(q.trim())}&format=json&limit=${limit}`;
    const upstream = await fetch(url, { headers: nominatimFetchHeaders });
    if (!upstream.ok) {
      res.status(502).json({ error: 'service_geocodage' });
      return;
    }
    const data: unknown = await upstream.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'geocodage_échoué' });
  }
});

/** Carte publique : fiches validées uniquement */
app.get('/api/producteurs', async (_req, res) => {
  try {
    const producteurs = await prisma.producteur.findMany({
      where: { status: 'APPROVED' },
      include: { positionProducteur: true },
      orderBy: { id: 'asc' },
    });
    res.json(producteurs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la lecture des producteurs' });
  }
});

app.get('/api/producteurs/mine', async (req, res) => {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      res.status(401).json({ error: 'non_authentifié' });
      return;
    }
    if (user.role !== 'PRODUCER') {
      res.status(403).json({ error: 'réservé_aux_producteurs' });
      return;
    }
    const producteurs = await prisma.producteur.findMany({
      where: { ownerUserId: user.id },
      include: { positionProducteur: true },
      orderBy: { updatedAt: 'desc' },
    });
    res.json(producteurs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'lecture_échouée' });
  }
});

app.post('/api/producteurs', async (req, res) => {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      res.status(401).json({ error: 'connexion_requise' });
      return;
    }

    const body = req.body as Record<string, unknown>;
    const { name, nameEnterprise, address, latitude, longitude, marker } = body as {
      name?: string;
      nameEnterprise?: string;
      address?: string;
      latitude?: number;
      longitude?: number;
      marker?: string;
    };

    if (
      typeof name !== 'string' ||
      typeof nameEnterprise !== 'string' ||
      typeof address !== 'string' ||
      typeof latitude !== 'number' ||
      typeof longitude !== 'number' ||
      typeof marker !== 'string'
    ) {
      res.status(400).json({ error: 'Payload invalide' });
      return;
    }

    const profileExtras =
      user.role === 'PRODUCER'
        ? sanitizeProducerProfileBody(body)
        : sanitizeProducerProfileBody({});

    const existing = await prisma.producteur.findFirst({ where: { address } });
    if (existing) {
      res.status(409).json({ error: 'address_exists' });
      return;
    }

    const ownerUserId = user.role === 'PRODUCER' ? user.id : null;
    const status: ContributionStatus = user.role === 'USER' ? 'PENDING' : 'APPROVED';

    const created = await prisma.$transaction(async (tx) => {
      const producteur = await tx.producteur.create({
        data: {
          name,
          nameEnterprise,
          address,
          status,
          createdByUserId: user.id,
          ownerUserId,
          ...(user.role === 'PRODUCER' ? profileExtras : {}),
        },
      });
      await tx.positionProducteur.create({
        data: { producteurId: producteur.id, latitude, longitude, marker },
      });
      return tx.producteur.findUnique({
        where: { id: producteur.id },
        include: { positionProducteur: true },
      });
    });

    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la création du producteur' });
  }
});

app.patch('/api/producteurs/:id', async (req, res) => {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      res.status(401).json({ error: 'non_authentifié' });
      return;
    }

    const id = parseInt(req.params.id, 10);
    if (!Number.isFinite(id)) {
      res.status(400).json({ error: 'id_invalide' });
      return;
    }

    const existing = await prisma.producteur.findUnique({
      where: { id },
      include: { positionProducteur: true },
    });
    if (!existing) {
      res.status(404).json({ error: 'introuvable' });
      return;
    }

    const isOwner = existing.ownerUserId === user.id;
    const isContributor = existing.createdByUserId === user.id && existing.ownerUserId === null;
    const canEdit = user.role === 'ADMIN' || isOwner || isContributor;
    if (!canEdit) {
      res.status(403).json({ error: 'interdit' });
      return;
    }

    const patchBody = req.body as Record<string, unknown>;
    const { name, nameEnterprise, address, latitude, longitude, marker } = patchBody as {
      name?: string;
      nameEnterprise?: string;
      address?: string;
      latitude?: number;
      longitude?: number;
      marker?: string;
    };

    if (
      typeof name !== 'string' ||
      typeof nameEnterprise !== 'string' ||
      typeof address !== 'string' ||
      typeof latitude !== 'number' ||
      typeof longitude !== 'number' ||
      typeof marker !== 'string'
    ) {
      res.status(400).json({ error: 'payload_invalide' });
      return;
    }

    const profilePatch = sanitizeProducerProfileBody(patchBody);

    if (address !== existing.address) {
      const addrTaken = await prisma.producteur.findFirst({
        where: { address, NOT: { id } },
      });
      if (addrTaken) {
        res.status(409).json({ error: 'address_exists' });
        return;
      }
    }

    const pos = existing.positionProducteur[0];
    if (!pos) {
      res.status(400).json({ error: 'position_manquante' });
      return;
    }

    await prisma.$transaction([
      prisma.producteur.update({
        where: { id },
        data: { name, nameEnterprise, address, ...profilePatch },
      }),
      prisma.positionProducteur.update({
        where: { id: pos.id },
        data: { latitude, longitude, marker },
      }),
    ]);

    const updated = await prisma.producteur.findUnique({
      where: { id },
      include: { positionProducteur: true },
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'mise_à_jour_échouée' });
  }
});

app.delete('/api/producteurs/:id', async (req, res) => {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      res.status(401).json({ error: 'non_authentifié' });
      return;
    }

    const id = parseInt(req.params.id, 10);
    if (!Number.isFinite(id)) {
      res.status(400).json({ error: 'id_invalide' });
      return;
    }

    const existing = await prisma.producteur.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ error: 'introuvable' });
      return;
    }

    const isOwner = existing.ownerUserId === user.id;
    const isContributor = existing.createdByUserId === user.id && existing.ownerUserId === null;
    const canDelete = user.role === 'ADMIN' || isOwner || isContributor;
    if (!canDelete) {
      res.status(403).json({ error: 'interdit' });
      return;
    }

    await prisma.producteur.delete({ where: { id } });
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'suppression_échouée' });
  }
});

app.get('/api/admin/users', async (req, res) => {
  try {
    const user = await getAuthUser(req);
    if (!user || user.role !== 'ADMIN') {
      res.status(403).json({ error: 'interdit' });
      return;
    }
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'lecture_échouée' });
  }
});

app.patch('/api/admin/users/:id/role', async (req, res) => {
  try {
    const admin = await getAuthUser(req);
    if (!admin || admin.role !== 'ADMIN') {
      res.status(403).json({ error: 'interdit' });
      return;
    }

    const targetId = req.params.id;
    const { role } = req.body as { role?: Role };
    const allowed: Role[] = ['USER', 'PRODUCER', 'ADMIN'];
    if (!role || !allowed.includes(role)) {
      res.status(400).json({ error: 'rôle_invalide' });
      return;
    }

    if (targetId === admin.id && role !== 'ADMIN') {
      res.status(400).json({ error: 'tu_ne_peux_pas_retirer_ton_propre_rôle_admin' });
      return;
    }

    const updated = await prisma.user.update({
      where: { id: targetId },
      data: { role },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'mise_à_jour_échouée' });
  }
});

app.patch('/api/admin/users/:id/password', async (req, res) => {
  try {
    const admin = await getAuthUser(req);
    if (!admin || admin.role !== 'ADMIN') {
      res.status(403).json({ error: 'interdit' });
      return;
    }
    const targetId = req.params.id;
    const { password } = req.body as { password?: string };
    if (typeof password !== 'string' || password.length < 8) {
      res.status(400).json({ error: 'mot_de_passe_min_8' });
      return;
    }
    const passwordHash = await hashPassword(password);
    await prisma.user.update({
      where: { id: targetId },
      data: { passwordHash },
    });
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'mise_à_jour_échouée' });
  }
});

app.get('/api/admin/producteurs', async (req, res) => {
  try {
    const user = await getAuthUser(req);
    if (!user || user.role !== 'ADMIN') {
      res.status(403).json({ error: 'interdit' });
      return;
    }
    const producteurs = await prisma.producteur.findMany({
      include: {
        positionProducteur: true,
        createdBy: { select: { email: true, name: true } },
        owner: { select: { email: true, name: true } },
      },
      orderBy: { id: 'asc' },
    });
    res.json(producteurs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'lecture_échouée' });
  }
});

app.patch('/api/admin/producteurs/:id/status', async (req, res) => {
  try {
    const admin = await getAuthUser(req);
    if (!admin || admin.role !== 'ADMIN') {
      res.status(403).json({ error: 'interdit' });
      return;
    }
    const id = parseInt(req.params.id, 10);
    if (!Number.isFinite(id)) {
      res.status(400).json({ error: 'id_invalide' });
      return;
    }
    const { status } = req.body as { status?: ContributionStatus };
    const allowed: ContributionStatus[] = ['APPROVED', 'PENDING', 'REJECTED'];
    if (!status || !allowed.includes(status)) {
      res.status(400).json({ error: 'statut_invalide' });
      return;
    }
    const updated = await prisma.producteur.update({
      where: { id },
      data: { status },
      include: {
        positionProducteur: true,
        createdBy: { select: { email: true, name: true } },
        owner: { select: { email: true, name: true } },
      },
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'mise_à_jour_échouée' });
  }
});

app.get('/api/admin/stats', async (req, res) => {
  try {
    const admin = await getAuthUser(req);
    if (!admin || admin.role !== 'ADMIN') {
      res.status(403).json({ error: 'interdit' });
      return;
    }
    const since = new Date();
    since.setHours(0, 0, 0, 0);
    since.setDate(since.getDate() - 29);

    const [userCount, producerCount, pendingCount, byRole, usersRecent, producersRecent] =
      await Promise.all([
        prisma.user.count(),
        prisma.producteur.count(),
        prisma.producteur.count({ where: { status: 'PENDING' } }),
        prisma.user.groupBy({ by: ['role'], _count: { _all: true } }),
        prisma.user.findMany({
          where: { createdAt: { gte: since } },
          select: { createdAt: true },
        }),
        prisma.producteur.findMany({
          where: { createdAt: { gte: since } },
          select: { createdAt: true },
        }),
      ]);

    const roleMap: Record<string, number> = {};
    for (const row of byRole) {
      roleMap[row.role] = row._count._all;
    }

    res.json({
      userCount,
      producerCount,
      pendingCount,
      byRole: roleMap,
      usersLast30Days: seriesLastDays(usersRecent, 30),
      producersLast30Days: seriesLastDays(producersRecent, 30),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'stats_échouées' });
  }
});

app.get('/api/admin/duplicates', async (req, res) => {
  try {
    const admin = await getAuthUser(req);
    if (!admin || admin.role !== 'ADMIN') {
      res.status(403).json({ error: 'interdit' });
      return;
    }
    const all = await prisma.producteur.findMany({
      select: { id: true, name: true, nameEnterprise: true, address: true, status: true },
    });
    const norm = (a: string) => a.trim().toLowerCase().replace(/\s+/g, ' ');
    const map = new Map<string, typeof all>();
    for (const p of all) {
      const k = norm(p.address);
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(p);
    }
    const groups = Array.from(map.entries())
      .filter(([, rows]) => rows.length > 1)
      .map(([addressKey, rows]) => ({ addressKey, rows }));
    res.json({ groups });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'lecture_échouée' });
  }
});

app.post('/api/admin/producteurs/merge', async (req, res) => {
  try {
    const admin = await getAuthUser(req);
    if (!admin || admin.role !== 'ADMIN') {
      res.status(403).json({ error: 'interdit' });
      return;
    }
    const { keepId, removeId } = req.body as { keepId?: number; removeId?: number };
    if (!Number.isFinite(keepId) || !Number.isFinite(removeId) || keepId === removeId) {
      res.status(400).json({ error: 'ids_invalides' });
      return;
    }

    const [keep, remove] = await Promise.all([
      prisma.producteur.findUnique({
        where: { id: keepId! },
        include: { positionProducteur: true },
      }),
      prisma.producteur.findUnique({
        where: { id: removeId! },
        include: { positionProducteur: true },
      }),
    ]);
    if (!keep || !remove) {
      res.status(404).json({ error: 'introuvable' });
      return;
    }

    await prisma.$transaction(async (tx) => {
      if (keep.positionProducteur.length === 0 && remove.positionProducteur.length > 0) {
        const rp = remove.positionProducteur[0];
        await tx.positionProducteur.create({
          data: {
            producteurId: keep.id,
            latitude: rp.latitude,
            longitude: rp.longitude,
            marker: rp.marker,
          },
        });
      }
      await tx.producteur.delete({ where: { id: remove.id } });
    });

    const result = await prisma.producteur.findUnique({
      where: { id: keep.id },
      include: {
        positionProducteur: true,
        createdBy: { select: { email: true, name: true } },
        owner: { select: { email: true, name: true } },
      },
    });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'fusion_échouée' });
  }
});

app.get('/api/admin/export/producteurs.csv', async (req, res) => {
  try {
    const admin = await getAuthUser(req);
    if (!admin || admin.role !== 'ADMIN') {
      res.status(403).send('interdit');
      return;
    }
    const rows = await prisma.producteur.findMany({
      include: { positionProducteur: true },
      orderBy: { id: 'asc' },
    });
    const header = [
      'id',
      'name',
      'nameEnterprise',
      'address',
      'status',
      'latitude',
      'longitude',
      'marker',
      'tags',
      'sellsCategories',
      'phone',
      'contactEmail',
      'website',
      'instagram',
      'facebook',
      'description',
      'createdAt',
    ];
    const lines = [header.join(',')];
    for (const p of rows) {
      const pos = p.positionProducteur[0];
      lines.push(
        [
          p.id,
          csvEscape(p.name),
          csvEscape(p.nameEnterprise),
          csvEscape(p.address),
          p.status,
          pos?.latitude ?? '',
          pos?.longitude ?? '',
          pos?.marker ?? '',
          csvEscape((p.tags ?? []).join('|')),
          csvEscape((p.sellsCategories ?? []).join('|')),
          csvEscape(p.phone ?? ''),
          csvEscape(p.contactEmail ?? ''),
          csvEscape(p.website ?? ''),
          csvEscape(p.instagram ?? ''),
          csvEscape(p.facebook ?? ''),
          csvEscape(p.description ?? ''),
          p.createdAt.toISOString(),
        ].join(',')
      );
    }
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="producteurs.csv"');
    res.send(lines.join('\n'));
  } catch (err) {
    console.error(err);
    res.status(500).send('export_échoué');
  }
});

app.get('/api/admin/export/users.csv', async (req, res) => {
  try {
    const admin = await getAuthUser(req);
    if (!admin || admin.role !== 'ADMIN') {
      res.status(403).send('interdit');
      return;
    }
    const rows = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
    const header = ['id', 'email', 'name', 'role', 'createdAt'];
    const lines = [header.join(',')];
    for (const u of rows) {
      lines.push(
        [
          csvEscape(u.id),
          csvEscape(u.email),
          csvEscape(u.name),
          u.role,
          u.createdAt.toISOString(),
        ].join(',')
      );
    }
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="utilisateurs.csv"');
    res.send(lines.join('\n'));
  } catch (err) {
    console.error(err);
    res.status(500).send('export_échoué');
  }
});

app.listen(port, () => {
  console.log(`API Prisma/Neon sur http://localhost:${port}`);
});
