const Patient = require('../models/Patient');
const Visit   = require('../models/Visit');
const { getDepartmentFromSymptoms } = require('../utils/departmentMapper');

// ─── Generate UHID ───────────────────────────────────────────────
const generateUHID = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let suffix = '';
  for (let i = 0; i < 6; i++) suffix += chars[Math.floor(Math.random() * chars.length)];
  return `PES-${suffix}`;
};

// ─── Generate daily resetting token ──────────────────────────────
// Fix: Count by exact department NAME (not prefix abbreviation)
const generateToken = async (prefix, deptName) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const count = await Visit.countDocuments({
    department: deptName,
    timestamp: { $gte: today }
  });
  return `${prefix}-${String(count + 1).padStart(3, '0')}`;
};

// ─── POST /api/patients/register ─────────────────────────────────
const registerPatient = async (req, res) => {
  try {
    const { name, age, gender, idType, idNumber, abha, mobile, permanentAddress, presentAddress, emergencyContact } = req.body;
    if (!name || !age || !gender || !idType || !idNumber || !mobile) {
      return res.status(400).json({ success: false, message: 'Required fields are missing.' });
    }

    let uhid;
    let unique = false;
    while (!unique) {
      uhid = generateUHID();
      const existing = await Patient.findOne({ uhid });
      if (!existing) unique = true;
    }

    const patient = await Patient.create({ 
      uhid, name, age, gender, idType, idNumber, abha: abha || '', mobile,
      permanentAddress, presentAddress, emergencyContact
    });
    res.status(201).json({ success: true, uhid: patient.uhid, message: 'Patient registered successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
};

// ─── GET /api/patients/:uhid ──────────────────────────────────────
const getPatientByUHID = async (req, res) => {
  try {
    const patient = await Patient.findOne({ uhid: req.params.uhid.toUpperCase() });
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found.' });
    res.json({ success: true, patient });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─── POST /api/visits ─────────────────────────────────────────────
const createVisit = async (req, res) => {
  try {
    const { patientUHID, patientName, symptoms, language, visitType } = req.body;
    if (!patientUHID || !symptoms || !Array.isArray(symptoms)) {
      return res.status(400).json({ success: false, message: 'patientUHID and symptoms are required.' });
    }

    const { dept, floor, room, prefix } = getDepartmentFromSymptoms(symptoms);
    const token = await generateToken(prefix, dept);

    const visit = await Visit.create({
      patientUHID,
      patientName: patientName || 'Unknown',
      symptoms,
      department: dept,
      floor,
      room,
      token,
      language: language || 'en',
      visitType: visitType || 'new',
    });

    res.status(201).json({
      success: true,
      token: visit.token,
      department: visit.department,
      floor: visit.floor,
      room: visit.room,
    });

    // ─── Demo Automated SMS ──────────────────────────────────────────
    console.log(`\n[DEMO SMS SENDER] ---------------------------------------------`);
    console.log(`To: Patient (UHID: ${patientUHID})`);
    console.log(`Message: PES Hospital: Your token for ${visit.department} is ${visit.token}. Proceed to Floor ${visit.floor}, Room ${visit.room}.`);
    console.log(`---------------------------------------------------------------\n`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error during visit creation.' });
  }
};

// ─── GET /api/visits/last/:uhid ──────────────────────────────────
const getLastVisit = async (req, res) => {
  try {
    const visit = await Visit.findOne({ patientUHID: req.params.uhid.toUpperCase() })
      .sort({ timestamp: -1 })
      .limit(1);
    if (!visit) {
      return res.status(404).json({ success: false, message: 'No visits found.' });
    }
    res.json({ success: true, visit });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { registerPatient, getPatientByUHID, createVisit, getLastVisit };
