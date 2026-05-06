// Symptom → Department mapping — PESU Hospital layout
const DEPARTMENT_MAP = [
  // ── 1st Floor ──────────────────────────────────────────────────────────────
  { dept: 'General Medicine',  floor: 1, room: '101', prefix: 'GM',   keywords: ['fever', 'cold', 'cough', 'body ache', 'weakness', 'general medicine'] },
  { dept: 'General Surgery',   floor: 1, room: '105', prefix: 'GS',   keywords: ['general surgery', 'surgery', 'surgical', 'wound', 'abscess'] },
  { dept: 'Obstetrics',        floor: 1, room: '110', prefix: 'OBS',  keywords: ['obstetrics', 'pregnancy', 'antenatal', 'prenatal', 'maternity'] },
  { dept: 'Gynaecology',       floor: 1, room: '112', prefix: 'GYN',  keywords: ["women's health", 'gynaecology', 'period', 'menstrual', 'pelvic'] },
  { dept: 'Paediatrics',       floor: 1, room: '115', prefix: 'PAE',  keywords: ['child fever', 'vaccination', 'child growth', 'child health', 'paediatrics'] },
  { dept: 'Dental',            floor: 1, room: '118', prefix: 'DENT', keywords: ['toothache', 'gum pain', 'cavity', 'tooth problem', 'dental'] },
  { dept: 'Orthopaedic',       floor: 1, room: '120', prefix: 'ORT',  keywords: ['bone pain', 'joint pain', 'back pain', 'fracture', 'orthopaedic'] },
  // ── 2nd Floor ──────────────────────────────────────────────────────────────
  { dept: 'Psychiatry',        floor: 2, room: '201', prefix: 'PSY',  keywords: ['mental health', 'anxiety', 'depression', 'psychiatry', 'stress', 'emotional', 'insomnia'] },
  { dept: 'Ophthalmologist',   floor: 2, room: '205', prefix: 'OPH',  keywords: ['eye pain', 'blurry vision', 'redness', 'eye problem', 'ophthalmology', 'cataract'] },
  { dept: 'ENT',               floor: 2, room: '210', prefix: 'ENT',  keywords: ['ear pain', 'hearing problem', 'throat pain', 'ear problem', 'nose problem', 'ent', 'sinus'] },
  { dept: 'Dermatology (DVL)', floor: 2, room: '215', prefix: 'DERM', keywords: ['skin rash', 'itching', 'hair loss', 'skin problem', 'dermatology', 'dvl', 'acne', 'eczema'] },
];


/**
 * Finds the best matching department from a list of symptom strings.
 * Falls back to General Medicine (as per SRS).
 */
const getDepartmentFromSymptoms = (symptoms = []) => {
  const text = symptoms.join(' ').toLowerCase();
  for (const mapping of DEPARTMENT_MAP) {
    if (mapping.keywords.some(kw => text.includes(kw))) {
      return { dept: mapping.dept, floor: mapping.floor, room: mapping.room, prefix: mapping.prefix };
    }
  }
  // Default fallback — SRS: "Anything not matched → General Medicine"
  return { dept: 'General Medicine', floor: 1, room: '101', prefix: 'GM' };
};

module.exports = { getDepartmentFromSymptoms };
