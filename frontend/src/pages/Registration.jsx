import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePatient } from '../context/PatientContext';
import { registerPatient } from '../services/api';
import {
  ArrowRight, ArrowLeft, User, Phone, CreditCard, Calendar,
  Users, AlertCircle, Loader2, MapPin, Home, Hash,
  CheckCircle2, XCircle, ExternalLink, ShieldCheck, Info
} from 'lucide-react';

/* ─── Aadhaar Verhoeff Algorithm ───────────────────────────── */
const verhoeffTable = {
  d: [
    [0,1,2,3,4,5,6,7,8,9],
    [1,2,3,4,0,6,7,8,9,5],
    [2,3,4,0,1,7,8,9,5,6],
    [3,4,0,1,2,8,9,5,6,7],
    [4,0,1,2,3,9,5,6,7,8],
    [5,9,8,7,6,0,4,3,2,1],
    [6,5,9,8,7,1,0,4,3,2],
    [7,6,5,9,8,2,1,0,4,3],
    [8,7,6,5,9,3,2,1,0,4],
    [9,8,7,6,5,4,3,2,1,0],
  ],
  p: [
    [0,1,2,3,4,5,6,7,8,9],
    [1,5,7,6,2,8,3,0,9,4],
    [5,8,0,3,7,9,6,1,4,2],
    [8,9,1,6,0,4,3,5,2,7],
    [9,4,5,3,1,2,6,8,7,0],
    [4,2,8,6,5,7,3,9,0,1],
    [2,7,9,3,8,0,6,4,1,5],
    [7,0,4,6,9,1,3,2,5,8],
  ],
  inv: [0,4,3,2,1,9,8,7,6,5],
};

function verhoeffValidate(num) {
  let c = 0;
  const digits = num.split('').reverse();
  for (let i = 0; i < digits.length; i++) {
    c = verhoeffTable.d[c][verhoeffTable.p[i % 8][parseInt(digits[i], 10)]];
  }
  return c === 0;
}

/* Check for repeated / sequential patterns in Aadhaar */
function aadhaarPatternCheck(digits) {
  // All same digit (e.g. 000000000000, 111111111111)
  if (/^(\d)\1{11}$/.test(digits)) return false;
  // Ascending sequence (e.g. 012345678901)
  let ascending = true, descending = true;
  for (let i = 1; i < digits.length; i++) {
    if (parseInt(digits[i]) !== (parseInt(digits[i - 1]) + 1) % 10) ascending = false;
    if (parseInt(digits[i]) !== (parseInt(digits[i - 1]) - 1 + 10) % 10) descending = false;
  }
  if (ascending || descending) return false;
  return true;
}

/* ─── Indian States ─────────────────────────────────────────── */
const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
  'Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka',
  'Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram',
  'Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu',
  'Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Andaman and Nicobar Islands','Chandigarh','Dadra and Nagar Haveli and Daman and Diu',
  'Delhi','Jammu and Kashmir','Ladakh','Lakshadweep','Puducherry'
];

/* ─── Step definitions ──────────────────────────────────────── */
const STEPS = ['personal', 'address', 'identity'];

const Registration = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { updatePatientData } = usePatient();

  const [step, setStep] = useState(0); // 0=personal, 1=address, 2=identity

  const [formData, setFormData] = useState({
    // Step 1 – Personal
    name: '', age: '', gender: 'Male', mobile: '',
    // Step 2 – Address
    houseNo: '', street: '', district: '', state: '', pincode: '',
    // Step 3 – Identity
    aadhaar: '',
    hasAbha: null,   // null | 'yes' | 'no'
    abha: '',
    abhaAcknowledged: false,
  });

  const [errors, setErrors]   = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  /* ─── Field Validators ──────────────────────────────────────── */
  const VALIDATORS = {
    // Step 1
    name: (v) => {
      if (!v.trim())           return t('Name is required');
      if (v.trim().length < 2) return t('Name min 2');
      if (v.trim().length > 90) return t('Name max 90');
      if (!/^[a-zA-Z\s.'\u0900-\u097F\u0C80-\u0CFF\u0C00-\u0C7F\u0B80-\u0BFF\u0B00-\u0B7F\u0C00-\u0C7F-]+$/.test(v.trim()))
        return t('Name letters only');
      return '';
    },
    age: (v) => {
      if (!v)                        return t('Age is required');
      const n = Number(v);
      if (!Number.isInteger(n) || n < 0) return t('Enter valid age');
      if (n < 1 || n > 120)          return t('Age range');
      return '';
    },
    gender: () => '',
    mobile: (v) => {
      if (!v.trim())      return t('Mobile required');
      const d = v.replace(/\D/g, '');
      if (d.length !== 10)   return t('Mobile 10 digits');
      if (!/^[6-9]/.test(d)) return t('Mobile start');
      return '';
    },
    // Step 2
    houseNo: (v) => (!v.trim() ? t('House required') : ''),
    street:  (v) => (!v.trim() ? t('Street required') : v.trim().length < 3 ? t('Street min') : ''),
    district:(v) => (!v.trim() ? t('District required') : ''),
    state:   (v) => (!v       ? t('State required') : ''),
    pincode: (v) => {
      if (!v.trim())      return t('Pincode required');
      if (!/^\d{6}$/.test(v.replace(/\s/g,'')))
        return t('Pincode 6 digits');
      return '';
    },
    // Step 3
    aadhaar: (v) => {
      if (!v.trim())        return t('Aadhaar required');
      const d = v.replace(/\s/g, '');
      if (!/^\d+$/.test(d)) return t('Aadhaar digits only');
      if (d.length !== 12)  return t('Aadhaar 12 digits');
      if (!aadhaarPatternCheck(d)) return t('Aadhaar invalid pattern');
      if (!verhoeffValidate(d))    return t('Aadhaar checksum');
      return '';
    },
    hasAbha: (v) => (v === null ? t('Abha choice required') : ''),
    abha: (v, all) => {
      if (all?.hasAbha !== 'yes') return '';
      if (!v.trim())              return t('Abha required');
      // ABHA format: 14-digit number or XX-XXXX-XXXX-XXXX
      const clean = v.replace(/-/g, '');
      if (!/^\d{14}$/.test(clean)) return t('Abha format');
      return '';
    },
    abhaAcknowledged: (v, all) => {
      if (all?.hasAbha === 'no' && !v) return 'You must acknowledge the warning to proceed.';
      return '';
    },
  };

  /* ─── Step field groups ─────────────────────────────────────── */
  const STEP_FIELDS = [
    ['name', 'age', 'gender', 'mobile'],
    ['houseNo', 'street', 'district', 'state', 'pincode'],
    ['aadhaar', 'hasAbha', 'abha', 'abhaAcknowledged'],
  ];

  /* ─── Handlers ──────────────────────────────────────────────── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newData = { ...formData, [name]: value };
    setFormData(newData);
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: VALIDATORS[name]?.(value, newData) || '' }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: VALIDATORS[name]?.(value, formData) || '' }));
  };

  const validateStep = (stepIdx) => {
    const fields = STEP_FIELDS[stepIdx];
    const newErrors = {};
    const newTouched = {};
    fields.forEach(key => {
      newTouched[key] = true;
      newErrors[key] = VALIDATORS[key]?.(formData[key], formData) || '';
    });
    setTouched(prev => ({ ...prev, ...newTouched }));
    setErrors(prev => ({ ...prev, ...newErrors }));
    return !Object.values(newErrors).some(e => e !== '');
  };

  const handleNext = () => {
    if (validateStep(step)) setStep(s => s + 1);
  };

  const handleBack = () => {
    if (step === 0) navigate(-1);
    else setStep(s => s - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(2)) return;
    setApiError('');
    setLoading(true);
    try {
      const payload = {
        name: formData.name.trim(),
        age: formData.age,
        gender: formData.gender,
        mobile: formData.mobile.replace(/\D/g,''),
        address: {
          houseNo: formData.houseNo.trim(),
          street: formData.street.trim(),
          district: formData.district.trim(),
          state: formData.state,
          pincode: formData.pincode.trim(),
        },
        aadhaar: formData.aadhaar.replace(/\s/g,''),
        abha: formData.hasAbha === 'yes' ? formData.abha.trim() : null,
      };
      const data = await registerPatient(payload);
      if (data.success) {
        updatePatientData({ personalInfo: payload, uhid: data.uhid, isNew: true });
        navigate('/symptoms');
      } else {
        setApiError(data.message || 'Registration failed. Please try again.');
      }
    } catch {
      setApiError('Cannot connect to server. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  /* ─── Error helper ──────────────────────────────────────────── */
  const FieldError = ({ name }) =>
    touched[name] && errors[name] ? (
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.3rem',
        marginTop: '0.3rem', color: 'var(--error)',
        fontSize: '0.8rem', fontWeight: 500,
        animation: 'fadeInUp 0.2s ease-out'
      }}>
        <AlertCircle size={14} /> {errors[name]}
      </div>
    ) : null;

  const inputStyle = (name) => ({
    paddingLeft: '2.5rem',
    borderColor: touched[name] && errors[name] ? 'var(--error)' : undefined,
    boxShadow: touched[name] && errors[name] ? '0 0 0 3px rgba(239,68,68,0.1)' : undefined,
  });

  /* ─── Step 1: Personal Info ─────────────────────────────────── */
  const StepPersonal = () => (
    <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Name */}
      <div className="form-group">
        <label className="form-label">{t('Name')} <span style={{color:'var(--error)'}}>*</span></label>
        <div style={{ position: 'relative' }}>
          <span style={iconStyle(errors.name && touched.name)}><User size={18} /></span>
          <input id="reg-name" name="name" type="text" className="form-input"
            placeholder={t('NamePlaceholder')}
            value={formData.name} onChange={handleChange} onBlur={handleBlur}
            style={inputStyle('name')} maxLength={90} autoComplete="name" />
        </div>
        <FieldError name="name" />
      </div>

      {/* Age + Gender row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label className="form-label">{t('Age')} <span style={{color:'var(--error)'}}>*</span></label>
          <div style={{ position: 'relative' }}>
            <span style={iconStyle(errors.age && touched.age)}><Calendar size={18} /></span>
            <input id="reg-age" name="age" type="number" className="form-input"
              placeholder="25" value={formData.age}
              onChange={handleChange} onBlur={handleBlur}
              style={inputStyle('age')} min={1} max={120} />
          </div>
          <FieldError name="age" />
        </div>

        <div className="form-group">
          <label className="form-label">{t('Gender')} <span style={{color:'var(--error)'}}>*</span></label>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
            {[
              { val: 'Male',   label: t('Male'),   icon: '♂' },
              { val: 'Female', label: t('Female'), icon: '♀' },
              { val: 'Other',  label: t('Other'),  icon: '⚧' },
            ].map(g => (
              <button key={g.val} type="button" id={`reg-gender-${g.val.toLowerCase()}`}
                onClick={() => { setFormData(p => ({...p, gender: g.val})); }}
                style={{
                  flex: 1, minWidth: '60px',
                  padding: '0.55rem 0.4rem',
                  borderRadius: 'var(--radius-sm)',
                  border: formData.gender === g.val
                    ? '2px solid var(--primary-500)'
                    : '2px solid #e2e8f0',
                  background: formData.gender === g.val
                    ? 'var(--primary-50)'
                    : 'white',
                  color: formData.gender === g.val
                    ? 'var(--primary-700)'
                    : 'var(--text-secondary)',
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 600, fontSize: '0.78rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: '0.2rem',
                }}
              >
                <span style={{fontSize:'1rem'}}>{g.icon}</span> {g.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="form-group">
        <label className="form-label">{t('Mobile')} <span style={{color:'var(--error)'}}>*</span></label>
        <div style={{ position: 'relative' }}>
          <span style={iconStyle(errors.mobile && touched.mobile)}><Phone size={18} /></span>
          <input id="reg-mobile" name="mobile" type="tel" className="form-input"
            placeholder="9876543210" value={formData.mobile}
            onChange={handleChange} onBlur={handleBlur}
            style={inputStyle('mobile')} maxLength={10}
            inputMode="numeric" autoComplete="tel" />
        </div>
        <FieldError name="mobile" />
        <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.1rem' }}>
          {t('Mobile hint')}
        </span>
      </div>
    </div>
  );

  /* ─── Step 2: Address ───────────────────────────────────────── */
  const StepAddress = () => (
    <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Address guide banner */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: '0.6rem',
        padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
        background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)',
        fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.5
      }}>
        <Info size={16} style={{ color: 'var(--primary-500)', flexShrink: 0, marginTop: '0.1rem' }} />
        {t('Address guide')}
      </div>

      {/* House No & Street */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '1rem' }}>
        <div className="form-group">
          <label className="form-label">{t('House No')} <span style={{color:'var(--error)'}}>*</span></label>
          <div style={{ position: 'relative' }}>
            <span style={iconStyle(errors.houseNo && touched.houseNo)}><Home size={18} /></span>
            <input id="reg-house" name="houseNo" type="text" className="form-input"
              placeholder={t('HouseNoPlaceholder')} value={formData.houseNo}
              onChange={handleChange} onBlur={handleBlur}
              style={inputStyle('houseNo')} maxLength={20} />
          </div>
          <FieldError name="houseNo" />
        </div>

        <div className="form-group">
          <label className="form-label">{t('Street')} <span style={{color:'var(--error)'}}>*</span></label>
          <div style={{ position: 'relative' }}>
            <span style={iconStyle(errors.street && touched.street)}><MapPin size={18} /></span>
            <input id="reg-street" name="street" type="text" className="form-input"
              placeholder={t('StreetPlaceholder')} value={formData.street}
              onChange={handleChange} onBlur={handleBlur}
              style={inputStyle('street')} maxLength={100} />
          </div>
          <FieldError name="street" />
        </div>
      </div>

      {/* District */}
      <div className="form-group">
        <label className="form-label">{t('District')} <span style={{color:'var(--error)'}}>*</span></label>
        <div style={{ position: 'relative' }}>
          <span style={iconStyle(errors.district && touched.district)}><MapPin size={18} /></span>
          <input id="reg-district" name="district" type="text" className="form-input"
            placeholder={t('DistrictPlaceholder')} value={formData.district}
            onChange={handleChange} onBlur={handleBlur}
            style={inputStyle('district')} maxLength={60} />
        </div>
        <FieldError name="district" />
      </div>

      {/* State + PIN */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label className="form-label">{t('State')} <span style={{color:'var(--error)'}}>*</span></label>
          <div style={{ position: 'relative' }}>
            <span style={iconStyle(errors.state && touched.state)}><MapPin size={18} /></span>
            <select id="reg-state" name="state" className="form-input"
              value={formData.state} onChange={handleChange} onBlur={handleBlur}
              style={{ ...inputStyle('state'), appearance: 'none' }}>
              <option value="">{t('Select State')}</option>
              {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <FieldError name="state" />
        </div>

        <div className="form-group">
          <label className="form-label">{t('Pincode')} <span style={{color:'var(--error)'}}>*</span></label>
          <div style={{ position: 'relative' }}>
            <span style={iconStyle(errors.pincode && touched.pincode)}><Hash size={18} /></span>
            <input id="reg-pincode" name="pincode" type="text" className="form-input"
              placeholder="560001" value={formData.pincode}
              onChange={handleChange} onBlur={handleBlur}
              style={inputStyle('pincode')} maxLength={6}
              inputMode="numeric" />
          </div>
          <FieldError name="pincode" />
        </div>
      </div>
    </div>
  );

  /* ─── Step 3: Identity ──────────────────────────────────────── */
  const StepIdentity = () => (
    <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
      {/* Aadhaar */}
      <div className="form-group">
        <label className="form-label">{t('Aadhaar')} <span style={{color:'var(--error)'}}>*</span></label>
        <div style={{ position: 'relative' }}>
          <span style={iconStyle(errors.aadhaar && touched.aadhaar)}><CreditCard size={18} /></span>
          <input id="reg-aadhaar" name="aadhaar" type="text" className="form-input"
            placeholder="1234 5678 9012" value={formData.aadhaar}
            onChange={(e) => {
              // Auto-format with spaces
              let val = e.target.value.replace(/\D/g,'').slice(0,12);
              val = val.replace(/(\d{4})(?=\d)/g,'$1 ').trim();
              handleChange({ target: { name: 'aadhaar', value: val } });
            }}
            onBlur={handleBlur}
            style={inputStyle('aadhaar')} maxLength={14}
            inputMode="numeric" autoComplete="off" />
          {/* Checksum indicator */}
          {formData.aadhaar.replace(/\s/g,'').length === 12 && (
            <span style={{
              position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)'
            }}>
              {VALIDATORS.aadhaar(formData.aadhaar) === ''
                ? <CheckCircle2 size={18} style={{color:'var(--success)'}} />
                : <XCircle size={18} style={{color:'var(--error)'}} />}
            </span>
          )}
        </div>
        <FieldError name="aadhaar" />
        <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.1rem' }}>
          {t('Aadhaar hint')}
        </span>
      </div>

      {/* ABHA Checkpoint */}
      <div style={{
        border: '1.5px solid #e2e8f0', borderRadius: 'var(--radius-md)',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '0.9rem 1rem',
          background: 'linear-gradient(135deg, rgba(59,130,246,0.06), rgba(139,92,246,0.06))',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex', alignItems: 'center', gap: '0.5rem',
        }}>
          <ShieldCheck size={18} style={{ color: 'var(--primary-600)' }} />
          <span style={{
            fontFamily: "'Outfit', sans-serif", fontWeight: 700,
            fontSize: '0.9rem', color: 'var(--text-primary)'
          }}>
            {t('Abha question')}
          </span>
          <span style={{ color: 'var(--error)', marginLeft: '0.1rem' }}>*</span>
        </div>

        <div style={{ padding: '1rem' }}>
          {/* Yes / No radio cards */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
            {[
              { val: 'yes', label: t('Yes I have ABHA'), icon: '✅' },
              { val: 'no',  label: t('No I dont have ABHA'), icon: '❌' },
            ].map(opt => (
              <button key={opt.val} type="button" id={`reg-abha-${opt.val}`}
                onClick={() => {
                  const newData = { ...formData, hasAbha: opt.val, abha: opt.val === 'no' ? '' : formData.abha };
                  setFormData(newData);
                  setTouched(p => ({ ...p, hasAbha: true }));
                  setErrors(p => ({ ...p, hasAbha: '', abha: '' }));
                }}
                style={{
                  flex: 1, padding: '0.75rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  border: formData.hasAbha === opt.val
                    ? `2px solid ${opt.val === 'yes' ? 'var(--success)' : 'var(--accent-rose)'}`
                    : '2px solid #e2e8f0',
                  background: formData.hasAbha === opt.val
                    ? opt.val === 'yes' ? 'rgba(16,185,129,0.07)' : 'rgba(244,63,94,0.06)'
                    : 'white',
                  cursor: 'pointer', transition: 'all 0.2s ease',
                  fontFamily: "'Outfit', sans-serif", fontWeight: 600,
                  fontSize: '0.82rem', color: 'var(--text-primary)',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: '0.25rem',
                }}
              >
                <span style={{ fontSize: '1.3rem' }}>{opt.icon}</span>
                {opt.label}
              </button>
            ))}
          </div>
          {touched.hasAbha && errors.hasAbha && (
            <div style={{
              display:'flex', alignItems:'center', gap:'0.3rem',
              color:'var(--error)', fontSize:'0.8rem', fontWeight:500, marginBottom:'0.5rem'
            }}>
              <AlertCircle size={14} /> {errors.hasAbha}
            </div>
          )}

          {/* If YES → ABHA input */}
          {formData.hasAbha === 'yes' && (
            <div className="form-group" style={{ animation: 'fadeInUp 0.25s ease-out' }}>
              <label className="form-label">{t('Abha Number')} <span style={{color:'var(--error)'}}>*</span></label>
              <div style={{ position: 'relative' }}>
                <span style={iconStyle(errors.abha && touched.abha)}><ShieldCheck size={18} /></span>
                <input id="reg-abha" name="abha" type="text" className="form-input"
                  placeholder="12-3456-7890-1234"
                  value={formData.abha} onChange={handleChange} onBlur={handleBlur}
                  style={inputStyle('abha')} maxLength={17}
                  inputMode="numeric" autoComplete="off" />
              </div>
              <FieldError name="abha" />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.1rem' }}>
                {t('Abha hint')}
              </span>
            </div>
          )}

          {/* If NO → ABHA generation info */}
          {formData.hasAbha === 'no' && (
            <div style={{
              padding: '1.25rem', borderRadius: 'var(--radius-sm)',
              background: 'rgba(239, 68, 68, 0.04)',
              border: '2px solid rgba(239, 68, 68, 0.3)',
              animation: 'fadeInUp 0.25s ease-out'
            }}>
              <p style={{
                fontFamily: "'Outfit', sans-serif", fontWeight: 800,
                fontSize: '1rem', color: 'var(--error)', marginBottom: '0.5rem',
                display: 'flex', alignItems: 'center', gap: '0.4rem'
              }}>
                <AlertCircle size={18} /> STRICT WARNING
              </p>
              <p style={{ 
                fontSize: '0.9rem', color: 'var(--text-secondary)', 
                lineHeight: 1.6, marginBottom: '1rem', fontWeight: 500 
              }}>
                Please note that there is an existing exclusive ABHA Generation counter in PES Hospital. You can easily generate your ABHA number by visiting that counter.
              </p>

              <label style={{
                display: 'flex', alignItems: 'center', gap: '0.6rem',
                padding: '0.8rem', background: 'white', border: '1px solid #e2e8f0',
                borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                borderColor: touched.abhaAcknowledged && errors.abhaAcknowledged ? 'var(--error)' : '#e2e8f0'
              }}>
                <input 
                  type="checkbox" 
                  name="abhaAcknowledged"
                  id="reg-abha-ack"
                  checked={formData.abhaAcknowledged}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setFormData(p => ({ ...p, abhaAcknowledged: checked }));
                    if (checked) setErrors(p => ({ ...p, abhaAcknowledged: '' }));
                  }}
                  onBlur={handleBlur}
                  style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--error)' }}
                />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  I acknowledge and will visit the counter later.
                </span>
              </label>
              <FieldError name="abhaAcknowledged" />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  /* ─── Shared icon style helper ──────────────────────────────── */
  function iconStyle(hasError) {
    return {
      position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
      color: hasError ? 'var(--error)' : 'var(--text-tertiary)',
      display: 'flex', pointerEvents: 'none', transition: 'color 0.2s',
    };
  }

  /* ─── Step titles ───────────────────────────────────────────── */
  const stepTitles    = [t('Step Personal'),   t('Step Address'),   t('Step Identity')];
  const stepSubtitles = [t('Step Personal Sub'), t('Step Address Sub'), t('Step Identity Sub')];
  const stepIcons = ['👤', '🏠', '🪪'];

  /* ─── Render ────────────────────────────────────────────────── */
  return (
    <div className="glass-card animate-in" style={{
      padding: '2rem 2.25rem 2.5rem',
      maxWidth: '540px', width: '100%'
    }}>
      {/* Back button */}
      <button id="reg-back-btn" onClick={handleBack} style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
        background: 'var(--primary-600)', border: 'none', cursor: 'pointer',
        fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: '0.82rem',
        color: 'white', marginBottom: '1.25rem', padding: '0.4rem 0.85rem',
        borderRadius: 'var(--radius-md)',
        boxShadow: '0 4px 12px rgba(37,99,235,0.2)', transition: 'all 0.2s ease',
      }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary-700)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'var(--primary-600)'; e.currentTarget.style.transform = 'translateY(0)'; }}
      >
        <ArrowLeft size={15} strokeWidth={2.5} /> {t('Back')}
      </button>

      {/* Progress bar */}
      <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '1.5rem' }}>
        {STEPS.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: '5px', borderRadius: '3px',
            background: i <= step
              ? 'linear-gradient(90deg, var(--primary-500), var(--accent-violet))'
              : '#e2e8f0',
            transition: 'background 0.35s ease',
          }} />
        ))}
      </div>

      {/* Step indicator */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: '0.5rem', marginBottom: '0.35rem'
      }}>
        <span style={{
          padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)',
          background: 'var(--primary-100)', color: 'var(--primary-700)',
          fontSize: '0.78rem', fontWeight: 700, fontFamily: "'Outfit', sans-serif",
          letterSpacing: '0.3px'
        }}>
          {t('Step')} {step + 1} / {STEPS.length}
        </span>
      </div>

      {/* Title */}
      <h2 className="page-title text-gradient" style={{ textAlign: 'center', fontSize: '1.6rem' }}>
        {stepIcons[step]} {stepTitles[step]}
      </h2>
      <p className="page-subtitle" style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '0.92rem' }}>
        {stepSubtitles[step]}
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate>
        {step === 0 && StepPersonal()}
        {step === 1 && StepAddress()}
        {step === 2 && StepIdentity()}

        {/* API Error */}
        {apiError && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
            background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)',
            color: 'var(--error)', fontSize: '0.875rem', marginTop: '1rem'
          }}>
            <AlertCircle size={16} /> {apiError}
          </div>
        )}

        {/* Action button */}
        <button
          id={step < 2 ? 'reg-next-btn' : 'reg-submit-btn'}
          type={step < 2 ? 'button' : 'submit'}
          className="btn btn-primary btn-lg"
          style={{ width: '100%', marginTop: '1.5rem' }}
          onClick={step < 2 ? handleNext : undefined}
          disabled={loading}
        >
          {loading
            ? <><Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> {t('Registering')}...</>
            : step < 2
              ? <>{t('Next')} <ArrowRight size={20} /></>
              : <><CheckCircle2 size={20} /> {t('Register')}</>
          }
        </button>
      </form>
    </div>
  );
};

export default Registration;
