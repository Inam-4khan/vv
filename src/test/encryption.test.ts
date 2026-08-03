import { describe, it, expect } from 'vitest';
import { encryptData, decryptData } from '../utils/encryption';

describe('AES-GCM Encryption Utility', () => {
  const secretKey = 'vizu-user-passphrase-998';

  it('encrypts and decrypts string data correctly (round-trip)', async () => {
    const originalText = 'Secret whisper message for proximity Hush network';
    const encrypted = await encryptData(originalText, secretKey);

    expect(typeof encrypted).toBe('string');
    expect(encrypted.length).toBeGreaterThan(0);

    const decrypted = await decryptData<string>(encrypted, secretKey);
    expect(decrypted).toBe(originalText);
  });

  it('encrypts and decrypts complex object data correctly', async () => {
    const originalObject = {
      id: 'hush-101',
      sender: 'ghost_user',
      content: 'Proximity note #42',
      coordinates: { lat: 37.7749, lng: -122.4194 },
      isEncrypted: true,
    };

    const encrypted = await encryptData(originalObject, secretKey);
    const decrypted = await decryptData<typeof originalObject>(encrypted, secretKey);

    expect(decrypted).toEqual(originalObject);
  });

  it('generates unique ciphertexts for identical inputs due to random salt & IV', async () => {
    const payload = { note: 'Unique salt verification test' };

    const encrypted1 = await encryptData(payload, secretKey);
    const encrypted2 = await encryptData(payload, secretKey);

    expect(encrypted1).not.toBe(encrypted2);

    const decrypted1 = await decryptData<typeof payload>(encrypted1, secretKey);
    const decrypted2 = await decryptData<typeof payload>(encrypted2, secretKey);

    expect(decrypted1).toEqual(payload);
    expect(decrypted2).toEqual(payload);
  });

  it('includes 16-byte salt and 12-byte IV in the combined binary layout (minimum 28 header bytes)', async () => {
    const payload = 'A';
    const encrypted = await encryptData(payload, secretKey);
    const rawBuffer = Uint8Array.from(atob(encrypted), c => c.charCodeAt(0));

    // Salt (16 bytes) + IV (12 bytes) + Ciphertext + Auth Tag (16 bytes)
    expect(rawBuffer.length).toBeGreaterThan(28);
  });

  it('fails decryption when provided an incorrect secret key', async () => {
    const payload = 'Confidential message';
    const encrypted = await encryptData(payload, secretKey);

    await expect(decryptData(encrypted, 'wrong-secret-key')).rejects.toThrow();
  });
});
