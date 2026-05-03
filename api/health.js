import { pool } from './_db.js';

export default async function handler(_req, res) {
  try {
    await pool.query('SELECT 1');
    return res.status(200).json({ ok: true });
  } catch {
    return res.status(500).json({ ok: false, error: 'Database unavailable' });
  }
}
