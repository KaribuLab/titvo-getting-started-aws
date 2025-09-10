import { randomBytes, createHash, createCipheriv } from 'node:crypto';

const prefix = 'tvok';

export function hashKey(key) {
    return createHash('sha256').update(key).digest('hex');
}

/**
 * Encrypts a text using AES in ECB mode
 * @param {string} text - The text to encrypt
 * @returns {string} - The encrypted text in base64 format
 */
export function encrypt(text,encodedKey) {
  // Check if AES_KEY is defined in the .env file
  if (!encodedKey) {
    throw new Error('AES_KEY is not defined in the .env file');
  }

  // Decode the key from base64
  const key = Buffer.from(encodedKey, 'base64');
  if (key.length !== 32) {
    throw new Error('AES_KEY must be 32 characters long');
  }
  
  // Create the cipher with AES in ECB mode
  const cipher = createCipheriv('aes-256-ecb', key, null);
  
  // Encrypt the text and apply padding
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  
  return encrypted;
}

export function generateApiKey() {
    // Calculamos cuántos caracteres aleatorios necesitamos
    const prefixLength = prefix.length; // 4 caracteres
    const hyphenLength = 1; // 1 carácter
    const randomLength = 48 - prefixLength - hyphenLength; // 48 - 4 - 1 = 43 caracteres aleatorios
    
    // Generamos bytes aleatorios criptográficamente seguros
    const randomBytesBuffer = randomBytes(Math.ceil(randomLength * 0.75)); // Ajustamos tamaño para base64
    
    // Convertimos a base64 y removemos caracteres no alfanuméricos
    const randomChars = randomBytesBuffer.toString('base64')
        .replace(/[+/=]/g, '')
        .substring(0, randomLength);
    
    return `${prefix}-${randomChars}`;
}