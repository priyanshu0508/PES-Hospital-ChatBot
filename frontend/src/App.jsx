import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

// Import Pages
import LanguageSelect from './pages/LanguageSelect';
import PatientType from './pages/PatientType';
import Registration from './pages/Registration';
import Login from './pages/Login';
import Symptoms from './pages/Symptoms';
import TokenSlip from './pages/TokenSlip';
import StaffDashboard from './pages/StaffDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<LanguageSelect />} />
          <Route path="/patient-type" element={<PatientType />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/symptoms" element={<Symptoms />} />
          <Route path="/token" element={<TokenSlip />} />
          <Route path="/staff" element={<StaffDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
