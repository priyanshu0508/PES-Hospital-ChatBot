import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePatient } from '../context/PatientContext';
import { ArrowRight, ArrowLeft, User, Phone, CreditCard, Calendar, Users, AlertCircle } from 'lucide-react';

const Registration = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { updatePatientData } = usePatient();

  const [formData, setFormData] = useState({
    name: '', age: '', gender: 'Male', aadhaar: '', mobile: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const VALIDATORS = {
    name: (v) => {
      if (!v.trim()) return t('Name is required');
      if (v.trim().length < 2) return t('Name min 2');
      if (!/^[a-zA-Z\s.'\u0900-\u097F\u0C80-\u0CFF\u0C00-\u0C7F\u0B80-\u0BFF-]+$/.test(v.trim())) return t('Name letters only');
      return '';
    },
    age: (v) => {
      if (!v) return t('Age is required');
      const n = Number(v);
      if (!Number.isInteger(n) || n < 0) return t('Enter valid age');
      if (n < 1 || n > 120) return t('Age range');
      return '';
    },
    aadhaar: (v) => {
      if (!v.trim()) return t('Aadhaar required');
      const digits = v.replace(/\s/g, '');
      if (!/^\d+$/.test(digits)) return t('Aadhaar digits only');
      if (digits.length !== 12) return t('Aadhaar 12 digits');
      return '';
    },
    mobile: (v) => {
      if (!v.trim()) return t('Mobile required');
      const digits = v.replace(/\s/g, '');
      if (!/^\d+$/.test(digits)) return t('Mobile digits only');
      if (digits.length !== 10) return t('Mobile 10 digits');
      if (!/^[6-9]/.test(digits)) return t('Mobile start');
      return '';
    },
    gender: () => ''
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: VALIDATORS[name](value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: VALIDATORS[name](value) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.keys(VALIDATORS).forEach(key => {
      newErrors[key] = VALIDATORS[key](formData[key]);
    });
    setErrors(newErrors);
    setTouched({ name: true, age: true, aadhaar: true, mobile: true, gender: true });

    const hasErrors = Object.values(newErrors).some(e => e !== '');
    if (!hasErrors) {
      updatePatientData({ personalInfo: formData });
      navigate('/symptoms');
    }
  };

  const fields = [
    { name: 'name', label: t('Name'), icon: <User size={18} />, type: 'text', placeholder: 'John Doe', full: true },
    { name: 'age', label: t('Age'), icon: <Calendar size={18} />, type: 'number', placeholder: '30', full: false },
    { name: 'gender', label: t('Gender'), icon: <Users size={18} />, type: 'select', options: ['Male','Female','Other'], full: false },
    { name: 'aadhaar', label: t('Aadhaar'), icon: <CreditCard size={18} />, type: 'text', placeholder: '1234 5678 9012', full: true },
    { name: 'mobile', label: t('Mobile'), icon: <Phone size={18} />, type: 'tel', placeholder: '9876543210', full: true },
  ];

  return (
    <div className="glass-card animate-in" style={{ padding: '2.5rem', maxWidth: '520px', width: '100%' }}>
      <button
        onClick={() => navigate('/patient-type')}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
          background: 'transparent', border: 'none', cursor: 'pointer',
          fontFamily: "'Outfit',sans-serif", fontWeight: 500, fontSize: '0.9rem',
          color: 'var(--text-secondary)', marginBottom: '1.5rem', padding: '0.4rem 0'
        }}
      >
        <ArrowLeft size={16} /> {t('Back')}
      </button>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '2rem' }}>
        {[1,2,3].map(step => (
          <div key={step} style={{
            flex: 1, height: '4px', borderRadius: '2px',
            background: step <= 1 ? 'linear-gradient(90deg, var(--primary-500), var(--accent-violet))' : '#e2e8f0',
            transition: 'background 0.3s'
          }} />
        ))}
      </div>

      <h2 className="page-title text-gradient" style={{ textAlign: 'center' }}>{t('Register')}</h2>
      <p className="page-subtitle" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        {t('Fill in your details')}
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {fields.map(f => {
            const hasError = touched[f.name] && errors[f.name];
            return (
              <div key={f.name} className="form-group" style={{ gridColumn: f.full ? '1 / -1' : 'auto' }}>
                <label className="form-label">{f.label}</label>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                    color: hasError ? 'var(--error)' : 'var(--text-tertiary)', display: 'flex',
                    transition: 'color 0.2s'
                  }}>{f.icon}</span>
                  {f.type === 'select' ? (
                    <select
                      name={f.name} className="form-input"
                      value={formData[f.name]} onChange={handleChange} onBlur={handleBlur}
                      style={{ paddingLeft: '2.5rem', appearance: 'none' }}
                    >
                      {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input
                      name={f.name} type={f.type} className="form-input"
                      placeholder={f.placeholder} value={formData[f.name]}
                      onChange={handleChange} onBlur={handleBlur}
                      style={{
                        paddingLeft: '2.5rem',
                        borderColor: hasError ? 'var(--error)' : undefined,
                        boxShadow: hasError ? '0 0 0 3px rgba(239,68,68,0.1)' : undefined
                      }}
                      maxLength={f.name === 'aadhaar' ? 14 : f.name === 'mobile' ? 10 : undefined}
                      min={f.name === 'age' ? 1 : undefined}
                      max={f.name === 'age' ? 120 : undefined}
                    />
                  )}
                </div>
                {hasError && (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.3rem',
                    color: 'var(--error)', fontSize: '0.8rem', fontWeight: 500,
                    animation: 'fadeInUp 0.2s ease-out'
                  }}>
                    <AlertCircle size={14} /> {errors[f.name]}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '1.5rem' }}>
          {t('Next')} <ArrowRight size={20} />
        </button>
      </form>
    </div>
  );
};

export default Registration;
