import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePatient } from '../context/PatientContext';
import { getPatientByUHID } from '../services/api';
import { ArrowRight, ArrowLeft, Search, AlertCircle, Loader2 } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { updatePatientData } = usePatient();
  const [uhid, setUhid] = useState('');
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateUHID = (v) => {
    if (!v.trim()) return t('UHID required');
    if (v.trim().length < 3) return t('UHID min 3');
    if (!/^[a-zA-Z0-9-]+$/.test(v.trim())) return t('UHID format');
    return '';
  };

  const handleChange = (e) => {
    setUhid(e.target.value);
    if (touched) setError(validateUHID(e.target.value));
  };

  const handleBlur = () => {
    setTouched(true);
    setError(validateUHID(uhid));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(true);
    const err = validateUHID(uhid);
    setError(err);
    if (!err) {
      setLoading(true);
      try {
        const data = await getPatientByUHID(uhid.trim().toUpperCase());
        if (data.success) {
          updatePatientData({
            uhid: data.patient.uhid,
            personalInfo: data.patient,
            isNew: false,
          });
          navigate('/symptoms');
        } else {
          setError('Patient not found. Please check your UHID or register as new patient.');
        }
      } catch {
        setError('Cannot connect to server. Please ensure the backend is running.');
      } finally {
        setLoading(false);
      }
    }
  };


  const hasError = touched && error;

  return (
    <div className="glass-card animate-in" style={{ padding: '3rem 2.5rem', maxWidth: '440px', width: '100%' }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          background: 'var(--primary-600)', 
          border: 'none', 
          cursor: 'pointer',
          fontFamily: "'Outfit', sans-serif", 
          fontWeight: 600, 
          fontSize: '0.85rem',
          color: 'white', 
          marginBottom: '1.5rem', 
          padding: '0.5rem 1rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'var(--primary-700)';
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 6px 15px rgba(37, 99, 235, 0.3)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'var(--primary-600)';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.2)';
        }}
      >
        <ArrowLeft size={16} strokeWidth={2.5} /> {t('Back')}
      </button>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '2rem' }}>
        {[1,2,3].map(step => (
          <div key={step} style={{
            flex: 1, height: '4px', borderRadius: '2px',
            background: step <= 1 ? 'linear-gradient(90deg, var(--accent-teal), var(--primary-500))' : '#e2e8f0'
          }} />
        ))}
      </div>

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '16px',
          background: 'linear-gradient(135deg, var(--accent-teal), #0d9488)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.25rem',
          boxShadow: '0 8px 24px -6px rgba(20,184,166,0.4)'
        }}>
          <Search size={30} color="white" />
        </div>
        <h2 className="page-title text-gradient-teal">{t('Enter UHID')}</h2>
        <p className="page-subtitle" style={{ marginTop: '0.5rem' }}>
          {t('Enter unique hospital ID')}
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <input
            type="text" className="form-input" placeholder="e.g. PES-12345"
            value={uhid} onChange={handleChange} onBlur={handleBlur}
            style={{
              textAlign: 'center', fontSize: '1.3rem', letterSpacing: '2px',
              textTransform: 'uppercase', padding: '1.15rem',
              borderColor: hasError ? 'var(--error)' : undefined,
              boxShadow: hasError ? '0 0 0 3px rgba(239,68,68,0.1)' : undefined
            }}
          />
          {hasError && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '0.3rem', marginTop: '0.5rem',
              color: 'var(--error)', fontSize: '0.85rem', fontWeight: 500,
              animation: 'fadeInUp 0.2s ease-out'
            }}>
              <AlertCircle size={14} /> {error}
            </div>
          )}
        </div>
        <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
          {loading ? <><Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Verifying...</> : <>{t('Next')} <ArrowRight size={20} /></>}
        </button>
      </form>
    </div>
  );
};

export default Login;
