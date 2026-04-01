import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePatient } from '../context/PatientContext';
import { UserPlus, UserCheck, ArrowLeft } from 'lucide-react';

const PatientType = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { updatePatientData } = usePatient();

  const handleSelection = (isNew) => {
    updatePatientData({ isNew });
    navigate(isNew ? '/register' : '/login');
  };

  return (
    <div className="glass-card animate-in" style={{ padding: '3rem 2.5rem', maxWidth: '520px', width: '100%' }}>
      <button
        onClick={() => navigate('/')}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
          background: 'transparent', border: 'none', cursor: 'pointer',
          fontFamily: "'Outfit',sans-serif", fontWeight: 500, fontSize: '0.9rem',
          color: 'var(--text-secondary)', marginBottom: '1.5rem', padding: '0.4rem 0'
        }}
      >
        <ArrowLeft size={16} /> {t('Back')}
      </button>

      <h2 className="page-title" style={{ textAlign: 'center' }}>
        {t('Are you a new or returning patient?')}
      </h2>
      <p className="page-subtitle" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        {t('Select one to continue')}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <button
          onClick={() => handleSelection(true)}
          className="animate-in"
          style={{
            display: 'flex', alignItems: 'center', gap: '1.25rem',
            width: '100%', padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            border: '2px solid transparent',
            background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, var(--primary-400), var(--accent-violet)) border-box',
            cursor: 'pointer', fontFamily: "'Inter', sans-serif", textAlign: 'left',
            transition: 'all var(--duration-normal) var(--ease-out)',
            boxShadow: 'var(--shadow-sm)'
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-xl)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
        >
          <div style={{
            width: '56px', height: '56px', borderRadius: '16px', flexShrink: 0,
            background: 'linear-gradient(135deg, var(--primary-500), var(--primary-700))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(37,99,235,0.3)'
          }}>
            <UserPlus size={26} color="white" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--text-primary)', fontFamily: "'Outfit',sans-serif" }}>
              {t('New Patient')}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              {t('First time visiting')}
            </div>
          </div>
        </button>

        <button
          onClick={() => handleSelection(false)}
          className="animate-in"
          style={{
            display: 'flex', alignItems: 'center', gap: '1.25rem',
            width: '100%', padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            border: '2px solid #e2e8f0', background: 'white',
            cursor: 'pointer', fontFamily: "'Inter', sans-serif", textAlign: 'left',
            transition: 'all var(--duration-normal) var(--ease-out)',
            boxShadow: 'var(--shadow-sm)', animationDelay: '100ms'
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-teal)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
        >
          <div style={{
            width: '56px', height: '56px', borderRadius: '16px', flexShrink: 0,
            background: 'linear-gradient(135deg, var(--accent-teal), #0d9488)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(20,184,166,0.3)'
          }}>
            <UserCheck size={26} color="white" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--text-primary)', fontFamily: "'Outfit',sans-serif" }}>
              {t('Returning Patient')}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              {t('Already have UHID')}
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default PatientType;
