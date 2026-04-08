const express = require('express');
const router  = express.Router();
const { createVisit } = require('../controllers/patientController');

router.post('/', createVisit);    // Submit symptoms → get token + department

module.exports = router;
