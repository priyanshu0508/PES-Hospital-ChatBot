const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
  patientUHID: { type: String, required: true },
  patientName:  { type: String, required: true },
  symptoms: [{ type: String }],
  department: { type: String, required: true },
  floor: { type: Number, required: true },
  room: { type: String, required: true },
  token: { type: String, required: true },
  language: { type: String, default: 'en' },
  visitType: { type: String, enum: ['new', 'returning'], default: 'new' },
  timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Visit', visitSchema);
