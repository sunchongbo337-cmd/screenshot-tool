import express from 'express';
import cors from 'cors';
import dns from 'node:dns/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';
import {
  hashPassword,
  requireEnv,
  signAccessToken,
  verifyAccessToken,
  verifyPassword
} from './auth.ts';
import { JsonStore } from './store.ts';

const PORT = Number(process.env.PORT ?? 4177);
const JWT_SECRET = requireEnv('JWT_SECRET');
const serverRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'); // apps/server
const dbPathRaw = process.env.DB_PATH ?? './data/auth.json';
const DB_PATH = path.isAbsolute(dbPathRaw) ? dbPathRaw : path.resolve(serverRoot, dbPathRaw);
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ?? '').split(',').map((s) => s.trim()).filter(Boolean);

const store = new JsonStore(DB_PATH);

const app = express();
app.use(express.json({ limit: '2mb' }));
app.use(
  cors({
    origin(origin, cb) {
      // allow non-browser clients (electron) without origin
      if (!origin) return cb(null, true);
      // Dev-friendly: always allow localhost/127.0.0.1 with any port.
      // This avoids CORS issues when running Vite/dev servers on varying ports.
      if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin)) return cb(null, true);
      if (ALLOWED_ORIGINS.length === 0) return cb(null, true);
      if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
      return cb(new Error('CORS blocked'), false);
    },
    credentials: true
  })
);

function getIp(req: express.Request): string {
  const xf = req.headers['x-forwarded-for'];
  if (typeof xf === 'string' && xf.length > 0) return xf.split(',')[0]!.trim();
  return req.socket.remoteAddress ?? 'unknown';
}

function bearer(req: express.Request): string | null {
  const h = req.headers.authorization ?? '';
  const m = /^bearer\s+(.+)$/i.exec(h);
  return m?.[1] ?? null;
}

async function hasMxRecord(email: string): Promise<boolean> {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return false;
  try {
    const r = await Promise.race([
      dns.resolveMx(domain),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('MX_TIMEOUT')), 2000))
    ]);
    return Array.isArray(r) && r.length > 0;
  } catch {
    return false;
  }
}

function shouldCheckMx(): boolean {
  const v = String(process.env.EMAIL_MX_CHECK ?? '').trim();
  if (!v) return true; // default on for better UX
  return v === '1' || v.toLowerCase() === 'true';
}

const phoneSchema = z.object({
  phone: z.string().regex(/^1\d{10}$/),
  password: z.string().min(6).max(72)
});

const emailSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(72)
});

const sendEmailCodeSchema = z.object({ email: z.string().email() });
const verifyEmailCodeSchema = z.object({ email: z.string().email(), code: z.string().regex(/^\d{6}$/) });
const resetByTokenSchema = z.object({
  resetToken: z.string().min(10),
  newPassword: z.string().min(6).max(72)
});

app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Simple root route so the service doesn't return `Cannot GET /`.
app.get('/', (_req, res) => {
  res.json({ ok: true, service: 'screenshot-server', health: '/api/health' });
});

// Optional registration endpoint for phone+password.
app.post('/api/auth/register/phone', async (req, res) => {
  const parsed = phoneSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'INVALID_INPUT' });
  const { phone, password } = parsed.data;
  const displayName = `手机用户${phone.slice(-4)}`;
  try {
    const existing = store.findUserByPhone(phone);
    if (existing) return res.status(409).json({ error: 'PHONE_EXISTS' });
    const hash = await hashPassword(password);
    const u = store.createPhoneUser(phone, hash, displayName);
    return res.json({ ok: true, user: { id: u.id, displayName: u.displayName, provider: 'local', role: u.role } });
  } catch {
    return res.status(500).json({ error: 'SERVER_ERROR' });
  }
});

app.post('/api/auth/register/email', async (req, res) => {
  const parsed = emailSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'INVALID_INPUT' });
  const { email, password } = parsed.data;
  const safeEmail = email.toLowerCase();
  const displayName = `邮箱用户${safeEmail.split('@')[0]!.slice(0, 10)}`;
  try {
    if (shouldCheckMx()) {
      const okMx = await hasMxRecord(safeEmail);
      if (!okMx) return res.status(400).json({ error: 'EMAIL_DOMAIN_INVALID' });
    }
    const existing = store.findUserByEmail(safeEmail);
    if (existing) return res.status(409).json({ error: 'EMAIL_EXISTS' });
    const hash = await hashPassword(password);
    const u = store.createEmailUser(safeEmail, hash, displayName);
    return res.json({ ok: true, user: { id: u.id, displayName: u.displayName, provider: 'local', role: u.role } });
  } catch {
    return res.status(500).json({ error: 'SERVER_ERROR' });
  }
});

app.post('/api/auth/login/phone', async (req, res) => {
  const parsed = phoneSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'INVALID_INPUT' });
  const { phone, password } = parsed.data;

  const ip = getIp(req);
  const key = `phone:${phone}:ip:${ip}`;
  const guard = { windowMs: 10 * 60_000, maxFails: 5 };
  if (store.isLocked(key, guard)) return res.status(429).json({ error: 'TOO_MANY_ATTEMPTS' });

  const user = store.findUserByPhone(phone);
  if (!user) {
    store.recordFail(key, guard);
    return res.status(404).json({ error: 'PHONE_NOT_FOUND' });
  }
  if (!user.passwordHash) {
    store.recordFail(key, guard);
    return res.status(401).json({ error: 'INVALID_CREDENTIALS' });
  }

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) {
    const r = store.recordFail(key, guard);
    return res.status(401).json({ error: r.locked ? 'TOO_MANY_ATTEMPTS' : 'INVALID_CREDENTIALS' });
  }

  store.clearAttempts(key);
  const token = signAccessToken(
    JWT_SECRET,
    { sub: String(user.id), role: user.role, provider: 'local', displayName: user.displayName },
    '7d'
  );
  return res.json({
    ok: true,
    token,
    user: { id: user.id, displayName: user.displayName, provider: 'local', role: user.role }
  });
});

app.post('/api/auth/login/email', async (req, res) => {
  const parsed = emailSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'INVALID_INPUT' });
  const { email, password } = parsed.data;
  const safeEmail = email.toLowerCase();

  const ip = getIp(req);
  const key = `email:${safeEmail}:ip:${ip}`;
  const guard = { windowMs: 10 * 60_000, maxFails: 5 };
  if (store.isLocked(key, guard)) return res.status(429).json({ error: 'TOO_MANY_ATTEMPTS' });

  const user = store.findUserByEmail(safeEmail);
  if (!user) {
    store.recordFail(key, guard);
    return res.status(404).json({ error: 'EMAIL_NOT_FOUND' });
  }
  if (!user.passwordHash) {
    store.recordFail(key, guard);
    return res.status(401).json({ error: 'INVALID_CREDENTIALS' });
  }
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) {
    const r = store.recordFail(key, guard);
    return res.status(401).json({ error: r.locked ? 'TOO_MANY_ATTEMPTS' : 'INVALID_CREDENTIALS' });
  }
  store.clearAttempts(key);
  const token = signAccessToken(
    JWT_SECRET,
    { sub: String(user.id), role: user.role, provider: 'local', displayName: user.displayName },
    '7d'
  );
  return res.json({ ok: true, token, user: { id: user.id, displayName: user.displayName, provider: 'local', role: user.role } });
});

app.post('/api/auth/email/send_reset_password', (req, res) => {
  const parsed = sendEmailCodeSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'INVALID_INPUT' });
  const email = parsed.data.email.toLowerCase();
  const u = store.findUserByEmail(email);
  if (!u) return res.status(404).json({ error: 'EMAIL_NOT_FOUND' });
  const r = store.issueEmailCode(email, 'reset_password', { ttlMs: 5 * 60_000, minIntervalMs: 60_000 });
  if (!r.ok) return res.status(429).json({ error: r.error });

  // If SMTP is not configured, we still behave as "sent" in dev and print code.
  // TODO: integrate real email provider when credentials are available.
  // eslint-disable-next-line no-console
  console.log(`[email] reset_password code for ${email}: ${r.code}`);
  return res.json({ ok: true });
});

app.post('/api/auth/email/verify_reset_password', (req, res) => {
  const parsed = verifyEmailCodeSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'INVALID_INPUT' });
  const { email, code } = parsed.data;
  const ok = store.verifyEmailCode(email, 'reset_password', code);
  if (!ok) return res.status(400).json({ error: 'INVALID_CODE' });
  const u = store.findUserByEmail(email);
  if (!u) return res.status(404).json({ error: 'EMAIL_NOT_FOUND' });
  const resetToken = signAccessToken(
    JWT_SECRET,
    { sub: String(u.id), role: u.role, provider: 'local', displayName: u.displayName, purpose: 'reset_password' },
    '10m'
  );
  return res.json({ ok: true, resetToken });
});

app.post('/api/auth/password/reset_by_email', async (req, res) => {
  const parsed = resetByTokenSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'INVALID_INPUT' });
  const { resetToken, newPassword } = parsed.data;
  try {
    const c = verifyAccessToken(JWT_SECRET, resetToken);
    if (c.purpose !== 'reset_password') return res.status(401).json({ error: 'UNAUTHORIZED' });
    const hash = await hashPassword(newPassword);
    const updated = store.setPasswordByUserId(Number(c.sub), hash);
    if (!updated) return res.status(404).json({ error: 'USER_NOT_FOUND' });
    return res.json({ ok: true });
  } catch {
    return res.status(401).json({ error: 'UNAUTHORIZED' });
  }
});

app.get('/api/auth/me', (req, res) => {
  const t = bearer(req);
  if (!t) return res.status(401).json({ error: 'UNAUTHORIZED' });
  try {
    const c = verifyAccessToken(JWT_SECRET, t);
    const u = store.getUserById(Number(c.sub));
    if (!u) return res.status(401).json({ error: 'UNAUTHORIZED' });
    return res.json({
      ok: true,
      user: { id: u.id, displayName: u.displayName, provider: u.provider, role: u.role, phone: u.phone ?? null, email: u.email ?? null }
    });
  } catch {
    return res.status(401).json({ error: 'UNAUTHORIZED' });
  }
});

app.post('/api/auth/logout', (_req, res) => {
  // With pure JWT, logout is handled client-side by deleting token.
  // Token revocation/blacklist can be added later if needed.
  return res.json({ ok: true });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[server] listening on http://localhost:${PORT}`);
});

