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
  idType: { type: String, enum: ['Aadhaar', 'Driving License', 'Voter ID'], required: true },
  idNumber: { type: String, required: true, trim: true },
  abha: { type: String, trim: true },
  mobile: { type: String, required: true, trim: true },
  permanentAddress: {
    isSameAsId: { type: Boolean, default: false },
    homeNo: { type: String, trim: true },
    street: { type: String, trim: true },
    locality: { type: String, trim: true },
    pincode: { type: String, trim: true },
  },
  presentAddress: {
    isSameAsPermanent: { type: Boolean, default: false },
    homeNo: { type: String, trim: true },
    street: { type: String, trim: true },
    locality: { type: String, trim: true },
    pincode: { type: String, trim: true },
  },
  emergencyContact: {
    name: { type: String, trim: true },
    relation: { type: String, trim: true },
    phone: { type: String, trim: true },
  },
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
