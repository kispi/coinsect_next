export const cryptoUtils = {
  decryptAPIResponse: (encrypted: string) => {
    if (!encrypted) return null;
    const decrypted = encrypted
      .split('')
      .map((c) => String.fromCharCode(c.charCodeAt(0) + 5))
      .join('');

    try {
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Decryption error:', error);
      return null;
    }
  },
};
