const express = require('express');
const router  = express.Router();
const { createVisit, getLastVisit } = require('../controllers/patientController');

router.post('/', createVisit);             // Submit symptoms → get token + department
router.get('/last/:uhid', getLastVisit);   // Get last visit for a patient (follow-up)

module.exports = router;
