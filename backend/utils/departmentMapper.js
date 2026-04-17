// Symptom → Department mapping (SRS Page 6)
const DEPARTMENT_MAP = [
  { dept: 'General Medicine', floor: 1, room: '101', prefix: 'GM',   keywords: ['fever', 'cold', 'cough', 'body ache', 'weakness', 'general medicine'] },
  { dept: 'Cardiology',       floor: 2, room: '201', prefix: 'CARD', keywords: ['chest pain', 'heart racing', 'breathlessness', 'cardiology'] },
  { dept: 'Ophthalmology',    floor: 2, room: '205', prefix: 'OPH',  keywords: ['eye pain', 'blurry vision', 'redness', 'eye problem', 'ophthalmology'] },
  { dept: 'Gastroenterology', floor: 1, room: '108', prefix: 'GAST', keywords: ['stomach pain', 'vomiting', 'diarrhoea', 'acidity', 'stomach problem', 'gastroenterology'] },
  { dept: 'Orthopaedics',     floor: 3, room: '301', prefix: 'ORT',  keywords: ['bone pain', 'joint pain', 'back pain', 'orthopaedics'] },
  { dept: 'Dermatology',      floor: 3, room: '310', prefix: 'DERM', keywords: ['skin rash', 'itching', 'hair loss', 'skin problem', 'dermatology'] },
  { dept: 'Paediatrics',      floor: 4, room: '401', prefix: 'PAE',  keywords: ['child fever', 'vaccination', 'child growth', 'child health', 'paediatrics'] },
  { dept: 'Dental',           floor: 1, room: '112', prefix: 'DENT', keywords: ['toothache', 'gum pain', 'cavity', 'tooth problem', 'dental'] },
  { dept: 'ENT',              floor: 2, room: '210', prefix: 'ENT',  keywords: ['ear pain', 'hearing problem', 'throat pain', 'ear problem', 'nose problem', 'ent'] },
  { dept: 'Gynaecology',      floor: 2, room: '215', prefix: 'GYN',  keywords: ['women\'s health', 'pregnancy', 'period', 'gynaecology'] },
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
