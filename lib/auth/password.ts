const encoder = new globalThis.TextEncoder();

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const passwordBuffer = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest(
    'SHA-256',
    new Uint8Array([...salt, ...passwordBuffer])
  );
  
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const saltArray = Array.from(salt);
  
  return `${arrayToHex(saltArray)}:${arrayToHex(hashArray)}`;
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const [storedSalt, storedHash] = hashedPassword.split(':');
  const salt = hexToArray(storedSalt);
  const passwordBuffer = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest(
    'SHA-256',
    new Uint8Array([...salt, ...passwordBuffer])
  );
  
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return arrayToHex(hashArray) === storedHash;
}

function arrayToHex(array: number[]): string {
  return array.map(b => b.toString(16).padStart(2, '0')).join('');
}

function hexToArray(hex: string): Uint8Array {
  const pairs = hex.match(/.{1,2}/g) || [];
  return new Uint8Array(pairs.map(byte => parseInt(byte, 16)));
}
