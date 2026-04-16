import fs from 'node:fs';
import path from 'node:path';

export type User = {
  id: number;
  provider: 'local';
  phone?: string;
  email?: string;
  passwordHash?: string;
  role: 'user' | 'admin';
  displayName: string;
  createdAt: number;
};

export type LoginAttempt = {
  key: string;
  fails: number;
  firstFailAt: number;
  lastFailAt: number;
};

export type EmailCode = {
  email: string;
  scene: 'reset_password';
  code: string;
  expiresAt: number;
  lastSentAt: number;
};

export type StoreData = {
  nextUserId: number;
  users: User[];
  loginAttempts: LoginAttempt[];
  emailCodes: EmailCode[];
};

export class JsonStore {
  private filePath: string;
  private data: StoreData;

  constructor(filePath: string) {
    this.filePath = path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);
    fs.mkdirSync(path.dirname(this.filePath), { recursive: true });
    this.data = this.load();
  }

  private load(): StoreData {
    if (!fs.existsSync(this.filePath)) {
      const init: StoreData = { nextUserId: 1, users: [], loginAttempts: [], emailCodes: [] };
      fs.writeFileSync(this.filePath, JSON.stringify(init, null, 2), 'utf8');
      return init;
    }
    try {
      const raw = fs.readFileSync(this.filePath, 'utf8');
      const parsed = JSON.parse(raw) as StoreData;
      if (!parsed.nextUserId) parsed.nextUserId = 1;
      if (!Array.isArray(parsed.users)) parsed.users = [];
      if (!Array.isArray(parsed.loginAttempts)) parsed.loginAttempts = [];
      if (!Array.isArray((parsed as any).emailCodes)) (parsed as any).emailCodes = [];
      return parsed;
    } catch {
      const init: StoreData = { nextUserId: 1, users: [], loginAttempts: [], emailCodes: [] };
      fs.writeFileSync(this.filePath, JSON.stringify(init, null, 2), 'utf8');
      return init;
    }
  }

  private save() {
    fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf8');
  }

  findUserByPhone(phone: string): User | undefined {
    return this.data.users.find((u) => u.phone === phone && u.provider === 'local');
  }

  findUserByEmail(email: string): User | undefined {
    return this.data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase() && u.provider === 'local');
  }

  getUserById(id: number): User | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  createPhoneUser(phone: string, passwordHash: string, displayName: string): User {
    const u: User = {
      id: this.data.nextUserId++,
      provider: 'local',
      phone,
      passwordHash,
      role: 'user',
      displayName,
      createdAt: Date.now()
    };
    this.data.users.push(u);
    this.save();
    return u;
  }

  createEmailUser(email: string, passwordHash: string, displayName: string): User {
    const u: User = {
      id: this.data.nextUserId++,
      provider: 'local',
      email: email.toLowerCase(),
      passwordHash,
      role: 'user',
      displayName,
      createdAt: Date.now()
    };
    this.data.users.push(u);
    this.save();
    return u;
  }

  setPasswordByUserId(id: number, passwordHash: string) {
    const u = this.getUserById(id);
    if (!u) return false;
    u.passwordHash = passwordHash;
    this.save();
    return true;
  }

  issueEmailCode(
    email: string,
    scene: EmailCode['scene'],
    opts: { ttlMs: number; minIntervalMs: number }
  ): { ok: true; code: string } | { ok: false; error: 'TOO_FREQUENT' } {
    const now = Date.now();
    // cleanup
    this.data.emailCodes = this.data.emailCodes.filter((c) => c.expiresAt > now);
    const keyEmail = email.toLowerCase();
    const existing = this.data.emailCodes.find((c) => c.email === keyEmail && c.scene === scene);
    if (existing && now - existing.lastSentAt < opts.minIntervalMs) return { ok: false, error: 'TOO_FREQUENT' };

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const row: EmailCode = { email: keyEmail, scene, code, expiresAt: now + opts.ttlMs, lastSentAt: now };
    // overwrite: resending invalidates old code immediately
    this.data.emailCodes = this.data.emailCodes.filter((c) => !(c.email === keyEmail && c.scene === scene));
    this.data.emailCodes.push(row);
    this.save();
    return { ok: true, code };
  }

  verifyEmailCode(email: string, scene: EmailCode['scene'], code: string): boolean {
    const now = Date.now();
    this.data.emailCodes = this.data.emailCodes.filter((c) => c.expiresAt > now);
    const keyEmail = email.toLowerCase();
    const row = this.data.emailCodes.find((c) => c.email === keyEmail && c.scene === scene);
    if (!row) return false;
    if (row.code !== code) return false;
    // one-time use
    this.data.emailCodes = this.data.emailCodes.filter((c) => !(c.email === keyEmail && c.scene === scene));
    this.save();
    return true;
  }

  isLocked(key: string, opts: { windowMs: number; maxFails: number }): boolean {
    const now = Date.now();
    const row = this.data.loginAttempts.find((a) => a.key === key);
    if (!row) return false;
    if (now - row.firstFailAt > opts.windowMs) return false;
    return row.fails >= opts.maxFails;
  }

  recordFail(key: string, opts: { windowMs: number; maxFails: number }) {
    const now = Date.now();
    const row = this.data.loginAttempts.find((a) => a.key === key);
    if (!row) {
      this.data.loginAttempts.push({ key, fails: 1, firstFailAt: now, lastFailAt: now });
      this.save();
      return { locked: false, remaining: opts.maxFails - 1 };
    }
    const within = now - row.firstFailAt <= opts.windowMs;
    row.fails = within ? row.fails + 1 : 1;
    row.firstFailAt = within ? row.firstFailAt : now;
    row.lastFailAt = now;
    this.save();
    return { locked: row.fails >= opts.maxFails, remaining: Math.max(0, opts.maxFails - row.fails) };
  }

  clearAttempts(key: string) {
    const before = this.data.loginAttempts.length;
    this.data.loginAttempts = this.data.loginAttempts.filter((a) => a.key !== key);
    if (this.data.loginAttempts.length !== before) this.save();
  }
}

