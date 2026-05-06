// ─── Verhoeff checksum algorithm for Aadhaar ─────────────────────
const d = [
  [0,1,2,3,4,5,6,7,8,9],[1,2,3,4,0,6,7,8,9,5],[2,3,4,0,1,7,8,9,5,6],
  [3,4,0,1,2,8,9,5,6,7],[4,0,1,2,3,9,5,6,7,8],[5,9,8,7,6,0,4,3,2,1],
  [6,5,9,8,7,1,0,4,3,2],[7,6,5,9,8,2,1,0,4,3],[8,7,6,5,9,3,2,1,0,4],
  [9,8,7,6,5,4,3,2,1,0]
];
const p = [
  [0,1,2,3,4,5,6,7,8,9],[1,5,7,6,2,8,3,0,9,4],[5,8,0,3,7,9,6,1,4,2],
  [8,9,1,6,0,4,3,5,2,7],[9,4,5,3,1,2,6,8,7,0],[4,2,8,6,5,7,3,9,0,1],
  [2,7,9,3,8,0,6,4,1,5],[7,0,4,6,9,1,3,2,5,8]
];
const verhoeff = (num) => {
  let c = 0;
  const arr = num.split('').reverse().map(Number);
  for (let i = 0; i < arr.length; i++) c = d[c][p[i % 8][arr[i]]];
  return c === 0;
};

// ─── Symptom chips (match departmentMapper.js keywords) ──────────
// ─── 9 symptom chips matching PESU departments (no surgical — doctor-prescribed only) ──
export const SYMPTOM_CHIPS = [
  { key: 'fever',          label: { en: 'Fever / Cold',              hi: 'बुखार / सर्दी',           kn: 'ಜ್ವರ / ನೆಗಡಿ',            te: 'జ్వరం / జలుబు',          ta: 'காய்ச்சல் / சளி' } },
  { key: "women's health", label: { en: "Women's Health",            hi: 'महिला स्वास्थ्य',         kn: 'ಮಹಿಳೆಯರ ಆರೋಗ್ಯ',          te: 'మహిళా ఆరోగ్యం',          ta: 'பெண்கள் நலம்' } },
  { key: 'pregnancy',      label: { en: 'Pregnancy',                 hi: 'गर्भावस्था',              kn: 'ಗರ್ಭಾವಸ್ಥೆ',              te: 'గర్భధారణ',              ta: 'கர்ப்பம்' } },
  { key: 'child fever',    label: { en: 'Child Health / Fever',      hi: 'बच्चे का स्वास्थ्य',     kn: 'ಮಕ್ಕಳ ಆರೋಗ್ಯ / ಜ್ವರ',    te: 'పిల్లల ఆరోగ్యం',         ta: 'குழந்தை நலம்' } },
  { key: 'vaccination',    label: { en: 'Vaccination',               hi: 'टीकाकरण',                kn: 'ಲಸಿಕೆ',                   te: 'టీకాలు',                 ta: 'தடுப்பூசி' } },
  { key: 'toothache',      label: { en: 'Tooth / Dental',             hi: 'दांत की समस्या',          kn: 'ಹಲ್ಲು ನೋವು',              te: 'పళ్ళ సమస్య',              ta: 'பல் பிரச்சனை' } },
  { key: 'bone pain',      label: { en: 'Bone / Joint Pain',          hi: 'हड्डी / जोड़ों का दर्द', kn: 'ಮೂಳೆ / ಕೀಲು ನೋವು',      te: 'ఎముక / కీళ్ళ నొప్పి',     ta: 'எலும்பு / மூட்டு வலி' } },
  { key: 'back pain',      label: { en: 'Back Pain',                 hi: 'पीठ दर्द',               kn: 'ಬೆನ್ನು ನೋವು',              te: 'నడుము నొప్పి',            ta: 'முதுகு வலி' } },
  { key: 'mental health',  label: { en: 'Mental / Emotional Health',  hi: 'मानसिक स्वास्थ्य',       kn: 'ಮಾನಸಿಕ ಆರೋಗ್ಯ',           te: 'మానసిక ఆరోగ్యం',          ta: 'மன நலம்' } },
  { key: 'eye pain',       label: { en: 'Eye Problem',                hi: 'आंख की समस्या',          kn: 'ಕಣ್ಣಿನ ಸಮಸ್ಯೆ',            te: 'కంటి సమస్య',              ta: 'கண் பிரச்சனை' } },
  { key: 'ear pain',       label: { en: 'Ear / Nose / Throat',        hi: 'कान / नाक / गला',        kn: 'ಕಿವಿ / ಮೂಗು / ಗಂಟಲು',    te: 'చెవి / ముక్కు / గొంతు',   ta: 'காது / மூக்கு / தொண்டை' } },
  { key: 'skin rash',      label: { en: 'Skin Problem',               hi: 'त्वचा की समस्या',        kn: 'ಚರ್ಮದ ಸಮಸ್ಯೆ',             te: 'చర్మ సమస్య',               ta: 'தோல் பிரச்சனை' } },
  { key: 'hair loss',      label: { en: 'Hair Loss',                 hi: 'बालों का झड़ना',         kn: 'ಕೂದಲು ಉದುರುವಿಕೆ',         te: 'జుట్టు రాలడం',            ta: 'முடி உதிர்தல்' } },
  { key: 'wound',          label: { en: 'Wound / Abscess',           hi: 'घाव / फोड़ा',             kn: 'ಗಾಯ / ವ್ರಣ',              te: 'గాయం',                   ta: 'காயம்' } },
  { key: 'other',          label: { en: 'Other',                     hi: 'अन्य',                   kn: 'ಇತರೆ',                    te: 'ఇతరులు',                 ta: 'மற்றவர்கள்' } },
];

// ─── Validators ──────────────────────────────────────────────────
export const validators = {
  name: (v) => {
    if (!v || !v.trim()) return 'name_required';
    if (v.trim().length < 2) return 'name_short';
    // eslint-disable-next-line no-misleading-character-class
    if (!/^[a-zA-Z\u0900-\u097F\u0C00-\u0C7F\u0C80-\u0CFF\u0B80-\u0BFF\s.]+$/.test(v.trim())) return 'name_letters';
    return null;
  },
  dob: (v) => {
    if (!v) return 'dob_required';
    const date = new Date(v);
    if (isNaN(date.getTime())) return 'dob_invalid';
    if (date > new Date()) return 'dob_future';
    const age = Math.floor((new Date() - date) / (365.25 * 24 * 3600 * 1000));
    if (age > 120) return 'dob_old';
    return null;
  },
  mobile: (v) => {
    if (!v || !v.trim()) return 'mobile_required';
    const m = v.replace(/\s/g, '');
    if (!/^\d{10}$/.test(m)) return 'mobile_10digits';
    if (!/^[6-9]/.test(m)) return 'mobile_start';
    return null;
  },
  aadhaar: (v) => {
    if (!v || !v.trim()) return 'aadhaar_required';
    const a = v.replace(/\s|-/g, '');
    if (!/^\d{12}$/.test(a)) return 'aadhaar_12digits';
    if (/^(\d)\1{11}$/.test(a)) return 'aadhaar_pattern';
    if (!verhoeff(a)) return 'aadhaar_checksum';
    return null;
  },
  abha: (v) => {
    if (!v || !v.trim()) return 'abha_required';
    const a = v.replace(/-/g, '');
    if (!/^\d{14}$/.test(a)) return 'abha_format';
    return null;
  },
  uhid: (v) => {
    if (!v || !v.trim()) return 'uhid_required';
    if (!/^PES-[A-Z0-9]{6}$/i.test(v.trim())) return 'uhid_format';
    return null;
  },
  text_required: (v) => {
    if (!v || !v.trim()) return 'text_required_error';
    return null;
  },
  pincode: (v) => {
    if (!v || !v.trim()) return 'pincode_required';
    if (!/^\d{6}$/.test(v.trim())) return 'pincode_invalid';
    return null;
  },
  id_number: (v) => {
    if (!v || !v.trim()) return 'id_required';
    if (v.trim().length < 4) return 'id_invalid';
    return null;
  },
};

// ─── Chat messages per language (no emojis, colloquial tone) ─────
export const MSG = {
  greeting: {
    en: "Welcome to PES Hospital. I am your OPD registration assistant. I will help you get your visit token quickly.",
    hi: "PES अस्पताल में आपका स्वागत है। मैं आपका OPD सहायक हूँ। मैं आपको जल्दी से टोकन दिलाने में मदद करूँगा।",
    kn: "PES ಆಸ್ಪತ್ರೆಗೆ ಸ್ವಾಗತ. ನಾನು ನಿಮ್ಮ OPD ಸಹಾಯಕ. ನಿಮಗೆ ಬೇಗನೆ ಟೋಕನ್ ಕೊಡಿಸಲು ಸಹಾಯ ಮಾಡ್ತೇನೆ.",
    te: "PES ఆసుపత్రికి స్వాగతం. నేను మీ OPD సహాయకుడిని. మీకు త్వరగా టోకెన్ ఇప్పించడంలో సహాయం చేస్తాను.",
    ta: "PES மருத்துவமனைக்கு வரவேற்கிறோம். நான் உங்கள் OPD உதவியாளர். உங்களுக்கு விரைவாக டோக்கன் வாங்கிக் கொடுக்கிறேன்.",
  },
  visit_type_prompt: {
    en: "Is this your First Visit or a Follow-up Visit?",
    hi: "क्या यह आपकी पहली विजिट है या फॉलो-अप विजिट?",
    kn: "ಇದು ನಿಮ್ಮ ಮೊದಲ ಭೇಟಿಯಾ ಅಥವಾ ಫಾಲೋ-ಅಪ್ ಭೇಟಿಯಾ?",
    te: "ఇది మీ మొదటి విజిట్ లేదా ఫాలో-అప్ విజిట్?",
    ta: "இது உங்கள் முதல் வருகையா அல்லது தொடர் வருகையா?",
  },
  first_visit: {
    en: "First Visit",
    hi: "पहली विजिट",
    kn: "ಮೊದಲ ಭೇಟಿ",
    te: "మొదటి విజిట్",
    ta: "முதல் வருகை",
  },
  followup_visit: {
    en: "Follow-up Visit",
    hi: "फॉलो-अप विजिट",
    kn: "ಫಾಲೋ-ಅಪ್ ಭೇಟಿ",
    te: "ఫాలో-అప్ విజిట్",
    ta: "தொடர் வருகை",
  },
  // ─── UHID lookup (follow-up flow) ─────────────────────────
  ask_uhid: {
    en: "Please enter your Patient ID (UHID). It looks like PES-AB1234.",
    hi: "कृपया अपना मरीज ID (UHID) डालें। यह कुछ ऐसा होता है: PES-AB1234",
    kn: "ದಯವಿಟ್ಟು ನಿಮ್ಮ ರೋಗಿ ID (UHID) ಹಾಕಿ. ಇದು PES-AB1234 ತರಹ ಇರುತ್ತದೆ.",
    te: "దయచేసి మీ పేషెంట్ ID (UHID) ఇవ్వండి. ఇది PES-AB1234 లాగా ఉంటుంది.",
    ta: "உங்கள் நோயாளி ID (UHID) கொடுங்கள். இது PES-AB1234 மாதிரி இருக்கும்.",
  },
  uhid_required: {
    en: "UHID is required. Please enter a valid ID like PES-AB1234.",
    hi: "UHID ज़रूरी है। PES-AB1234 जैसा सही ID डालें।",
    kn: "UHID ಬೇಕು. PES-AB1234 ತರಹ ಸರಿಯಾದ ID ಹಾಕಿ.",
    te: "UHID కావాలి. PES-AB1234 లాంటి సరైన ID ఇవ్వండి.",
    ta: "UHID தேவை. PES-AB1234 போன்ற சரியான ID கொடுங்கள்.",
  },
  uhid_format: {
    en: "That doesn't look like a valid UHID. It should be like PES-AB1234.",
    hi: "यह सही UHID नहीं लग रहा। PES-AB1234 जैसा होना चाहिए।",
    kn: "ಇದು ಸರಿಯಾದ UHID ಅಲ್ಲ. PES-AB1234 ತರಹ ಇರಬೇಕು.",
    te: "ఇది సరైన UHID కాదు. PES-AB1234 లాగా ఉండాలి.",
    ta: "இது சரியான UHID இல்ல. PES-AB1234 மாதிரி இருக்கணும்.",
  },
  uhid_not_found: {
    en: "We could not find any patient with this UHID. Please check and try again, or start a First Visit instead.",
    hi: "इस UHID से कोई मरीज नहीं मिला। जांचकर फिर कोशिश करें, या नई विजिट शुरू करें।",
    kn: "ಈ UHID ಇರುವ ರೋಗಿ ಸಿಗಲಿಲ್ಲ. ಪರಿಶೀಲಿಸಿ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ ಅಥವಾ ಹೊಸ ಭೇಟಿ ಶುರು ಮಾಡಿ.",
    te: "ఈ UHID తో ఏ పేషెంట్ దొరకలేదు. చెక్ చేసి మళ్ళీ ట్రై చేయండి లేదా కొత్త విజిట్ మొదలు పెట్టండి.",
    ta: "இந்த UHID-ல எந்த நோயாளியும் கிடைக்கல. பார்த்து மறுபடி முயற்சிக்கவும் அல்லது புதிய வருகையாக ஆரம்பிக்கவும்.",
  },
  retry_uhid: {
    en: "Try UHID again",
    hi: "UHID फिर से डालें",
    kn: "UHID ಮತ್ತೆ ಹಾಕಿ",
    te: "UHID మళ్ళీ ఇవ్వండి",
    ta: "UHID மறுபடி கொடுங்கள்",
  },
  try_first_visit: {
    en: "Start First Visit instead",
    hi: "नई विजिट शुरू करें",
    kn: "ಹೊಸ ಭೇಟಿ ಶುರು ಮಾಡಿ",
    te: "కొత్త విజిట్ మొదలు పెట్టండి",
    ta: "புதிய வருகை ஆரம்பிக்கவும்",
  },
  // ─── Follow-up: patient found ─────────────────────────────
  welcome_back: {
    en: (name, dept, date) => `Welcome back, ${name}!\n\nYour last visit was to *${dept}* on ${date}.`,
    hi: (name, dept, date) => `फिर से स्वागत है, ${name}!\n\nआपकी पिछली विजिट *${dept}* में ${date} को हुई थी।`,
    kn: (name, dept, date) => `ಮತ್ತೆ ಸ್ವಾಗತ, ${name}!\n\nನಿಮ್ಮ ಕೊನೆಯ ಭೇಟಿ ${date} ರಂದು *${dept}* ಗೆ ಆಗಿತ್ತು.`,
    te: (name, dept, date) => `తిరిగి స్వాగతం, ${name}!\n\nమీ చివరి విజిట్ ${date} న *${dept}* కి జరిగింది.`,
    ta: (name, dept, date) => `மீண்டும் வருக, ${name}!\n\nஉங்கள் கடைசி வருகை ${date} அன்று *${dept}* க்கு நடந்தது.`,
  },
  // ─── Self or someone else (follow-up flow) ──────────────────
  ask_self_or_other: {
    en: "Is this visit for yourself or are you accompanying someone else?",
    hi: "क्या यह विजिट आपके लिए है या आप किसी और के साथ आए हैं?",
    kn: "ಈ ಭೇಟಿ ನಿಮಗಾಗಿಯೇ ಅಥವಾ ಬೇರೊಬ್ಬರಿಗಾಗಿಯೇ?",
    te: "ఈ విజిట్ మీ కోసమా లేదా మీరు మరొకరికి తోడుగా వచ్చారా?",
    ta: "இந்த வருகை உங்களுக்காகவா அல்லது வேற ஒருத்தருக்காகவா?",
  },
  self_btn: {
    en: "For Myself",
    hi: "मेरे लिए",
    kn: "ನನಗಾಗಿ",
    te: "నా కోసం",
    ta: "என்னுக்காக",
  },
  other_btn: {
    en: "For Someone Else",
    hi: "किसी और के लिए",
    kn: "ಬೇರೊಬ್ಬರಿಗಾಗಿ",
    te: "మరొకరి కోసం",
    ta: "வேற ஒருத்தருக்காக",
  },
  // ─── Obstetrics vs Gynaecology triage ────────────────────────
  ask_pregnancy: {
    en: "Is this visit related to pregnancy checkups?",
    hi: "क्या यह विजिट गर्भावस्था जांच से संबंधित है?",
    kn: "ಈ ಭೇಟಿ ಗರ್ಭಾವಸ್ಥೆಯ ತಪಾಸಣೆಗಾಗಿಯೇ?",
    te: "ఈ విజిట్ గర్భధారణ చెకప్‌కు సంబంధించినదా?",
    ta: "இந்த வருகை கர்ப்பகால பரிசோதனைக்காகவா?",
  },
  yes_pregnancy: {
    en: "Yes, Pregnancy Related",
    hi: "हाँ, गर्भावस्था से संबंधित",
    kn: "ಹೌದು, ಗರ್ಭಾವಸ್ಥೆಗೆ ಸಂಬಂಧಿತ",
    te: "అవును, గర్భధారణకు సంబంధించింది",
    ta: "ஆமா, கர்ப்பம் தொடர்பானது",
  },
  no_pregnancy: {
    en: "No, Other Women's Health Issue",
    hi: "नहीं, अन्य महिला स्वास्थ्य समस्या",
    kn: "ಇಲ್ಲ, ಇತರ ಮಹಿಳಾ ಆರೋಗ್ಯ ಸಮಸ್ಯೆ",
    te: "కాదు, ఇతర మహిళా ఆరోగ్య సమస్య",
    ta: "இல்ல, வேற பெண்கள் நல பிரச்சனை",
  },
  same_dept_or_new: {
    en: "Are you visiting for the same department or do you have a new health concern today?",
    hi: "क्या आप उसी विभाग के लिए आए हैं या आज कोई नई तकलीफ है?",
    kn: "ನೀವು ಅದೇ ವಿಭಾಗಕ್ಕೆ ಬಂದಿದ್ದೀರಾ ಅಥವಾ ಇಂದು ಹೊಸ ತೊಂದರೆ ಇದೆಯಾ?",
    te: "మీరు అదే డిపార్ట్‌మెంట్‌కి వచ్చారా లేదా ఈరోజు కొత్త సమస్య ఉందా?",
    ta: "நீங்கள் அதே பிரிவுக்கு வந்தீர்களா அல்லது இன்று புதிய உடல் பிரச்சனை உள்ளதா?",
  },
  same_dept_btn: {
    en: "Same Department",
    hi: "वही विभाग",
    kn: "ಅದೇ ವಿಭಾಗ",
    te: "అదే డిపార్ట్‌మెంట్",
    ta: "அதே பிரிவு",
  },
  new_concern_btn: {
    en: "New Health Concern",
    hi: "नई स्वास्थ्य समस्या",
    kn: "ಹೊಸ ಆರೋಗ್ಯ ಸಮಸ್ಯೆ",
    te: "కొత్త ఆరోగ్య సమస్య",
    ta: "புதிய உடல் பிரச்சனை",
  },
  // ─── First visit: collect details ─────────────────────────
  ask_name: {
    en: "Let us get started. What is your full name?",
    hi: "चलिए शुरू करते हैं। आपका पूरा नाम बताइए।",
    kn: "ಶುರು ಮಾಡೋಣ. ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರು ಹೇಳಿ.",
    te: "మొదలు పెడదాం. మీ పూర్తి పేరు చెప్పండి.",
    ta: "ஆரம்பிக்கலாம். உங்கள் முழு பெயர் சொல்லுங்கள்.",
  },
  name_required: {
    en: "Please tell me your name to continue.",
    hi: "आगे बढ़ने के लिए अपना नाम बताएं।",
    kn: "ಮುಂದುವರಿಸಲು ನಿಮ್ಮ ಹೆಸರು ಹೇಳಿ.",
    te: "కొనసాగించడానికి మీ పేరు చెప్పండి.",
    ta: "தொடர உங்கள் பெயர் சொல்லுங்கள்.",
  },
  name_short: {
    en: "Name must be at least 2 characters. Please try again.",
    hi: "नाम कम से कम 2 अक्षर का होना चाहिए। फिर से डालें।",
    kn: "ಹೆಸರು ಕನಿಷ್ಠ 2 ಅಕ್ಷರ ಇರಬೇಕು. ಮತ್ತೆ ಹಾಕಿ.",
    te: "పేరు కనీసం 2 అక్షరాలు ఉండాలి. మళ్ళీ ఇవ్వండి.",
    ta: "பெயர் குறைந்தது 2 எழுத்து இருக்கணும். மறுபடி கொடுங்கள்.",
  },
  name_letters: {
    en: "Name should only contain letters. Please try again.",
    hi: "नाम में सिर्फ अक्षर होने चाहिए। फिर से डालें।",
    kn: "ಹೆಸರಿನಲ್ಲಿ ಅಕ್ಷರಗಳು ಮಾತ್ರ ಇರಬೇಕು. ಮತ್ತೆ ಹಾಕಿ.",
    te: "పేరులో అక్షరాలు మాత్రమే ఉండాలి. మళ్ళీ ఇవ్వండి.",
    ta: "பெயரில் எழுத்துகள் மட்டும் இருக்கணும். மறுபடி கொடுங்கள்.",
  },
  ask_dob: {
    en: (name) => `Thank you, ${name}. What is your date of birth?`,
    hi: (name) => `शुक्रिया, ${name}। आपकी जन्म तिथि क्या है?`,
    kn: (name) => `ಧನ್ಯವಾದ, ${name}. ನಿಮ್ಮ ಹುಟ್ಟಿದ ದಿನಾಂಕ ಏನು?`,
    te: (name) => `ధన్యవాదాలు, ${name}. మీ పుట్టిన తేదీ ఏమిటి?`,
    ta: (name) => `நன்றி, ${name}. உங்கள் பிறந்த தேதி என்ன?`,
  },
  dob_required: { en: "Please enter your date of birth.", hi: "कृपया जन्म तिथि डालें।", kn: "ದಯವಿಟ್ಟು ಹುಟ್ಟಿದ ದಿನಾಂಕ ಹಾಕಿ.", te: "దయచేసి పుట్టిన తేదీ ఇవ్వండి.", ta: "பிறந்த தேதி கொடுங்கள்." },
  dob_invalid: { en: "That does not look like a valid date. Please try again.", hi: "यह सही तारीख नहीं लग रही। फिर से डालें।", kn: "ಇದು ಸರಿಯಾದ ದಿನಾಂಕ ಅಲ್ಲ. ಮತ್ತೆ ಹಾಕಿ.", te: "ఇది సరైన తేదీ కాదు. మళ్ళీ ఇవ్వండి.", ta: "இது சரியான தேதி இல்ல. மறுபடி கொடுங்கள்." },
  dob_future: { en: "Date of birth cannot be in the future.", hi: "जन्म तिथि भविष्य में नहीं हो सकती।", kn: "ಹುಟ್ಟಿದ ದಿನಾಂಕ ಭವಿಷ್ಯದಲ್ಲಿ ಇರಲು ಸಾಧ್ಯವಿಲ್ಲ.", te: "పుట్టిన తేదీ భవిష్యత్తులో ఉండదు.", ta: "பிறந்த தேதி எதிர்காலத்தில் இருக்க முடியாது." },
  dob_old: { en: "Please enter a valid date of birth.", hi: "सही जन्म तिथि डालें।", kn: "ಸರಿಯಾದ ಹುಟ್ಟಿದ ದಿನಾಂಕ ಹಾಕಿ.", te: "సరైన పుట్టిన తేదీ ఇవ్వండి.", ta: "சரியான பிறந்த தேதி கொடுங்கள்." },
  ask_gender: {
    en: "What is your gender?",
    hi: "आपका लिंग क्या है?",
    kn: "ನಿಮ್ಮ ಲಿಂಗ ಏನು?",
    te: "మీ లింగం ఏమిటి?",
    ta: "உங்கள் பாலினம் என்ன?",
  },
  male:   { en: "Male",   hi: "पुरुष", kn: "ಪುರುಷ",   te: "పురుషుడు", ta: "ஆண்" },
  female: { en: "Female", hi: "महिला", kn: "ಮಹಿಳೆ",   te: "స్త్రీ",    ta: "பெண்" },
  other:  { en: "Other",  hi: "अन्य",  kn: "ಇತರೆ",    te: "ఇతరులు",   ta: "மற்றவர்கள்" },
  ask_mobile: {
    en: "What is your 10-digit mobile number?",
    hi: "आपका 10 अंकों का मोबाइल नंबर क्या है?",
    kn: "ನಿಮ್ಮ 10 ಅಂಕೆಯ ಮೊಬೈಲ್ ನಂಬರ್ ಏನು?",
    te: "మీ 10 అంకెల మొబైల్ నంబర్ ఏమిటి?",
    ta: "உங்கள் 10 இலக்க மொபைல் நம்பர் என்ன?",
  },
  mobile_required: { en: "Mobile number is required.",                            hi: "मोबाइल नंबर ज़रूरी है।",                           kn: "ಮೊಬೈಲ್ ನಂಬರ್ ಬೇಕು.",                             te: "మొబైల్ నంబర్ కావాలి.",                             ta: "மொபைல் நம்பர் தேவை." },
  mobile_10digits: { en: "Mobile must be exactly 10 digits. Please try again.",   hi: "मोबाइल ठीक 10 अंकों का होना चाहिए। फिर से डालें।", kn: "ಮೊಬೈಲ್ ಸರಿಯಾಗಿ 10 ಅಂಕೆ ಇರಬೇಕು. ಮತ್ತೆ ಹಾಕಿ.", te: "మొబైల్ సరిగ్గా 10 అంకెలు ఉండాలి. మళ్ళీ ఇవ్వండి.", ta: "மொபைல் சரியா 10 இலக்கம் இருக்கணும். மறுபடி கொடுங்கள்." },
  mobile_start: { en: "Mobile must start with 6, 7, 8, or 9.",                    hi: "मोबाइल 6, 7, 8 या 9 से शुरू होना चाहिए।",          kn: "ಮೊಬೈಲ್ 6, 7, 8 ಅಥವಾ 9 ರಿಂದ ಶುರುವಾಗಬೇಕು.",     te: "మొబైల్ 6, 7, 8 లేదా 9 తో మొదలు కావాలి.",         ta: "மொபைல் 6, 7, 8 அல்லது 9 ல ஆரம்பிக்கணும்." },
  // ─── Aadhaar ──────────────────────────────────────────────
  ask_aadhaar: {
    en: "Please enter your 12-digit Aadhaar number. Your data is kept private and secure.",
    hi: "कृपया अपना 12 अंकों का आधार नंबर डालें। आपका डेटा सुरक्षित रखा जाएगा।",
    kn: "ದಯವಿಟ್ಟು ನಿಮ್ಮ 12 ಅಂಕೆಯ ಆಧಾರ್ ನಂಬರ್ ಹಾಕಿ. ನಿಮ್ಮ ಡೇಟಾ ಸುರಕ್ಷಿತವಾಗಿ ಇಡಲಾಗುತ್ತದೆ.",
    te: "దయచేసి మీ 12 అంకెల ఆధార్ నంబర్ ఇవ్వండి. మీ డేటా సురక్షితంగా ఉంచబడుతుంది.",
    ta: "உங்கள் 12 இலக்க ஆதார் நம்பர் கொடுங்கள். உங்கள் தகவல் பாதுகாப்பாக வைக்கப்படும்.",
  },
  aadhaar_required: { en: "Aadhaar number is required.",                                          hi: "आधार नंबर ज़रूरी है।",                                       kn: "ಆಧಾರ್ ನಂಬರ್ ಬೇಕು.",                                         te: "ఆధార్ నంబర్ కావాలి.",                                       ta: "ஆதார் நம்பர் தேவை." },
  aadhaar_12digits: { en: "Aadhaar must be exactly 12 digits. Please try again.",                  hi: "आधार ठीक 12 अंकों का होना चाहिए। फिर से डालें।",             kn: "ಆಧಾರ್ ಸರಿಯಾಗಿ 12 ಅಂಕೆ ಇರಬೇಕು. ಮತ್ತೆ ಹಾಕಿ.",               te: "ఆధార్ సరిగ్గా 12 అంకెలు ఉండాలి. మళ్ళీ ఇవ్వండి.",            ta: "ஆதார் சரியா 12 இலக்கம் இருக்கணும். மறுபடி கொடுங்கள்." },
  aadhaar_pattern: { en: "Invalid Aadhaar number pattern. Please enter the correct number.",       hi: "आधार नंबर का पैटर्न गलत है। सही नंबर डालें।",                kn: "ಆಧಾರ್ ನಂಬರ್ ಮಾದರಿ ತಪ್ಪಾಗಿದೆ. ಸರಿಯಾದ ನಂಬರ್ ಹಾಕಿ.",       te: "ఆధార్ నంబర్ ప్యాటర్న్ తప్పు. సరైన నంబర్ ఇవ్వండి.",         ta: "ஆதார் நம்பர் வடிவம் தவறு. சரியான நம்பர் கொடுங்கள்." },
  aadhaar_checksum: { en: "This Aadhaar number is invalid. Please double-check and try again.",    hi: "यह आधार नंबर गलत है। जांचकर फिर से डालें।",                  kn: "ಈ ಆಧಾರ್ ನಂಬರ್ ತಪ್ಪಾಗಿದೆ. ಪರಿಶೀಲಿಸಿ ಮತ್ತೆ ಹಾಕಿ.",          te: "ఈ ఆధార్ నంబర్ తప్పు. చెక్ చేసి మళ్ళీ ఇవ్వండి.",            ta: "இந்த ஆதார் நம்பர் தவறு. பார்த்து மறுபடி கொடுங்கள்." },
  
  // ─── Alternative ID ───────────────────────────────────────
  ask_has_aadhaar: { en: "Do you have an Aadhaar card?", hi: "क्या आपके पास आधार कार्ड है?", kn: "ನಿಮ್ಮ ಬಳಿ ಆಧಾರ್ ಕಾರ್ಡ್ ಇದೆಯೇ?", te: "మీకు ఆధార్ కార్డ్ ఉందా?", ta: "உங்களிடம் ஆதார் அட்டை உள்ளதா?" },
  yes_aadhaar: { en: "Yes, I have Aadhaar", hi: "हाँ, आधार है", kn: "ಹೌದು, ಆಧಾರ್ ಇದೆ", te: "అవును, ఆధార్ ఉంది", ta: "ஆம், ஆதார் உள்ளது" },
  no_aadhaar: { en: "No, I don't have it", hi: "नहीं, आधार नहीं है", kn: "ಇಲ್ಲ, ಆಧಾರ್ ಇಲ್ಲ", te: "లేదు, ఆధార్ లేదు", ta: "இல்லை, ஆதார் இல்லை" },
  ask_alt_id_type: { en: "Please select an alternative ID type.", hi: "कृपया एक वैकल्पिक ID प्रकार चुनें।", kn: "ದಯವಿಟ್ಟು ಪರ್ಯಾಯ ID ಆಯ್ಕೆಮಾಡಿ.", te: "దయచేసి ప్రత్యామ్నాయ ID ని ఎంచుకోండి.", ta: "மாற்று ID வகையைத் தேர்ந்தெடுக்கவும்." },
  dl_btn: { en: "Driving License", hi: "ड्राइविंग लाइसेंस", kn: "ಡ್ರೈವಿಂಗ್ ಲೈಸೆನ್ಸ್", te: "డ్రైవింగ్ లైసెన్స్", ta: "ஓட்டுநர் உரிமம்" },
  voter_btn: { en: "Voter ID", hi: "वोटर आईडी", kn: "ವೋಟರ್ ಐಡಿ", te: "ఓటర్ ID", ta: "வாக்காளர் அடையாள அட்டை" },
  ask_id_number: { en: (type) => `Please enter your ${type} number.`, hi: (type) => `कृपया अपना ${type} नंबर डालें।`, kn: (type) => `ನಿಮ್ಮ ${type} ನಂಬರ್ ಹಾಕಿ.`, te: (type) => `దయచేసి మీ ${type} నంబర్ నమోదు చేయండి.`, ta: (type) => `உங்கள் ${type} எண்ணை உள்ளிடவும்.` },
  id_required: { en: "ID number is required.", hi: "ID नंबर ज़रूरी है।", kn: "ID ನಂಬರ್ ಬೇಕು.", te: "ID నంబర్ కావాలి.", ta: "ID எண் தேவை." },
  id_invalid: { en: "ID number looks invalid. Please try again.", hi: "ID नंबर अमान्य लग रहा है। फिर से प्रयास करें।", kn: "ID ನಂಬರ್ ಅಮಾನ್ಯವಾಗಿದೆ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.", te: "ID నంబర్ చెల్లనిదిగా ఉంది. మళ్లీ ప్రయత్నించండి.", ta: "ID எண் தவறானது. மீண்டும் முயற்சிக்கவும்." },
  // ─── ABHA (mandatory) ─────────────────────────────────────
  ask_abha_choice: {
    en: "Do you have an ABHA (Ayushman Bharat Health Account) number?",
    hi: "क्या आपके पास ABHA (आयुष्मान भारत हेल्थ अकाउंट) नंबर है?",
    kn: "ನಿಮ್ಮ ಬಳಿ ABHA (ಆಯುಷ್ಮಾನ್ ಭಾರತ ಹೆಲ್ತ್ ಅಕೌಂಟ್) ನಂಬರ್ ಇದೆಯಾ?",
    te: "మీ దగ్గర ABHA (ఆయుష్మాన్ భారత్ హెల్త్ అకౌంట్) నంబర్ ఉందా?",
    ta: "உங்ககிட்ட ABHA (ஆயுஷ்மான் பாரத் ஹெல்த் அக்கவுண்ட்) நம்பர் இருக்கா?",
  },
  yes_abha: {
    en: "Yes, I have it",
    hi: "हाँ, मेरे पास है",
    kn: "ಹೌದು, ನನ್ನ ಬಳಿ ಇದೆ",
    te: "అవును, నా దగ్గర ఉంది",
    ta: "ஆமா, என்கிட்ட இருக்கு",
  },
  no_abha: {
    en: "No, I do not have one",
    hi: "नहीं, मेरे पास नहीं है",
    kn: "ಇಲ್ಲ, ನನ್ನ ಬಳಿ ಇಲ್ಲ",
    te: "లేదు, నా దగ్గర లేదు",
    ta: "இல்ல, என்கிட்ட இல்ல",
  },
  enter_abha: {
    en: "Please enter your 14-digit ABHA number (e.g. 12-3456-7890-1234).",
    hi: "कृपया अपना 14 अंकों का ABHA नंबर डालें (जैसे 12-3456-7890-1234)।",
    kn: "ದಯವಿಟ್ಟು ನಿಮ್ಮ 14 ಅಂಕೆಯ ABHA ನಂಬರ್ ಹಾಕಿ (ಉದಾ: 12-3456-7890-1234).",
    te: "దయచేసి మీ 14 అంకెల ABHA నంబర్ ఇవ్వండి (ఉదా: 12-3456-7890-1234).",
    ta: "உங்கள் 14 இலக்க ABHA நம்பர் கொடுங்கள் (எ.கா: 12-3456-7890-1234).",
  },
  abha_required: { en: "ABHA number is required.",  hi: "ABHA नंबर ज़रूरी है।",  kn: "ABHA ನಂಬರ್ ಬೇಕು.",   te: "ABHA నంబర్ కావాలి.",   ta: "ABHA நம்பர் தேவை." },
  abha_format: { en: "ABHA must be a 14-digit number. Please try again.",  hi: "ABHA 14 अंकों का होना चाहिए। फिर से डालें।",  kn: "ABHA 14 ಅಂಕೆ ಇರಬೇಕು. ಮತ್ತೆ ಹಾಕಿ.",  te: "ABHA 14 అంకెలు ఉండాలి. మళ్ళీ ఇవ్వండి.",  ta: "ABHA 14 இலக்கம் இருக்கணும். மறுபடி கொடுங்கள்." },
  abha_mandatory_notice: {
    en: "ABHA number is mandatory for OPD registration at PES Hospital.\n\nPlease visit the ABHA generation counter (Counter 3, near the entrance) to get your ABHA number. It takes about 5 minutes.\n\nYou can also generate it online at abha.abdm.gov.in using your Aadhaar or mobile number.",
    hi: "PES अस्पताल में OPD रजिस्ट्रेशन के लिए ABHA नंबर ज़रूरी है।\n\nABHA बनवाने के लिए काउंटर 3 (प्रवेश द्वार के पास) पर जाएं। इसमें लगभग 5 मिनट लगते हैं।\n\nआप abha.abdm.gov.in पर आधार या मोबाइल से ऑनलाइन भी बनवा सकते हैं।",
    kn: "PES ಆಸ್ಪತ್ರೆಯಲ್ಲಿ OPD ನೋಂದಣಿಗೆ ABHA ನಂಬರ್ ಕಡ್ಡಾಯ.\n\nABHA ಮಾಡಿಸಲು ಕೌಂಟರ್ 3 (ಪ್ರವೇಶ ದ್ವಾರದ ಬಳಿ) ಗೆ ಹೋಗಿ. ಸುಮಾರು 5 ನಿಮಿಷ ಬೇಕು.\n\nನೀವು abha.abdm.gov.in ನಲ್ಲಿ ಆಧಾರ್ ಅಥವಾ ಮೊಬೈಲ್ ಮೂಲಕ ಆನ್‌ಲೈನ್ ಮಾಡಬಹುದು.",
    te: "PES ఆసుపత్రిలో OPD రిజిస్ట్రేషన్‌కి ABHA నంబర్ తప్పనిసరి.\n\nABHA పొందడానికి కౌంటర్ 3 (ఎంట్రన్స్ దగ్గర) కి వెళ్ళండి. 5 నిమిషాలు పడుతుంది.\n\nమీరు abha.abdm.gov.in లో ఆధార్ లేదా మొబైల్ తో ఆన్‌లైన్ లో కూడా చేయవచ్చు.",
    ta: "PES மருத்துவமனையில OPD பதிவுக்கு ABHA நம்பர் கட்டாயம்.\n\nABHA வாங்க கவுண்டர் 3 (நுழைவாயில் அருகில்) க்கு போங்கள். 5 நிமிஷம் ஆகும்.\n\nநீங்க abha.abdm.gov.in ல ஆதார் அல்லது மொபைல் மூலம் ஆன்லைன்ல கூட செய்யலாம்.",
  },
  have_abha_now: {
    en: "I have my ABHA number now",
    hi: "अब मेरे पास ABHA नंबर है",
    kn: "ಈಗ ನನ್ನ ಬಳಿ ABHA ನಂಬರ್ ಇದೆ",
    te: "ఇప్పుడు నా దగ్గర ABHA నంబర్ ఉంది",
    ta: "இப்போ என்கிட்ட ABHA நம்பர் இருக்கு",
  },
  generate_abha_link: {
    en: "Generate ABHA Online",
    hi: "ABHA ऑनलाइन बनाएं",
    kn: "ABHA ಆನ್‌ಲೈನ್ ಮಾಡಿ",
    te: "ABHA ఆన్‌లైన్ చేయండి",
    ta: "ABHA ஆன்லைன்ல செய்யுங்கள்",
  },
  abha_after_generate: {
    en: "Once you have your ABHA number, come back here and continue.",
    hi: "ABHA नंबर मिलने के बाद वापस आएं और आगे बढ़ें।",
    kn: "ABHA ನಂಬರ್ ಸಿಕ್ಕ ಮೇಲೆ ಇಲ್ಲಿ ವಾಪಸ್ ಬಂದು ಮುಂದುವರಿಸಿ.",
    te: "ABHA నంబర్ వచ్చాక ఇక్కడ మళ్ళీ వచ్చి కొనసాగించండి.",
    ta: "ABHA நம்பர் கிடைச்சதும் இங்க வந்து தொடருங்கள்.",
  },
  // ─── Symptoms ─────────────────────────────────────────────
  ask_symptoms: {
    en: "What health issue are you experiencing today? Select all that apply.",
    hi: "आज आपको क्या तकलीफ हो रही है? जो-जो लागू हो सब चुनें।",
    kn: "ಇಂದು ನಿಮಗೆ ಏನು ತೊಂದರೆ ಇದೆ? ಅನ್ವಯಿಸುವ ಎಲ್ಲಾ ಆಯ್ಕೆ ಮಾಡಿ.",
    te: "ఈరోజు మీకు ఏ సమస్య ఉంది? వర్తించేవన్నీ ఎంచుకోండి.",
    ta: "இன்று உங்களுக்கு என்ன பிரச்சனை? பொருந்தும் எல்லாத்தையும் தேர்வு செய்யுங்கள்.",
  },
  ask_followup_symptoms: {
    en: "We will direct you to the same department. Do you have any other symptoms today? Select all that apply.",
    hi: "हम आपको उसी विभाग में भेजेंगे। क्या आज कोई और तकलीफ भी है? जो लागू हो चुनें।",
    kn: "ನಿಮ್ಮನ್ನು ಅದೇ ವಿಭಾಗಕ್ಕೆ ಕಳಿಸುತ್ತೇವೆ. ಇಂದು ಬೇರೆ ಯಾವ ತೊಂದರೆ ಇದೆ? ಆಯ್ಕೆ ಮಾಡಿ.",
    te: "మిమ్మల్ని అదే డిపార్ట్‌మెంట్‌కి పంపిస్తాం. ఈరోజు మరేదైనా సమస్య ఉందా? ఎంచుకోండి.",
    ta: "உங்களை அதே பிரிவுக்கு அனுப்புவோம். இன்று வேற ஏதாவது பிரச்சனை இருக்கா? தேர்வு செய்யுங்கள்.",
  },
  symptoms_required: {
    en: "Please select at least one symptom to continue.",
    hi: "आगे बढ़ने के लिए कम से कम एक तकलीफ चुनें।",
    kn: "ಮುಂದುವರಿಸಲು ಕನಿಷ್ಠ ಒಂದು ಸಮಸ್ಯೆ ಆಯ್ಕೆ ಮಾಡಿ.",
    te: "కొనసాగించడానికి కనీసం ఒక సమస్య ఎంచుకోండి.",
    ta: "தொடர குறைந்தது ஒரு பிரச்சனை தேர்வு செய்யுங்கள்.",
  },
  confirm_symptoms: {
    en: "Confirm",
    hi: "कन्फर्म करें",
    kn: "ದೃಢೀಕರಿಸಿ",
    te: "నిర్ధారించండి",
    ta: "உறுதிசெய்",
  },
  ask_custom_symptom: {
    en: "Please briefly type your symptoms or health issue.",
    hi: "कृपया संक्षेप में अपनी तकलीफ लिखें।",
    kn: "ದಯವಿಟ್ಟು ನಿಮ್ಮ ತೊಂದರೆಯನ್ನು ಸಂಕ್ಷಿಪ್ತವಾಗಿ ಬರೆಯಿರಿ.",
    te: "దయచేసి మీ సమస్యను క్లుప్తంగా టైప్ చేయండి.",
    ta: "தயவுசெய்து உங்கள் பிரச்சனையை சுருக்கமாக தட்டச்சு செய்க."
  },
  custom_symptom_required: {
    en: "Please type something so we can guide you.",
    hi: "कृपया कुछ लिखें ताकि हम आपका मार्गदर्शन कर सकें।",
    kn: "ದಯವಿಟ್ಟು ಏನನ್ನಾದರೂ ಬರೆಯಿರಿ, ಆಗ ನಾವು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಬಹುದು.",
    te: "దయచేసి ఏదైనా టైప్ చేయండి, తద్వారా మేము మీకు మార్గనిర్దేశం చేయగలము.",
    ta: "தயவுசெய்து எதையாவது தட்டச்சு செய்யவும், அதனால் நாங்கள் உங்களை வழிகாட்ட முடியும்."
  },
  
  // ─── Addresses & Emergency ─────────────────────────────────
  ask_perm_address_same: { en: "Is your permanent address the same as on your ID card?", hi: "क्या आपका स्थायी पता आपके ID कार्ड जैसा ही है?", kn: "ನಿಮ್ಮ ಶಾಶ್ವತ ವಿಳಾಸ ನಿಮ್ಮ ID ಕಾರ್ಡ್‌ನಲ್ಲಿರುವಂತೆಯೇ ಇದೆಯೇ?", te: "మీ శాశ్వత చిరునామా మీ ID కార్డ్‌లో ఉన్నట్లే ఉందా?", ta: "உங்கள் நிரந்தர முகவரி உங்கள் ஐடி கார்டில் உள்ளதைப் போலவே உள்ளதா?" },
  yes_same: { en: "Yes, it is the same", hi: "हाँ, वही है", kn: "ಹೌದು, ಅದೇ", te: "అవును, అదే", ta: "ஆம், அதே தான்" },
  no_different: { en: "No, I will enter it", hi: "नहीं, मैं डालूंगा", kn: "ಇಲ್ಲ, ನಾನು ನಮೂದಿಸುತ್ತೇನೆ", te: "లేదు, నేను నమోదు చేస్తాను", ta: "இல்லை, நான் உள்ளிடுகிறேன்" },
  ask_home_no: { en: "What is your House/Flat number?", hi: "आपका मकान/फ्लैट नंबर क्या है?", kn: "ನಿಮ್ಮ ಮನೆ/ಫ್ಲಾಟ್ ನಂಬರ್ ಏನು?", te: "మీ ఇంటి/ఫ్లాట్ నంబర్ ఏమిటి?", ta: "உங்கள் வீடு/பிளாட் எண் என்ன?" },
  ask_street: { en: "What is your Street name/number?", hi: "आपके गली का नाम/नंबर क्या है?", kn: "ನಿಮ್ಮ ರಸ್ತೆಯ ಹೆಸರು/ನಂಬರ್ ಏನು?", te: "మీ వీధి పేరు/నంబర్ ఏమిటి?", ta: "உங்கள் தெரு பெயர்/எண் என்ன?" },
  ask_locality: { en: "What is your Area/Locality?", hi: "आपका इलाका क्या है?", kn: "ನಿಮ್ಮ ಪ್ರದೇಶ ಯಾವುದು?", te: "మీ ప్రాంతం ఏమిటి?", ta: "உங்கள் பகுதி என்ன?" },
  ask_pincode: { en: "What is your 6-digit Pincode?", hi: "आपका 6 अंकों का पिनकोड क्या है?", kn: "ನಿಮ್ಮ 6 ಅಂಕಿಯ ಪಿನ್‌ಕೋಡ್ ಏನು?", te: "మీ 6 అంకెల పిన్‌కోడ్ ఏమిటి?", ta: "உங்கள் 6 இலக்க பின்கோடு என்ன?" },
  ask_present_address_same: { en: "Is your present address the same as your permanent address?", hi: "क्या आपका वर्तमान पता आपके स्थायी पते जैसा ही है?", kn: "ನಿಮ್ಮ ಪ್ರಸ್ತುತ ವಿಳಾಸ ನಿಮ್ಮ ಶಾಶ್ವತ ವಿಳಾಸದಂತೆಯೇ ಇದೆಯೇ?", te: "మీ ప్రస్తుత చిరునామా మీ శాశ్వత చిరునామా వలె ఉందా?", ta: "உங்கள் தற்போதைய முகவரி உங்கள் நிரந்தர முகவரியைப் போலவே உள்ளதா?" },
  
  text_required_error: { en: "This field is required. Please type your answer.", hi: "यह फ़ील्ड आवश्यक है।", kn: "ಈ ಕ್ಷೇತ್ರ ಅಗತ್ಯವಿದೆ.", te: "ఈ ఫీల్డ్ అవసరం.", ta: "இந்த புலம் தேவை." },
  pincode_required: { en: "Pincode is required.", hi: "पिनकोड आवश्यक है।", kn: "ಪಿನ್‌ಕೋಡ್ ಅಗತ್ಯವಿದೆ.", te: "పిన్‌కోడ్ అవసరం.", ta: "பின்கோடு தேவை." },
  pincode_invalid: { en: "Pincode must be exactly 6 digits.", hi: "पिनकोड 6 अंकों का होना चाहिए।", kn: "ಪಿನ್‌ಕೋಡ್ 6 ಅಂಕಿಗಳಾಗಿರಬೇಕು.", te: "పిన్‌కోడ్ 6 అంకెలు ఉండాలి.", ta: "பின்கோடு 6 இலக்கங்களாக இருக்க வேண்டும்." },
  
  ask_emergency_name: { en: "Let's collect an emergency contact. What is their name?", hi: "आइए एक आपातकालीन संपर्क लें। उनका नाम क्या है?", kn: "ತುರ್ತು ಸಂಪರ್ಕವನ್ನು ಪಡೆಯೋಣ. ಅವರ ಹೆಸರೇನು?", te: "అత్యవసర పరిచయాన్ని తీసుకుందాం. వారి పేరు ఏమిటి?", ta: "அவசரகால தொடர்பை எடுப்போம். அவர்களின் பெயர் என்ன?" },
  ask_emergency_relation: { en: "What is their relationship to you?", hi: "उनका आपसे क्या रिश्ता है?", kn: "ಅವರು ನಿಮಗೆ ಏನಾಗಬೇಕು?", te: "వారితో మీకు ఉన్న సంబంధం ఏమిటి?", ta: "அவர்களுக்கும் உங்களுக்குமான உறவு என்ன?" },
  relation_parent: { en: "Parent", hi: "माता-पिता", kn: "ಪೋಷಕರು", te: "తల్లిదండ్రులు", ta: "பெற்றோர்" },
  relation_spouse: { en: "Spouse", hi: "जीवनसाथी", kn: "ಜೀವನಸಂಗಾತಿ", te: "జీవిత భాగస్వామి", ta: "வாழ்க்கை துணை" },
  relation_child: { en: "Child", hi: "बच्चा", kn: "ಮಗು", te: "పిల్లవాడు", ta: "குழந்தை" },
  relation_sibling: { en: "Sibling", hi: "भाई-बहन", kn: "ಸಹೋದರ/ಸಹೋದರಿ", te: "తోబుట్టువులు", ta: "உடன்பிறப்பு" },
  relation_other: { en: "Other", hi: "अन्य", kn: "ಇತರೆ", te: "ఇతరులు", ta: "மற்றவர்கள்" },
  ask_emergency_other_relation: { en: "Please type the relationship.", hi: "कृपया रिश्ता लिखें।", kn: "ದಯವಿಟ್ಟು ಸಂಬಂಧವನ್ನು ಬರೆಯಿರಿ.", te: "దయచేసి సంబంధాన్ని టైప్ చేయండి.", ta: "தயவுசெய்து உறவைத் தட்டச்சு செய்க." },
  ask_emergency_phone: { en: "What is their 10-digit mobile number?", hi: "उनका 10 अंकों का मोबाइल नंबर क्या है?", kn: "ಅವರ 10 ಅಂಕೆಯ ಮೊಬೈಲ್ ನಂಬರ್ ಏನು?", te: "వారి 10 అంకెల మొబైల్ నంబర్ ఏమిటి?", ta: "அவர்களின் 10 இலக்க மொபைல் எண் என்ன?" },
  // ─── Review & Confirmation ────────────────────────────────
  review_details: {
    en: (name, age, symptoms) => `*Review your details:*\n\n*Name:* ${name}\n*Age:* ${age}\n*Symptoms:* ${symptoms}\n\nIs everything correct?`,
    hi: (name, age, symptoms) => `*विवरण की जांच करें:*\n\n*नाम:* ${name}\n*उम्र:* ${age}\n*तकलीफ:* ${symptoms}\n\nक्या सब सही है?`,
    kn: (name, age, symptoms) => `*ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಿ:*\n\n*ಹೆಸರು:* ${name}\n*ವಯಸ್ಸು:* ${age}\n*ತೊಂದರೆಗಳು:* ${symptoms}\n\nಎಲ್ಲವೂ ಸರಿಯಾಗಿದೆಯೇ?`,
    te: (name, age, symptoms) => `*మీ వివరాలను ఒకసారి చూసుకోండి:*\n\n*పేరు:* ${name}\n*వయస్సు:* ${age}\n*సమస్యలు:* ${symptoms}\n\nఅన్నీ సరిగ్గా ఉన్నాయా?`,
    ta: (name, age, symptoms) => `*உங்கள் விவரங்களைச் சரிபார்க்கவும்:*\n\n*பெயர்:* ${name}\n*வயது:* ${age}\n*பிரச்சனைகள்:* ${symptoms}\n\nஎல்லாம் சரியாக இருக்கிறதா?`,
  },
  yes_confirm: {
    en: "Yes, Confirm",
    hi: "हाँ, कन्फर्म करें",
    kn: "ಹೌದು, ದೃಢೀಕರಿಸಿ",
    te: "అవును, నిర్ధారించండి",
    ta: "ஆமா, உறுதிசெய்",
  },
  no_edit: {
    en: "No, Edit Symptoms",
    hi: "नहीं, सुधार करें",
    kn: "ಇಲ್ಲ, ಬದಲಾಯಿಸಿ",
    te: "కాదు, సరిచేయండి",
    ta: "இல்லை, மாற்றவும்",
  },
  // ─── Processing ───────────────────────────────────────────
  processing: {
    en: "Processing your details, please wait...",
    hi: "आपका विवरण प्रोसेस हो रहा है, कृपया इंतज़ार करें...",
    kn: "ನಿಮ್ಮ ವಿವರ ಪ್ರಕ್ರಿಯೆಗೊಳ್ಳುತ್ತಿದೆ, ದಯವಿಟ್ಟು ಕಾಯಿರಿ...",
    te: "మీ వివరాలు ప్రాసెస్ అవుతున్నాయి, దయచేసి వేచి ఉండండి...",
    ta: "உங்கள் விவரங்கள் செயலாக்கப்படுகின்றன, காத்திருங்கள்...",
  },
  error_server: {
    en: "Something went wrong. Please try again or contact the help desk for assistance.",
    hi: "कुछ गड़बड़ हो गई। फिर से कोशिश करें या हेल्प डेस्क से संपर्क करें।",
    kn: "ಏನೋ ತೊಂದರೆ ಆಯಿತು. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ ಅಥವಾ ಹೆಲ್ಪ್ ಡೆಸ್ಕ್ ಸಂಪರ್ಕಿಸಿ.",
    te: "ఏదో తప్పు జరిగింది. మళ్ళీ ట్రై చేయండి లేదా హెల్ప్ డెస్క్ సంప్రదించండి.",
    ta: "ஏதோ தவறு நடந்தது. மறுபடி முயற்சிக்கவும் அல்லது ஹெல்ப் டெஸ்க் தொடர்பு கொள்ளுங்கள்.",
  },
  placeholder_name: { en: "Type your full name", hi: "पूरा नाम लिखें", kn: "ಪೂರ್ಣ ಹೆಸರು ಬರೆಯಿರಿ", te: "పూర్తి పేరు రాయండి", ta: "முழு பெயர் எழுதுங்கள்" },
};

// ─── Message helper ──────────────────────────────────────────────
export const m = (key, lang, ...args) => {
  const entry = MSG[key];
  if (!entry) return key;
  const val = entry[lang] || entry['en'];
  return typeof val === 'function' ? val(...args) : val;
};
