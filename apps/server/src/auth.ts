import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { Db } from './db.js';

export type JwtClaims = {
  sub: string; // user id
  role: string;
  provider: 'local';
  displayName: string;
  purpose?: 'reset_password';
};

export function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env ${name}`);
  return v;
}

export function signAccessToken(secret: string, claims: JwtClaims, expiresIn: string): string {
  return jwt.sign(claims, secret, { algorithm: 'HS256', expiresIn });
}

export function verifyAccessToken(secret: string, token: string): JwtClaims {
  const decoded = jwt.verify(token, secret, { algorithms: ['HS256'] });
  if (typeof decoded !== 'object' || !decoded) throw new Error('Invalid token');
  const c = decoded as any;
  if (!c.sub || !c.role || !c.provider || !c.displayName) throw new Error('Invalid token claims');
  return { sub: String(c.sub), role: String(c.role), provider: c.provider, displayName: String(c.displayName) };
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return await bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export function findUserByPhone(db: Db, phone: string) {
  return db
    .prepare(
      `SELECT id, phone, password_hash, role, provider, provider_account, display_name
       FROM users WHERE phone = ? LIMIT 1`
    )
    .get(phone) as
    | {
        id: number;
        phone: string;
        password_hash: string | null;
        role: string;
        provider: string;
        provider_account: string | null;
        display_name: string;
      }
    | undefined;
}

export function upsertThirdPartyUser(db: Db, provider: 'wechat' | 'qq', providerAccount: string, displayName: string) {
  const now = Date.now();
  const existing = db
    .prepare(
      `SELECT id, role, display_name FROM users WHERE provider = ? AND provider_account = ? LIMIT 1`
    )
    .get(provider, providerAccount) as { id: number; role: string; display_name: string } | undefined;

  if (existing) {
    if (existing.display_name !== displayName) {
      db.prepare(`UPDATE users SET display_name = ? WHERE id = ?`).run(displayName, existing.id);
    }
    return { id: existing.id, role: existing.role, displayName };
  }

  const info = db
    .prepare(
      `INSERT INTO users (provider, provider_account, display_name, role, created_at)
       VALUES (?, ?, ?, 'user', ?)`
    )
    .run(provider, providerAccount, displayName, now);

  return { id: Number(info.lastInsertRowid), role: 'user', displayName };
}

export function createPhoneUser(db: Db, phone: string, passwordHash: string, displayName: string) {
  const now = Date.now();
  const info = db
    .prepare(
      `INSERT INTO users (provider, phone, password_hash, display_name, role, created_at)
       VALUES ('phone', ?, ?, ?, 'user', ?)`
    )
    .run(phone, passwordHash, displayName, now);

  return { id: Number(info.lastInsertRowid), role: 'user', displayName };
}

export function getUserPublicById(db: Db, id: number) {
  return db
    .prepare(`SELECT id, role, provider, phone, provider_account, display_name FROM users WHERE id = ? LIMIT 1`)
    .get(id) as
    | {
        id: number;
        role: string;
        provider: string;
        phone: string | null;
        provider_account: string | null;
        display_name: string;
      }
    | undefined;
}

