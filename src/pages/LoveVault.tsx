import { useState } from 'react';
import { getLatestLoveMessage } from '@/lib/loveApi';

const PIN_CODE = '1975';

const LoveVault = () => {
  const [pin, setPin] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUnlock = async () => {
    setAttempted(true);
    if (pin !== PIN_CODE) return;

    setLoading(true);
    setError('');
    try {
      const message = await getLatestLoveMessage(pin);
      setSavedMessage(message);
      setIsUnlocked(true);
    } catch (err) {
      setError('Could not load message from server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <section className="w-full max-w-md rounded-xl border border-rose-300/40 bg-white/5 p-6 shadow-2xl">
        <h1 className="text-center text-2xl font-bold tracking-wide text-rose-300">Love Vault</h1>

        {!isUnlocked && (
          <div className="mt-6 space-y-4">
            <p className="text-center text-sm text-white/80">Enter PIN to see her message</p>
            <input
              type="password"
              inputMode="numeric"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="PIN"
              className="w-full rounded-md border border-white/30 bg-black/40 px-4 py-3 text-center text-lg tracking-[0.3em] outline-none"
            />
            <button
              type="button"
              onClick={handleUnlock}
              disabled={loading}
              className="w-full rounded-md bg-rose-500 px-4 py-3 font-semibold text-white"
            >
              {loading ? 'Loading...' : 'Unlock'}
            </button>
            {attempted && pin !== PIN_CODE && (
              <p className="text-center text-sm text-rose-300">Wrong PIN</p>
            )}
            {error && <p className="text-center text-sm text-rose-300">{error}</p>}
          </div>
        )}

        {isUnlocked && (
          <div className="mt-6 rounded-lg border border-purple-300/30 bg-purple-900/20 p-4">
            <p className="mb-2 text-xs uppercase tracking-widest text-purple-200/80">Her message</p>
            <p className="whitespace-pre-wrap text-lg text-white">
              {savedMessage || 'No message has been submitted yet.'}
            </p>
          </div>
        )}
      </section>
    </main>
  );
};

export default LoveVault;
