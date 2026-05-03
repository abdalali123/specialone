const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export async function saveLoveMessage(message: string): Promise<void> {
  const response = await fetch(`${API_BASE}/api/love-message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error('Failed to save message');
  }
}

export async function getLatestLoveMessage(pin: string): Promise<string> {
  const response = await fetch(`${API_BASE}/api/love-message?pin=${encodeURIComponent(pin)}`);

  if (!response.ok) {
    throw new Error(response.status === 403 ? 'Invalid PIN' : 'Failed to load message');
  }

  const data = (await response.json()) as { message?: string };
  return data.message || '';
}
