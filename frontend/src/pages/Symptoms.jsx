import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePatient } from '../context/PatientContext';
import { createVisit } from '../services/api';
import { Mic, MicOff, Check, ArrowRight, ArrowLeft, Volume2, Loader2, AlertCircle } from 'lucide-react';

// ── PESU Hospital Department Map ────────────────────────────────────
// 1st Floor: General Medicine, General Surgery, Obstetrics, Gynaecology,
//            Paediatrics, Dental, Orthopaedic
// 2nd Floor: Psychiatry, Ophthalmologist, ENT, Dermatology (DVL)
const DEPARTMENT_MAP = [
  // 1st Floor
  { dept: "General Medicine",  floor: 1, room: "101", keywords: ["fever", "cold", "cough", "body ache", "weakness", "general medicine"] },
  { dept: "General Surgery",   floor: 1, room: "105", keywords: ["general surgery", "surgery", "surgical", "wound"] },
  { dept: "Obstetrics",        floor: 1, room: "110", keywords: ["obstetrics", "pregnancy", "antenatal", "prenatal", "maternity"] },
  { dept: "Gynaecology",       floor: 1, room: "112", keywords: ["women's health", "gynaecology", "period", "menstrual"] },
  { dept: "Paediatrics",       floor: 1, room: "115", keywords: ["child fever", "vaccination", "child growth", "child health", "paediatrics"] },
  { dept: "Dental",            floor: 1, room: "118", keywords: ["toothache", "gum pain", "cavity", "tooth problem", "dental"] },
  { dept: "Orthopaedic",       floor: 1, room: "120", keywords: ["bone pain", "joint pain", "back pain", "fracture", "orthopaedic"] },
  // 2nd Floor
  { dept: "Psychiatry",        floor: 2, room: "201", keywords: ["mental health", "anxiety", "depression", "stress", "emotional", "insomnia"] },
  { dept: "Ophthalmologist",   floor: 2, room: "205", keywords: ["eye pain", "blurry vision", "redness", "eye problem", "cataract"] },
  { dept: "ENT",               floor: 2, room: "210", keywords: ["ear pain", "hearing problem", "throat pain", "ear problem", "nose problem", "sinus"] },
  { dept: "Dermatology (DVL)", floor: 2, room: "215", keywords: ["skin rash", "itching", "hair loss", "skin problem", "acne", "eczema"] },
];

// Expanded chips
const DISPLAY_SYMPTOMS = [
  { id: "fever",   label: "Fever / Cold",             emoji: "🤒" },
  { id: "gynae",   label: "Women's Health",            emoji: "👩" },
  { id: "pregnancy", label: "Pregnancy",             emoji: "🤰" },
  { id: "child",   label: "Child Health",              emoji: "👶" },
  { id: "vaccination", label: "Vaccination",         emoji: "💉" },
  { id: "dental",  label: "Tooth / Dental",            emoji: "🦷" },
  { id: "bone",    label: "Bone / Joint Pain",         emoji: "🦴" },
  { id: "back",    label: "Back Pain",                 emoji: "⚡" },
  { id: "mental",  label: "Mental / Emotional Health", emoji: "🧠" },
  { id: "eye",     label: "Eye Problem",               emoji: "👁️" },
  { id: "ent",     label: "Ear / Nose / Throat",       emoji: "👂" },
  { id: "skin",    label: "Skin Problem",              emoji: "🩹" },
  { id: "hair",    label: "Hair Loss",                 emoji: "💇" },
  { id: "wound",   label: "Wound / Abscess",           emoji: "🤕" },
  { id: "other",   label: "Other",                     emoji: "❓" },
];
const SYMPTOM_KEYWORDS = {
  "fever":  "fever",
  "gynae":  "women's health",
  "pregnancy": "pregnancy",
  "child":  "child health",
  "vaccination": "vaccination",
  "dental": "toothache",
  "bone":   "bone pain",
  "back":   "back pain",
  "mental": "mental health",
  "eye":    "eye problem",
  "ent":    "ear problem",
  "skin":   "skin rash",
  "hair":   "hair loss",
  "wound":  "wound",
};


const Symptoms = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { patientData, updatePatientData } = usePatient();
  const [selected, setSelected] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [manualText, setManualText] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  // Check if SpeechRecognition is available (requires secure context: HTTPS or localhost)
  const hasSpeechSupport = !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  const toggleSymptom = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const speakText = (text) => {
    if (!('speechSynthesis' in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    const langMap = { 'en': 'en-IN', 'hi': 'hi-IN', 'kn': 'kn-IN', 'te': 'te-IN', 'ta': 'ta-IN' };
    utterance.lang = langMap[patientData.language] || 'en-IN';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    const langMap = { 'en': 'en-IN', 'hi': 'hi-IN', 'kn': 'kn-IN', 'te': 'te-IN', 'ta': 'ta-IN' };
    recognition.lang = langMap[patientData.language] || 'en-IN';
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const speech = event.results[0][0].transcript.toLowerCase();
      setVoiceText(speech);
      DISPLAY_SYMPTOMS.forEach(sym => {
        const kw = SYMPTOM_KEYWORDS[sym.id];
        if (speech.includes(kw) && !selected.includes(sym.id)) {
          setSelected(prev => [...prev, sym.id]);
        }
      });
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const handleSubmit = async () => {
    const textInput = voiceText || manualText;
    if (selected.length === 0 && !textInput) return;
    setApiError('');
    setLoading(true);

    // Build symptoms array — selected button IDs + any voice/text input
    const symptomsArray = [
      ...selected.map(id => SYMPTOM_KEYWORDS[id] || id),
      ...(textInput ? [textInput] : [])
    ];

    try {
      const data = await createVisit({
        patientUHID: patientData.uhid || 'WALKIN',
        patientName: patientData.personalInfo?.name || 'Unknown',
        symptoms: symptomsArray,
        language: patientData.language || 'en',
        visitType: patientData.isNew ? 'new' : 'returning',
      });

      if (data.success) {
        updatePatientData({
          symptoms: symptomsArray,
          departmentInfo: {
            name: data.department,
            floor: data.floor,
            room: data.room,
            token: data.token,
          }
        });
        navigate('/token');
      } else {
        setApiError(data.message || 'Failed to get token. Please try again.');
      }
    } catch {
      setApiError('Cannot connect to server. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const hasInput = selected.length > 0 || voiceText || manualText;

  return (
    <div className="glass-card animate-in" style={{ padding: '2.5rem', maxWidth: '600px', width: '100%' }}>
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

      {/* Progress */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '2rem' }}>
        {[1,2,3].map(step => (
          <div key={step} style={{
            flex: 1, height: '4px', borderRadius: '2px',
            background: step <= 2 ? 'linear-gradient(90deg, var(--primary-500), var(--accent-violet))' : '#e2e8f0'
          }} />
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <h2 className="page-title text-gradient" style={{ margin: 0 }}>{t('Select Symptoms')}</h2>
        <button onClick={() => speakText(t('Select Symptoms'))}
          style={{ width: '36px', height: '36px', borderRadius: '50%', border: 'none', cursor: 'pointer', background: 'var(--primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Volume2 size={18} color="var(--primary-600)" />
        </button>
      </div>
      <p className="page-subtitle" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        {t('Tap or voice')}
      </p>

      {/* Voice Input (if supported) or Text Fallback */}
      {hasSpeechSupport ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <button
            onClick={startVoiceInput}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.6rem',
              padding: '0.85rem 1.5rem', borderRadius: 'var(--radius-full)',
              border: `2px solid ${isListening ? 'var(--error)' : 'var(--primary-200)'}`,
              background: isListening ? 'rgba(239,68,68,0.06)' : 'white',
              cursor: 'pointer', fontFamily: "'Outfit',sans-serif", fontWeight: 600,
              color: isListening ? 'var(--error)' : 'var(--primary-600)',
              transition: 'all var(--duration-normal) var(--ease-out)',
              boxShadow: isListening ? '0 0 0 4px rgba(239,68,68,0.1)' : 'var(--shadow-sm)'
            }}
          >
            {isListening ? <MicOff size={20} className="animate-pulse" /> : <Mic size={20} />}
            {isListening ? t('Listening') : t('Speak your symptoms')}
          </button>
        </div>
      ) : (
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{
            padding: '0.6rem 1rem', borderRadius: 'var(--radius-sm)',
            background: '#fef3c7', border: '1px solid #fcd34d',
            fontSize: '0.8rem', color: '#92400e', marginBottom: '0.75rem', textAlign: 'center'
          }}>
            ⚠️ Voice input requires HTTPS. You can type your symptoms below instead.
          </div>
          <input
            type="text" className="form-input"
            placeholder="e.g. fever, chest pain, toothache..."
            value={manualText}
            onChange={(e) => setManualText(e.target.value)}
            style={{ textAlign: 'center' }}
          />
        </div>
      )}

      {voiceText && (
        <div style={{
          padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
          background: 'var(--primary-50)', border: '1px solid var(--primary-200)',
          marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--primary-700)',
          textAlign: 'center'
        }}>
          🎙️ {t('Voice captured')}: <strong>"{voiceText}"</strong>
        </div>
      )}

      {/* Symptom Grid (now includes Dental) */}
      <div className="stagger-children" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '2rem' }}>
        {DISPLAY_SYMPTOMS.map(sym => {
          const isActive = selected.includes(sym.id);
          return (
            <button
              key={sym.id}
              onClick={() => toggleSymptom(sym.id)}
              className="animate-in"
              style={{
                padding: '1rem', borderRadius: 'var(--radius-md)',
                border: `2px solid ${isActive ? 'var(--primary-400)' : '#e2e8f0'}`,
                background: isActive ? 'var(--primary-50)' : 'white',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem',
                fontFamily: "'Inter',sans-serif", fontWeight: 500,
                color: isActive ? 'var(--primary-700)' : 'var(--text-primary)',
                transition: 'all var(--duration-normal) var(--ease-out)',
                boxShadow: isActive ? '0 0 0 3px rgba(59,130,246,0.1)' : 'none',
                textAlign: 'left'
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>{sym.emoji}</span>
              <span style={{ flex: 1, fontSize: '0.95rem' }}>{sym.label}</span>
              {isActive && <Check size={18} color="var(--primary-500)" strokeWidth={3} />}
            </button>
          );
        })}
      </div>

      {apiError && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.4rem',
          padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
          background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)',
          color: 'var(--error)', fontSize: '0.875rem', marginBottom: '1rem'
        }}>
          <AlertCircle size={16} /> {apiError}
        </div>
      )}

      <button
        className="btn btn-primary btn-lg"
        onClick={handleSubmit}
        disabled={!hasInput || loading}
        style={{
          width: '100%',
          opacity: !hasInput ? 0.5 : 1,
          pointerEvents: !hasInput ? 'none' : 'auto'
        }}
      >
        {loading
          ? <><Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Getting Token...</>
          : <>{t('Submit')} <ArrowRight size={20} /></>
        }
      </button>
    </div>

  );
};

export default Symptoms;
