import { createContext, useState, useContext } from 'react';

const PatientContext = createContext();

export const PatientProvider = ({ children }) => {
  const [patientData, setPatientData] = useState({
    isNew: null, // true or false
    language: 'en', // 'en', 'hi', 'kn', 'te', 'ta'
    uhid: '', // Unique Hospital ID
    personalInfo: {
      name: '',
      age: '',
      gender: '',
      aadhaar: '',
      mobile: ''
    },
    symptoms: [],
    departmentInfo: null, // { name: 'General Medicine', floor: 1, token: 'GM-001' }
  });

  const updatePatientData = (newData) => {
    setPatientData(prev => ({ ...prev, ...newData }));
  };

  const resetPatientData = () => {
    setPatientData({
      isNew: null,
      language: 'en',
      uhid: '',
      personalInfo: { name: '', age: '', gender: '', aadhaar: '', mobile: '' },
      symptoms: [],
      departmentInfo: null,
    });
  };

  return (
    <PatientContext.Provider value={{ patientData, updatePatientData, resetPatientData }}>
      {children}
    </PatientContext.Provider>
  );
};

export const usePatient = () => useContext(PatientContext);
