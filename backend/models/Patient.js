const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  uhid: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  name: { type: String, required: true, trim: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  aadhaar: { type: String, required: true, trim: true },
  mobile: { type: String, required: true, trim: true },
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
