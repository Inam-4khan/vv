/**
 * AES-GCM Encryption Utility for Vizu
 *
 * Binary Layout for Output Base64 Payload:
 * [16 bytes salt][12 bytes IV][N bytes ciphertext]
 *
 * 1. Salt (0..15): 16-byte random salt generated per encryption call for PBKDF2 key derivation.
 * 2. IV (16..27): 12-byte random initialization vector for AES-GCM mode.
 * 3. Ciphertext (28..end): AES-GCM encrypted payload containing JSON-serialized data.
 */

const encoder = new TextEncoder();
const decoder = new TextDecoder();

async function deriveKey(secret: string, salt: Uint8Array): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100_000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptData(data: unknown, userSecret: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(userSecret, salt);
  const encoded = encoder.encode(JSON.stringify(data));
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);

  const combined = new Uint8Array(salt.byteLength + iv.byteLength + encrypted.byteLength);
  combined.set(salt, 0);
  combined.set(iv, salt.byteLength);
  combined.set(new Uint8Array(encrypted), salt.byteLength + iv.byteLength);

  return btoa(String.fromCharCode(...combined));
}

export async function decryptData<T>(ciphertext: string, userSecret: string): Promise<T> {
  const combined = Uint8Array.from(atob(ciphertext), c => c.charCodeAt(0));
  const salt = combined.slice(0, 16);
  const iv = combined.slice(16, 28);
  const data = combined.slice(28);

  const key = await deriveKey(userSecret, salt);
  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data);
  return JSON.parse(decoder.decode(decrypted));
}

