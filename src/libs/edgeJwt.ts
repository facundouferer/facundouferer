// Edge-safe JWT HS256 verification without bringing full mongoose/jsonwebtoken bundle.
// Use ONLY for verification inside middleware/edge runtime.

const textEncoder = new TextEncoder();

function base64UrlDecode(segment: string): Uint8Array {
  const pad = segment.length % 4 === 0 ? '' : '='.repeat(4 - (segment.length % 4));
  const base64 = (segment + pad).replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function hmacSha256(data: Uint8Array, secret: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    'raw',
    textEncoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  // Using Uint8Array directly; cast to BufferSource for TS compatibility.
  const signature = await crypto.subtle.sign('HMAC', key, data as unknown as BufferSource);
  return new Uint8Array(signature);
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export interface EdgeJwtPayload { id?: string; role?: string; email?: string; exp?: number;[k: string]: unknown }

export async function verifyJwtHS256(token: string, secret: string): Promise<EdgeJwtPayload | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [headerB64, payloadB64, signatureB64] = parts;

    const headerJson = new TextDecoder().decode(base64UrlDecode(headerB64));
    const header = JSON.parse(headerJson);
    if (header.alg !== 'HS256') return null;

    const data = textEncoder.encode(`${headerB64}.${payloadB64}`);
    const expectedSigBytes = await hmacSha256(data, secret);
    const expectedSigB64 = bytesToBase64Url(expectedSigBytes);
    if (expectedSigB64 !== signatureB64) return null;

    const payloadJson = new TextDecoder().decode(base64UrlDecode(payloadB64));
    const payload: EdgeJwtPayload = JSON.parse(payloadJson);
    if (payload.exp && Date.now() / 1000 > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}
