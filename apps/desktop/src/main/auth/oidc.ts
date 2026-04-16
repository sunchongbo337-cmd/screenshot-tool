import { app, shell } from 'electron';
import { createServer } from 'node:http';
import { randomBytes, createHash } from 'node:crypto';
import { readFile, unlink, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import * as client from 'openid-client';

export type OidcConfig = {
  issuer: string;
  clientId: string;
  scopes: string[];
  // Optional: if your IdP requires an explicit audience parameter.
  audience?: string;
};

export type OidcTokens = {
  accessToken: string;
  idToken?: string;
  refreshToken?: string;
  expiresAt?: number; // epoch ms
};

const SESSION_FILE = 'oidc.session.json';

function sessionPath() {
  return join(app.getPath('userData'), SESSION_FILE);
}

export async function loadSession(): Promise<OidcTokens | null> {
  try {
    const raw = await readFile(sessionPath(), 'utf-8');
    return JSON.parse(raw) as OidcTokens;
  } catch {
    return null;
  }
}

export async function saveSession(tokens: OidcTokens | null): Promise<void> {
  const p = sessionPath();
  if (!tokens) {
    try {
      await unlink(p);
    } catch {
      // ignore
    }
    return;
  }
  await writeFile(p, JSON.stringify(tokens, null, 2), 'utf-8');
}

function base64Url(input: Buffer) {
  return input
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function sha256B64Url(str: string) {
  const h = createHash('sha256').update(str).digest();
  return base64Url(h);
}

export async function loginWithLoopback(config: OidcConfig): Promise<OidcTokens> {
  const discovered = await client.discovery(
    new URL(config.issuer),
    config.clientId,
    undefined,
    client.None()
  );

  const verifier = base64Url(randomBytes(32));
  const challenge = sha256B64Url(verifier);
  const state = base64Url(randomBytes(16));
  const nonce = base64Url(randomBytes(16));

  const server = createServer();
  const { port } = await new Promise<{ port: number }>((resolve, reject) => {
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      if (!address || typeof address === 'string') {
        reject(new Error('Failed to bind loopback server'));
        return;
      }
      resolve({ port: address.port });
    });
  });

  const redirectUri = `http://127.0.0.1:${port}/callback`;

  const tokens = await new Promise<OidcTokens>((resolve, reject) => {
    server.on('request', (req, res) => {
      try {
        const u = new URL(req.url ?? '/', `http://127.0.0.1:${port}`);
        if (u.pathname !== '/callback') {
          res.writeHead(404);
          res.end();
          return;
        }
        const error = u.searchParams.get('error');
        if (error) {
          res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end(`Login failed: ${error}`);
          reject(new Error(String(error)));
          return;
        }

        (async () => {
          const tokenResponse = await client.authorizationCodeGrant(
            discovered,
            u,
            {
              expectedState: state,
              expectedNonce: nonce,
              pkceCodeVerifier: verifier
            },
            undefined
          );

          const expiresIn = tokenResponse.expiresIn();
          const expiresAt = expiresIn === undefined ? undefined : Date.now() + expiresIn * 1000;

          const out: OidcTokens = {
            accessToken: tokenResponse.access_token,
            idToken: tokenResponse.id_token,
            refreshToken: tokenResponse.refresh_token,
            expiresAt
          };

          await saveSession(out);

          res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('Login success. You can close this window.');
          resolve(out);
        })().catch((e) => {
          res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('Login failed');
          reject(e);
        });
      } catch (e) {
        reject(e);
      }
    });
  });

  try {
    const authUrl = client.buildAuthorizationUrl(discovered, {
      redirect_uri: redirectUri,
      scope: config.scopes.join(' '),
      response_type: 'code',
      code_challenge: challenge,
      code_challenge_method: 'S256',
      state,
      nonce,
      ...(config.audience ? { audience: config.audience } : {})
    } as Record<string, string>);

    await shell.openExternal(authUrl.href);
    return await tokens;
  } finally {
    server.close();
  }
}

