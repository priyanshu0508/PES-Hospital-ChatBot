import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePatient } from '../context/PatientContext';
import { CheckCircle2, Printer, Home, MapPin, Clock, Building2, Copy, Check } from 'lucide-react';
import { useState } from 'react';

const TokenSlip = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { patientData, resetPatientData } = usePatient();
  const [uhidCopied, setUhidCopied] = useState(false);
  const [generatedUHID] = useState(() => patientData.uhid || `PES-${Date.now().toString(36).toUpperCase().slice(-6)}`);

  const handleDone = () => {
    resetPatientData();
    navigate('/');
  };

  if (!patientData.departmentInfo) {
    return (
      <div className="glass-card animate-in" style={{ padding: '3rem', textAlign: 'center', maxWidth: '420px' }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{t('No token data')}</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>{t('Go Home')}</button>
      </div>
    );
  }

  const { name: dept, floor, room, token } = patientData.departmentInfo;
  const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });



  const copyUHID = () => {
    navigator.clipboard.writeText(generatedUHID).then(() => {
      setUhidCopied(true);
      setTimeout(() => setUhidCopied(false), 2000);
    });
  };

  return (
    <>
      <style>{`
        @media print {
          header, footer, .btn, .no-print, button {
            display: none !important;
          }
          body {
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .print-container {
            position: absolute !important;
            top: 0 !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            width: 100% !important;
            max-width: 500px !important;
            box-shadow: none !important;
            border: 1px solid #e2e8f0 !important;
            background: white !important;
            margin: 20px auto !important;
            padding: 2rem !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .token-text-print {
            background: none !important;
            -webkit-text-fill-color: #3b82f6 !important;
            color: #3b82f6 !important;
            font-size: 4rem !important;
          }
          .success-icon-print {
            box-shadow: none !important;
          }
          .uhid-card-print {
            background: #d1fae5 !important;
            border: 1px solid #10b981 !important;
          }
        }
      `}</style>
      
      <div className="glass-card animate-in print-container" style={{ padding: '3rem 2.5rem', maxWidth: '460px', width: '100%', textAlign: 'center' }}>
      {/* Success Icon */}
      <div style={{
        width: '80px', height: '80px', borderRadius: '50%',
        background: 'linear-gradient(135deg, #10b981, #059669)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 1.5rem',
        boxShadow: '0 8px 30px -6px rgba(16,185,129,0.5)',
        animation: 'scaleIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both'
      }}>
        <CheckCircle2 size={40} color="white" className="success-icon-print" />
      </div>

      <h2 className="page-title" style={{ marginBottom: '0.25rem' }}>{t('Registration Complete')}</h2>
      <p className="page-subtitle" style={{ marginBottom: '1.5rem' }}>{t('Your Token')}</p>

      {/* UHID Card (Gap #5) */}
      <div style={{
        background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
        borderRadius: 'var(--radius-md)',
        padding: '1rem 1.25rem',
        marginBottom: '1rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: '0.75rem'
      }} className="uhid-card-print">
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: '#065f46', letterSpacing: '0.5px' }}>
            {t('Your UHID')}
          </div>
          <div style={{
            fontSize: '1.25rem', fontWeight: 800, fontFamily: "'Outfit',sans-serif",
            color: '#065f46', letterSpacing: '1px'
          }}>
            {generatedUHID}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#047857', marginTop: '0.15rem' }}>
            {t('Save UHID')}
          </div>
        </div>
        <button
          onClick={copyUHID}
          style={{
            width: '40px', height: '40px', borderRadius: '10px',
            border: 'none', cursor: 'pointer', flexShrink: 0,
            background: uhidCopied ? '#059669' : 'rgba(255,255,255,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s'
          }}
        >
          {uhidCopied ? <Check size={18} color="white" /> : <Copy size={18} color="#065f46" />}
        </button>
      </div>

      {/* Token Card */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary-50), #ede9fe)',
        borderRadius: 'var(--radius-lg)',
        padding: '2rem',
        marginBottom: '1.5rem',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: '-30px', right: '-30px',
          width: '100px', height: '100px', borderRadius: '50%',
          background: 'rgba(139,92,246,0.1)'
        }} />

        <div className="token-text-print" style={{
          fontSize: '3.5rem', fontWeight: 900, fontFamily: "'Outfit',sans-serif",
          background: 'linear-gradient(135deg, var(--primary-600), var(--accent-violet))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          marginBottom: '1.5rem', letterSpacing: '-1px'
        }}>
          {token}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            { icon: <Building2 size={18} />, label: t('Department'), value: dept },
            { icon: <MapPin size={18} />, label: t('Floor'), value: `${t('Floor')} ${floor} — ${t('Room')} ${room || 'N/A'}` },
            { icon: <Clock size={18} />, label: t('Time'), value: timeNow }
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.65rem 1rem', borderRadius: 'var(--radius-sm)',
              background: 'rgba(255,255,255,0.7)', textAlign: 'left'
            }}>
              <span style={{ color: 'var(--primary-500)' }}>{item.icon}</span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', minWidth: '80px' }}>{item.label}</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button className="btn btn-secondary" onClick={() => window.print()} style={{ flex: 1 }}>
          <Printer size={18} /> {t('Print')}
        </button>
        <button className="btn btn-primary" onClick={handleDone} style={{ flex: 1 }}>
          <Home size={18} /> {t('Finish')}
        </button>
      </div>
      </div>
    </>
  );
};

export default TokenSlip;
