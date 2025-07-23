import fs from 'fs/promises';
import path from 'path';

export const removeFile = async (relativePath) => {
  try {
    await fs.unlink(path.join(process.cwd(), relativePath));
  } catch (err) {
    // Log but don’t crash the app if deletion fails
    console.error('File‑removal error:', err.message);
  }
};