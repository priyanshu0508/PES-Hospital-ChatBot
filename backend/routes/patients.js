const express = require('express');
const router  = express.Router();
const { registerPatient, getPatientByUHID, createVisit } = require('../controllers/patientController');

router.post('/register', registerPatient);      // New patient registration
router.get('/:uhid', getPatientByUHID);         // Lookup returning patient by UHID

module.exports = router;
