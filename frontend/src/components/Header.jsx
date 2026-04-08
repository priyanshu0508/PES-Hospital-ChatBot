import { useState } from 'react';
import { Phone, Clock, X, ExternalLink, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import pesLogo from '../assets/logo.png';

const Header = () => {
  const navigate = useNavigate();
  const [showTimings, setShowTimings] = useState(false);

  return (
    <>
      <header style={{
        width: '100%',
        background: 'rgba(255,255,255,0.82)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '1px solid rgba(255,255,255,0.55)',
        boxShadow: '0 2px 16px rgba(59,130,246,0.07)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0.75rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}>

          {/* ── Left: Logo + Name ──────────────────────────────── */}
          <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <div
              onClick={() => navigate('/')}
              style={{
                cursor: 'pointer',
                transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                display: 'flex',
                alignItems: 'center'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <img
                src={pesLogo}
                alt="PES University Hospital"
                style={{
                  height: '48px',
                  width: 'auto',
                  objectFit: 'contain',
                }}
              />
            </div>
          </div>

          {/* ── Right: Emergency Info ──────────────────────────── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>

            {/* OPD Timings Link */}
            <button
              onClick={() => setShowTimings(true)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.78rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.4rem 0.6rem',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(0,0,0,0.04)';
                e.currentTarget.style.color = 'var(--primary-600)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              <Clock size={15} />
              Visiting Hours
            </button>


            {/* Location Link */}
            <a 
              href="https://www.google.com/maps/search/?api=1&query=PES+University+Institute+of+Medical+Sciences+and+Research+Konappana+Agrahara+Electronic+City" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.78rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                padding: '0.4rem 0.6rem',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(0,0,0,0.04)';
                e.currentTarget.style.color = 'var(--primary-600)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
              title="VM78+55Q, Konappana Agrahara, Electronic City, Bengaluru"
            >
              <MapPin size={15} />
              Location
            </a>

            {/* Website Link */}
            <a href="https://peshospital.com" target="_blank" rel="noopener noreferrer" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.78rem',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              padding: '0.4rem 0.6rem',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(0,0,0,0.04)';
                e.currentTarget.style.color = 'var(--primary-600)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              <ExternalLink size={15} />
              Visit Website
            </a>

            {/* Phone number */}
            <a href="tel:8010728728" style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              fontFamily: "'Outfit', sans-serif", fontSize: '0.85rem', fontWeight: 600,
              color: 'var(--primary-600)', textDecoration: 'none',
            }}>
              <Phone size={15} strokeWidth={2.2} />
              8010 728 728
            </a>

          </div>
        </div>
      </header>

      {/* ── OPD Timings Modal ────────────────────────────── */}
      {showTimings && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          background: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(8px)',
          animation: 'fadeIn 0.3s ease-out',
        }}
          onClick={() => setShowTimings(false)}
        >
          <div
            className="glass-card animate-in"
            style={{
              width: '100%',
              maxWidth: '420px',
              padding: '2rem',
              background: 'white',
              boxShadow: 'var(--shadow-xl)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '12px',
                  background: 'var(--primary-50)', color: 'var(--primary-600)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Clock size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)' }}>Timings</h3>
                </div>
              </div>
              <button
                onClick={() => setShowTimings(false)}
                style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border-card)',
                  width: '32px', height: '32px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: 'var(--text-tertiary)'
                }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { label: 'Monday to Friday', time: '9 AM to 4 PM', accent: 'var(--primary-600)' },
                { label: 'Saturday', time: '9 AM to 1 PM', accent: 'var(--accent-teal)' },
                { label: 'Sunday', time: 'Closed', accent: 'var(--error)' },
                { label: 'Emergency', time: 'Open 24/7', accent: 'var(--success)', bold: true },
              ].map((item, idx) => (
                <div key={idx} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '0.75rem 0', borderBottom: idx < 3 ? '1px solid #f1f5f9' : 'none'
                }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>{item.label}</span>
                  <span style={{
                    fontSize: '0.85rem', fontWeight: item.bold ? 700 : 600,
                    color: item.bold ? item.accent : 'var(--text-primary)'
                  }}>
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
