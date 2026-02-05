import { useState, useEffect } from 'react';
import { defaultConfig, ExperienceConfig } from '@/config/experience';

const Admin = () => {
  const [config, setConfig] = useState<ExperienceConfig>(defaultConfig);
  const [saved, setSaved] = useState(false);
  const [imageUrls, setImageUrls] = useState<string>('');
  
  // Load saved config
  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem('birthday-config');
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        setConfig({ ...defaultConfig, ...parsed });
        if (parsed.images) {
          setImageUrls(parsed.images.join('\n'));
        }
      }
    } catch (e) {
      console.log('No saved config');
    }
  }, []);
  
  // Save config
  const handleSave = () => {
    const images = imageUrls
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0);
    
    const newConfig = { ...config, images };
    localStorage.setItem('birthday-config', JSON.stringify(newConfig));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  
  return (
    <div
      className="min-h-screen p-8"
      style={{ background: 'hsl(240 10% 6%)' }}
    >
      <div className="max-w-xl mx-auto">
        <h1
          className="text-2xl font-light mb-8 tracking-wide"
          style={{ color: 'hsl(210 33% 97%)' }}
        >
          Experience Configuration
        </h1>
        
        <div className="space-y-6">
          {/* Name */}
          <div>
            <label
              className="block text-sm uppercase tracking-widest mb-2"
              style={{ color: 'hsl(210 20% 60%)' }}
            >
              Recipient Name
            </label>
            <input
              type="text"
              value={config.name}
              onChange={(e) => setConfig({ ...config, name: e.target.value })}
              className="w-full px-4 py-3 rounded bg-transparent border transition-colors"
              style={{
                borderColor: 'hsl(240 10% 20%)',
                color: 'hsl(210 33% 97%)',
              }}
              placeholder="Enter name..."
            />
          </div>
          
          {/* Language */}
          <div>
            <label
              className="block text-sm uppercase tracking-widest mb-2"
              style={{ color: 'hsl(210 20% 60%)' }}
            >
              Language
            </label>
            <select
              value={config.language}
              onChange={(e) => setConfig({ ...config, language: e.target.value as 'en' | 'ar' | 'ru' })}
              className="w-full px-4 py-3 rounded bg-transparent border transition-colors cursor-pointer"
              style={{
                borderColor: 'hsl(240 10% 20%)',
                color: 'hsl(210 33% 97%)',
              }}
            >
              <option value="en" style={{ background: 'hsl(240 10% 10%)' }}>English</option>
              <option value="ar" style={{ background: 'hsl(240 10% 10%)' }}>العربية (Arabic)</option>
              <option value="ru" style={{ background: 'hsl(240 10% 10%)' }}>Русский (Russian)</option>
            </select>
          </div>
          
          {/* Images */}
          <div>
            <label
              className="block text-sm uppercase tracking-widest mb-2"
              style={{ color: 'hsl(210 20% 60%)' }}
            >
              Image URLs (one per line)
            </label>
            <textarea
              value={imageUrls}
              onChange={(e) => setImageUrls(e.target.value)}
              rows={5}
              className="w-full px-4 py-3 rounded bg-transparent border transition-colors resize-none"
              style={{
                borderColor: 'hsl(240 10% 20%)',
                color: 'hsl(210 33% 97%)',
              }}
              placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
            />
            <p
              className="text-xs mt-1"
              style={{ color: 'hsl(210 20% 45%)' }}
            >
              These images will appear in the final floating images phase.
            </p>
          </div>
          
          {/* Timings */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm uppercase tracking-widest mb-2"
                style={{ color: 'hsl(210 20% 60%)' }}
              >
                Chaos Duration (ms)
              </label>
              <input
                type="number"
                value={config.timings.phase0}
                onChange={(e) => setConfig({
                  ...config,
                  timings: { ...config.timings, phase0: parseInt(e.target.value) || 6000 }
                })}
                className="w-full px-4 py-3 rounded bg-transparent border transition-colors"
                style={{
                  borderColor: 'hsl(240 10% 20%)',
                  color: 'hsl(210 33% 97%)',
                }}
              />
            </div>
            
            <div>
              <label
                className="block text-sm uppercase tracking-widest mb-2"
                style={{ color: 'hsl(210 20% 60%)' }}
              >
                Silence Duration (ms)
              </label>
              <input
                type="number"
                value={config.timings.cut}
                onChange={(e) => setConfig({
                  ...config,
                  timings: { ...config.timings, cut: parseInt(e.target.value) || 1500 }
                })}
                className="w-full px-4 py-3 rounded bg-transparent border transition-colors"
                style={{
                  borderColor: 'hsl(240 10% 20%)',
                  color: 'hsl(210 33% 97%)',
                }}
              />
            </div>
          </div>
          
          {/* Gyroscope toggle */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="gyro"
              checked={config.enableGyro}
              onChange={(e) => setConfig({ ...config, enableGyro: e.target.checked })}
              className="w-5 h-5 rounded cursor-pointer"
            />
            <label
              htmlFor="gyro"
              className="text-sm uppercase tracking-widest cursor-pointer"
              style={{ color: 'hsl(210 20% 60%)' }}
            >
              Enable Gyroscope / Mouse Parallax
            </label>
          </div>
          
          {/* Save button */}
          <button
            onClick={handleSave}
            className="w-full py-4 rounded font-light tracking-widest uppercase transition-all duration-300"
            style={{
              background: saved ? 'hsl(150 60% 40%)' : 'hsl(210 33% 97%)',
              color: 'hsl(240 10% 6%)',
            }}
          >
            {saved ? '✓ Saved' : 'Save Configuration'}
          </button>
          
          {/* Preview link */}
          <a
            href="/"
            className="block text-center py-3 text-sm uppercase tracking-widest transition-colors"
            style={{ color: 'hsl(186 100% 50%)' }}
          >
            Preview Experience →
          </a>
        </div>
        
        {/* Info */}
        <div
          className="mt-12 p-4 rounded"
          style={{
            background: 'hsl(240 10% 8%)',
            borderLeft: '2px solid hsl(186 100% 50% / 0.3)',
          }}
        >
          <h3
            className="text-sm uppercase tracking-widest mb-2"
            style={{ color: 'hsl(186 100% 50%)' }}
          >
            Note
          </h3>
          <p
            className="text-sm leading-relaxed"
            style={{ color: 'hsl(210 20% 60%)' }}
          >
            This configuration is saved locally in your browser. For audio to work properly,
            place audio files in the /public/audio folder and update the paths in the code.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Admin;
