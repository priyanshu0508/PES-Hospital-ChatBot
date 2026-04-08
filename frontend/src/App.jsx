import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

// Layout Components
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import LanguageSelect from './pages/LanguageSelect';
import PatientType from './pages/PatientType';
import Registration from './pages/Registration';
import Login from './pages/Login';
import Symptoms from './pages/Symptoms';
import TokenSlip from './pages/TokenSlip';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

        {/* ── Global Header ─────────────────────────────── */}
        <Header />

        {/* ── Page Content ──────────────────────────────── */}
        <div className="app-container">
          <Routes>
            <Route path="/"             element={<LanguageSelect />} />
            <Route path="/patient-type" element={<PatientType />} />
            <Route path="/register"     element={<Registration />} />
            <Route path="/login"        element={<Login />} />
            <Route path="/symptoms"     element={<Symptoms />} />
            <Route path="/token"        element={<TokenSlip />} />
          </Routes>
        </div>

        {/* ── Global Footer ─────────────────────────────── */}
        <Footer />

      </div>
    </Router>
  );
}

export default App;
