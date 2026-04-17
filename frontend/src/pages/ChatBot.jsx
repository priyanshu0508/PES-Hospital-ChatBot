import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePatient } from '../context/PatientContext';
import { m, validators, SYMPTOM_CHIPS } from '../utils/chatFlow';
import QRSlip from '../components/QRSlip';
import { Send, ArrowLeft } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/* ═══════════════════════════════════════════════════════════════════
   Typing Indicator — animated dots while bot is "thinking"
   ═══════════════════════════════════════════════════════════════════ */
const TypingIndicator = () => (
  <div className="chat-bubble-row bot-row">
    <div className="bot-avatar">PES</div>
    <div className="chat-bubble bot-bubble typing-bubble">
      <div className="typing-dots">
        <span></span><span></span><span></span>
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   Chat Bubble — renders a single message (bot or user)
   ═══════════════════════════════════════════════════════════════════ */
const ChatBubble = ({ message }) => {
  const isBot = message.from === 'bot';
  return (
    <div className={`chat-bubble-row ${isBot ? 'bot-row' : 'user-row'} animate-bubble`}>
      {isBot && <div className="bot-avatar">PES</div>}
      <div className={`chat-bubble ${isBot ? 'bot-bubble' : 'user-bubble'}`}>
        {message.text.split('\n').map((line, i) => (
          <span key={i}>
            {line.includes('*')
              ? line.split(/\*([^*]+)\*/).map((part, j) =>
                  j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                )
              : line}
            {i < message.text.split('\n').length - 1 && <br />}
          </span>
        ))}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   ChatBot — Main page component
   ═══════════════════════════════════════════════════════════════════ */
const ChatBot = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { patientData, resetPatientData } = usePatient();
  const lang = patientData.language || i18n.language || 'en';

  // ─── State ──────────────────────────────────────────────────
  const [messages, setMessages] = useState([]);
  const [step, setStep] = useState('init');
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [slip, setSlip] = useState(null);
  const [lastVisitData, setLastVisitData] = useState(null);
  const [patientRecord, setPatientRecord] = useState(null);
  const [inputDisabled, setInputDisabled] = useState(true);
  const [options, setOptions] = useState(null);
  const [showSymptoms, setShowSymptoms] = useState(false);
  const [isSameDept, setIsSameDept] = useState(false);

  // Use ref for collected data to avoid stale closure issues
  const collectedRef = useRef({});
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const initializedRef = useRef(false);

  const updateCollected = (data) => {
    collectedRef.current = { ...collectedRef.current, ...data };
  };

  // ─── Auto scroll ────────────────────────────────────────────
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, options, showSymptoms]);

  // ─── Focus input ────────────────────────────────────────────
  useEffect(() => {
    if (!inputDisabled && !options && !showSymptoms) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [step, inputDisabled, options, showSymptoms]);

  // ─── Add bot message with typing delay ──────────────────────
  const addBot = useCallback((text, delay = 700) => {
    return new Promise(resolve => {
      setIsTyping(true);
      setInputDisabled(true);
      setOptions(null);
      setShowSymptoms(false);
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, { from: 'bot', text, id: Date.now() + Math.random() }]);
        setInputDisabled(false);
        resolve();
      }, delay);
    });
  }, []);

  const addUser = useCallback((text) => {
    setMessages(prev => [...prev, { from: 'user', text, id: Date.now() + Math.random() }]);
  }, []);

  // ─── Initialize chat ───────────────────────────────────────
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const init = async () => {
      await addBot(m('greeting', lang), 600);
      await addBot(m('visit_type_prompt', lang), 800);
      setStep('visit_type');
      setOptions([
        { label: m('first_visit', lang), value: 'first' },
        { label: m('followup_visit', lang), value: 'followup' },
      ]);
    };
    init();
  }, [lang, addBot]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Determine input type for current step ─────────────────
  const getInputType = () => {
    switch (step) {
      case 'ask_dob': return 'date';
      case 'ask_mobile':
      case 'ask_aadhaar':
      case 'ask_abha_number': return 'tel';
      default: return 'text';
    }
  };

  const getPlaceholder = () => {
    switch (step) {
      case 'ask_name': return m('placeholder_name', lang);
      case 'ask_mobile': return '9876543210';
      case 'ask_aadhaar': return '1234 5678 9012';
      case 'ask_abha_number': return '12-3456-7890-1234';
      case 'ask_uhid': return 'PES-AB1234';
      default: return '';
    }
  };

  const showTextInput = () => {
    const textSteps = ['ask_name', 'ask_dob', 'ask_mobile', 'ask_aadhaar', 'ask_abha_number', 'ask_uhid'];
    return textSteps.includes(step) && !options && !showSymptoms;
  };

  // ─── Handle option button click ────────────────────────────
  const handleOption = async (value, label) => {
    addUser(label);
    setOptions(null);
    setInputDisabled(true);

    switch (step) {
      case 'visit_type': {
        if (value === 'first') {
          await addBot(m('ask_name', lang));
          setStep('ask_name');
        } else {
          await addBot(m('ask_uhid', lang));
          setStep('ask_uhid');
        }
        break;
      }

      case 'verify_patient': {
        if (value === 'yes') {
          await addBot(m('same_dept_or_new', lang));
          setStep('same_or_new');
          setOptions([
            { label: m('same_dept_btn', lang), value: 'same' },
            { label: m('new_concern_btn', lang), value: 'new' },
          ]);
        } else {
          // Helping someone else → first visit for new person
          collectedRef.current = {};
          setPatientRecord(null);
          await addBot(m('ask_name', lang));
          setStep('ask_name');
        }
        break;
      }

      case 'same_or_new': {
        if (value === 'same') {
          setIsSameDept(true);
          await addBot(m('ask_followup_symptoms', lang));
        } else {
          setIsSameDept(false);
          await addBot(m('ask_symptoms', lang));
        }
        setStep('ask_symptoms');
        setShowSymptoms(true);
        break;
      }

      case 'ask_gender': {
        const genderMap = { male: 'Male', female: 'Female', other: 'Other' };
        updateCollected({ gender: genderMap[value] });
        await addBot(m('ask_mobile', lang));
        setStep('ask_mobile');
        break;
      }

      case 'ask_abha_choice': {
        if (value === 'yes') {
          await addBot(m('enter_abha', lang));
          setStep('ask_abha_number');
        } else {
          // ABHA is mandatory — show notice
          await addBot(m('abha_mandatory_notice', lang));
          setStep('abha_required_notice');
          setOptions([
            { label: m('have_abha_now', lang), value: 'have_now' },
            { label: m('generate_abha_link', lang), value: 'generate' },
          ]);
        }
        break;
      }

      case 'abha_required_notice': {
        if (value === 'have_now') {
          await addBot(m('enter_abha', lang));
          setStep('ask_abha_number');
        } else if (value === 'generate') {
          window.open('https://abha.abdm.gov.in/abha/v3/', '_blank');
          await addBot(m('abha_after_generate', lang));
          setOptions([
            { label: m('have_abha_now', lang), value: 'have_now' },
          ]);
        }
        break;
      }

      case 'uhid_not_found': {
        if (value === 'retry') {
          await addBot(m('ask_uhid', lang));
          setStep('ask_uhid');
        } else {
          collectedRef.current = {};
          await addBot(m('ask_name', lang));
          setStep('ask_name');
        }
        break;
      }

      case 'confirm_booking': {
        if (value === 'yes') {
          await performBooking();
        } else {
          setStep('ask_symptoms');
          setShowSymptoms(true);
        }
        break;
      }

      default: break;
    }
  };

  // ─── Handle text form submit ────────────────────────────────
  const handleSubmit = async (e) => {
    e?.preventDefault();
    const val = input.trim();
    if (!val || inputDisabled) return;

    addUser(val);
    setInput('');
    setInputDisabled(true);

    switch (step) {
      case 'ask_name': {
        const err = validators.name(val);
        if (err) { await addBot(m(err, lang)); return; }
        updateCollected({ name: val.trim() });
        await addBot(m('ask_dob', lang, val.trim()));
        setStep('ask_dob');
        break;
      }

      case 'ask_dob': {
        const err = validators.dob(val);
        if (err) { await addBot(m(err, lang)); return; }
        const dob = new Date(val);
        const age = Math.floor((new Date() - dob) / (365.25 * 24 * 3600 * 1000));
        updateCollected({ dob: val, age });
        await addBot(m('ask_gender', lang));
        setStep('ask_gender');
        setOptions([
          { label: m('male', lang), value: 'male' },
          { label: m('female', lang), value: 'female' },
          { label: m('other', lang), value: 'other' },
        ]);
        break;
      }

      case 'ask_mobile': {
        const err = validators.mobile(val);
        if (err) { await addBot(m(err, lang)); return; }
        updateCollected({ mobile: val.replace(/\s/g, '') });
        await addBot(m('ask_aadhaar', lang));
        setStep('ask_aadhaar');
        break;
      }

      case 'ask_aadhaar': {
        const err = validators.aadhaar(val);
        if (err) { await addBot(m(err, lang)); return; }
        updateCollected({ aadhaar: val.replace(/\s|-/g, '') });
        await addBot(m('ask_abha_choice', lang));
        setStep('ask_abha_choice');
        setOptions([
          { label: m('yes_abha', lang), value: 'yes' },
          { label: m('no_abha', lang), value: 'no' },
        ]);
        break;
      }

      case 'ask_abha_number': {
        const cleaned = val.replace(/-/g, '');
        if (!/^\d{14}$/.test(cleaned)) {
          await addBot(m('abha_format', lang));
          return;
        }
        updateCollected({ abha: cleaned });
        await addBot(m('ask_symptoms', lang));
        setStep('ask_symptoms');
        setShowSymptoms(true);
        break;
      }

      case 'ask_uhid': {
        const err = validators.uhid(val);
        if (err) { await addBot(m(err, lang)); return; }

        setIsTyping(true);
        setInputDisabled(true);
        try {
          const res = await fetch(`${API}/patients/${val.toUpperCase()}`);
          const data = await res.json();
          if (!data.success) {
            setIsTyping(false);
            await addBot(m('uhid_not_found', lang));
            setStep('uhid_not_found');
            setOptions([
              { label: m('retry_uhid', lang), value: 'retry' },
              { label: m('try_first_visit', lang), value: 'first' },
            ]);
            return;
          }

          // Get last visit
          let visitInfo = null;
          try {
            const visitRes = await fetch(`${API}/visits/last/${val.toUpperCase()}`);
            const visitData = await visitRes.json();
            if (visitData.success) visitInfo = visitData.visit;
          } catch (_) { /* no last visit — that's ok */ }

          setPatientRecord(data.patient);
          setLastVisitData(visitInfo);
          updateCollected({
            uhid: val.toUpperCase(),
            name: data.patient.name,
            age: data.patient.age,
            mobile: data.patient.mobile,
          });

          setIsTyping(false);

          const lastDept = visitInfo ? visitInfo.department : 'N/A';
          const lastDate = visitInfo
            ? new Date(visitInfo.timestamp).toLocaleDateString()
            : 'N/A';

          await addBot(m('welcome_back', lang, data.patient.name, lastDept, lastDate));
          await addBot(m('is_this_you', lang));
          setStep('verify_patient');
          setOptions([
            { label: m('yes_this_is_me', lang), value: 'yes' },
            { label: m('helping_someone', lang), value: 'no' },
          ]);
        } catch (error) {
          setIsTyping(false);
          console.error(error);
          await addBot(m('error_server', lang));
        }
        break;
      }

      default: break;
    }
  };

  // ─── Symptoms toggle ───────────────────────────────────────
  const toggleSymptom = (key) => {
    setSelectedSymptoms(prev =>
      prev.includes(key) ? prev.filter(s => s !== key) : [...prev, key]
    );
  };

  // ─── Confirm symptoms → show summary for confirmation ──────
  const confirmSymptoms = async () => {
    if (selectedSymptoms.length === 0) {
      await addBot(m('symptoms_required', lang));
      setShowSymptoms(true);
      return;
    }

    setShowSymptoms(false);
    const labels = selectedSymptoms.map(key => {
      const chip = SYMPTOM_CHIPS.find(c => c.key === key);
      return chip ? (chip.label[lang] || chip.label.en) : key;
    });
    addUser(labels.join(', '));

    // Show summary
    const col = collectedRef.current;
    const symptomsStr = labels.join(', ');
    await addBot(m('review_details', lang, col.name, col.age || 'N/A', symptomsStr));
    
    setStep('confirm_booking');
    setOptions([
      { label: m('yes_confirm', lang), value: 'yes' },
      { label: m('no_edit', lang), value: 'no' },
    ]);
  };

  // ─── Perform actual booking ────────────────────────────────
  const performBooking = async () => {
    await addBot(m('processing', lang));
    setStep('processing');

    try {
      const col = collectedRef.current;
      let uhid = col.uhid;

      // ── Register new patient (first visit only) ──
      if (!patientRecord) {
        const regRes = await fetch(`${API}/patients/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: col.name,
            age: col.age,
            gender: col.gender,
            aadhaar: col.aadhaar,
            mobile: col.mobile,
          }),
        });
        const regData = await regRes.json();
        if (!regData.success) {
          await addBot(m('error_server', lang));
          return;
        }
        uhid = regData.uhid;
      }

      // ── For "same department" follow-up, use last visit's dept keyword ──
      let symptomsToSend = selectedSymptoms;
      if (isSameDept && lastVisitData) {
        symptomsToSend = [...selectedSymptoms, lastVisitData.department.toLowerCase()];
      }

      // ── Create visit ──
      const visitRes = await fetch(`${API}/visits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientUHID: uhid,
          patientName: col.name,
          symptoms: symptomsToSend,
          language: lang,
          visitType: patientRecord ? 'returning' : 'new',
        }),
      });
      const visitData = await visitRes.json();
      if (!visitData.success) {
        await addBot(m('error_server', lang));
        return;
      }

      // ── Show OPD slip with QR code ──
      setSlip({
        uhid,
        name: col.name,
        token: visitData.token,
        department: visitData.department,
        floor: visitData.floor,
        room: visitData.room,
        date: new Date().toLocaleDateString(),
      });
      setStep('done');
    } catch (error) {
      console.error(error);
      await addBot(m('error_server', lang));
    }
  };

  // ─── Done handler ──────────────────────────────────────────
  const handleDone = () => {
    resetPatientData();
    navigate('/');
  };

  // ═══════════════════════════════════════════════════════════
  //  RENDER
  // ═══════════════════════════════════════════════════════════
  return (
    <div className="chat-page">
      {/* ── Top Bar ────────────────────────────────────────── */}
      <div className="chat-topbar">
        <button className="chat-back-btn" onClick={() => navigate('/')} title="Back">
          <ArrowLeft size={20} />
        </button>
        <div className="chat-topbar-info">
          <div className="chat-topbar-title">PES Hospital</div>
          <div className="chat-topbar-subtitle">OPD Registration Assistant</div>
        </div>
        <div className="chat-topbar-status">
          <span className="status-dot"></span> Online
        </div>
      </div>

      {/* ── Messages Area ─────────────────────────────────── */}
      <div className="chat-messages">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}

        {isTyping && <TypingIndicator />}

        {/* Option Buttons */}
        {options && !isTyping && (
          <div className="chat-options animate-bubble">
            {options.map((opt, i) => (
              <button
                key={i}
                className="chat-option-btn"
                onClick={() => handleOption(opt.value, opt.label)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {/* Symptom Chips */}
        {showSymptoms && !isTyping && (
          <div className="symptom-section animate-bubble">
            <div className="symptom-chips-grid">
              {SYMPTOM_CHIPS.map((chip) => (
                <button
                  key={chip.key}
                  className={`symptom-chip ${selectedSymptoms.includes(chip.key) ? 'selected' : ''}`}
                  onClick={() => toggleSymptom(chip.key)}
                >
                  {chip.label[lang] || chip.label.en}
                </button>
              ))}
            </div>
            <button
              className="symptom-confirm-btn"
              onClick={confirmSymptoms}
              disabled={selectedSymptoms.length === 0}
            >
              {m('confirm_symptoms', lang)} ({selectedSymptoms.length})
            </button>
          </div>
        )}

        {/* QR Slip */}
        {step === 'done' && slip && (
          <div className="animate-bubble" style={{ marginTop: '0.5rem' }}>
            <QRSlip slip={slip} onDone={handleDone} />
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* ── Input Bar ─────────────────────────────────────── */}
      {step !== 'done' && step !== 'processing' && showTextInput() && (
        <form className="chat-input-bar" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type={getInputType()}
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={getPlaceholder()}
            disabled={inputDisabled}
            autoComplete="off"
          />
          <button
            type="submit"
            className="chat-send-btn"
            disabled={inputDisabled || !input.trim()}
          >
            <Send size={20} />
          </button>
        </form>
      )}
    </div>
  );
};

export default ChatBot;
