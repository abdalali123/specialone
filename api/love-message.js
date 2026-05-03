import { ensureLoveTable, pool } from './_db.js';

const pinCode = process.env.LOVE_VAULT_PIN || '1975';

export default async function handler(req, res) {
  try {
    await ensureLoveTable();

    if (req.method === 'POST') {
      const message = String(req.body?.message || '').trim();
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      await pool.query('INSERT INTO love_messages (message) VALUES ($1)', [message]);
      return res.status(200).json({ ok: true });
    }

    if (req.method === 'GET') {
      const pin = String(req.query?.pin || '');
      if (pin !== pinCode) {
        return res.status(403).json({ error: 'Invalid PIN' });
      }

      const result = await pool.query(
        'SELECT message, created_at FROM love_messages ORDER BY created_at DESC LIMIT 1',
      );

      if (result.rows.length === 0) {
        return res.status(200).json({ message: '', createdAt: null });
      }

      return res.status(200).json({
        message: result.rows[0].message,
        createdAt: result.rows[0].created_at,
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
}
