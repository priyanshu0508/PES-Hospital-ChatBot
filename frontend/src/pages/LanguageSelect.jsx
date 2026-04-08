import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePatient } from '../context/PatientContext';
import { Globe, ChevronRight, QrCode, Smartphone } from 'lucide-react';
import pesLogo from '../assets/logo_1.png';

const languages = [
  { code: 'en', label: 'English', native: 'English', flag: 'EN' },
  { code: 'hi', label: 'Hindi', native: 'हिंदी', flag: 'HI' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ', flag: 'KN' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు', flag: 'TE' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்', flag: 'TA' }
];

const LanguageSelect = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { updatePatientData } = usePatient();

  const handleSelect = (code) => {
    i18n.changeLanguage(code);
    updatePatientData({ language: code });
    navigate('/patient-type');
  };

  // Use network IP so phones on the same Wi-Fi can reach this app
  const getNetworkUrl = () => {
    const { hostname, port, protocol } = window.location;
    // If already on a LAN IP, use as-is; otherwise guide user
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return `${protocol}//${hostname}:${port}`;
    }
    // Fallback: show localhost (phone won't reach, but avoids errors)
    return `${protocol}//${hostname}:${port}`;
  };
  const appUrl = getNetworkUrl();
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(appUrl)}&color=2563eb&bgcolor=f0f4f8`;

  return (
    <div className="animate-in" style={{ maxWidth: '520px', width: '100%' }}>
      {/* QR Code Banner */}
      <div className="glass-card" style={{
        padding: '1.25rem 1.5rem', marginBottom: '1rem',
        display: 'flex', alignItems: 'center', gap: '1rem'
      }}>
        <div style={{
          width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
          background: 'linear-gradient(135deg, var(--accent-teal), #0d9488)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Smartphone size={22} color="white" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
            Scan QR on your phone
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
            No app download needed — opens in browser
          </div>
        </div>
        <img src={qrUrl} alt="QR Code" style={{ width: '64px', height: '64px', borderRadius: '8px' }} />
      </div>

      {/* Main Card */}
      <div className="glass-card" style={{ padding: '3rem 2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <img
            src={pesLogo}
            alt="PES University Hospital"
            style={{
              height: '80px',
              width: 'auto',
              margin: '0 auto 1.25rem',
              display: 'block',
              objectFit: 'contain',
              filter: 'drop-shadow(0 8px 16px rgba(59,130,246,0.15))'
            }}
          />
          <h1 className="page-title text-gradient">PES Hospital</h1>
          <p className="page-subtitle" style={{ marginTop: '0.5rem' }}>
            OPD Registration Assistant
          </p>
          <p style={{ marginTop: '1rem', color: 'var(--text-tertiary)', fontSize: '0.95rem' }}>
            Choose your preferred language to continue
          </p>
        </div>

        {/* Language Buttons */}
        <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className="animate-in"
              style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                width: '100%', padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                border: '2px solid #e2e8f0', background: 'white',
                cursor: 'pointer', fontFamily: "'Inter', sans-serif",
                transition: 'all var(--duration-normal) var(--ease-out)',
                textAlign: 'left'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--primary-400)';
                e.currentTarget.style.background = 'var(--primary-50)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: 'linear-gradient(135deg, var(--primary-50), var(--primary-100))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--primary-600)', fontWeight: 800, fontSize: '0.9rem',
                border: '1px solid var(--primary-200)',
                flexShrink: 0
              }}>
                {lang.flag}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '1.05rem' }}>
                  {lang.native}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
                  {lang.label}
                </div>
              </div>
              <ChevronRight size={20} color="var(--text-tertiary)" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSelect;
