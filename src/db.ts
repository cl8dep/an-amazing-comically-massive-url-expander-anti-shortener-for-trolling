import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dataDir = process.env.DATA_DIR || path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export const db = new Database(path.join(dataDir, 'massive_urls.db'));
db.pragma('journal_mode = WAL');

// Tabla para el "Anti-Acortador"
db.exec(`
  CREATE TABLE IF NOT EXISTS massive_urls (
    id TEXT PRIMARY KEY,
    target_url TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL
  );
`);

export const insertMassiveUrl = db.prepare(`
  INSERT INTO massive_urls (id, target_url, expires_at)
  VALUES (@id, @target_url, datetime('now', '+30 days'))
`);

export const getTargetUrl = db.prepare(`
  SELECT target_url FROM massive_urls 
  WHERE id = ? AND expires_at > CURRENT_TIMESTAMP
`);

export const cleanupExpired = db.prepare(`
  DELETE FROM massive_urls WHERE expires_at < CURRENT_TIMESTAMP
`);
