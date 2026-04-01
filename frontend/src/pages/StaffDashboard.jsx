import { useState } from 'react';
import { Users, Phone, Clock, Building2, UserPlus, X, ArrowRight, AlertCircle } from 'lucide-react';

const mockQueue = [
  { id: 1, token: 'GM-042', name: 'Ramesh Kumar', dept: 'General Medicine', floor: 1, time: '10:15 AM', status: 'waiting' },
  { id: 2, token: 'CARD-012', name: 'Sita Devi', dept: 'Cardiology', floor: 2, time: '10:18 AM', status: 'waiting' },
  { id: 3, token: 'ENT-005', name: 'Arjun Das', dept: 'ENT', floor: 2, time: '10:20 AM', status: 'called' },
  { id: 4, token: 'ORTH-021', name: 'Vijay Singh', dept: 'Orthopaedics', floor: 3, time: '10:25 AM', status: 'waiting' },
  { id: 5, token: 'PAED-015', name: 'Baby Anvi', dept: 'Paediatrics', floor: 4, time: '10:30 AM', status: 'waiting' },
  { id: 6, token: 'DERM-009', name: 'Priya Sharma', dept: 'Dermatology', floor: 3, time: '10:32 AM', status: 'waiting' },
];

const DEPARTMENTS = [
  'General Medicine', 'Cardiology', 'ENT', 'Orthopaedics',
  'Paediatrics', 'Dermatology', 'Ophthalmology', 'Gastroenterology', 'Dental'
];

const statusColor = { waiting: 'badge-amber', called: 'badge-green' };

const StaffDashboard = () => {
  const [queue, setQueue] = useState(mockQueue);
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualData, setManualData] = useState({ name: '', dept: 'General Medicine' });
  const [manualError, setManualError] = useState('');

  const handleManualRegister = (e) => {
    e.preventDefault();
    if (!manualData.name.trim()) {
      setManualError('Patient name is required');
      return;
    }
    if (manualData.name.trim().length < 2) {
      setManualError('Name must be at least 2 characters');
      return;
    }
    setManualError('');
    const prefix = manualData.dept.substring(0, 3).toUpperCase();
    const num = String(queue.length + 1).padStart(3, '0');
    const newPatient = {
      id: queue.length + 1,
      token: `${prefix}-${num}`,
      name: manualData.name.trim(),
      dept: manualData.dept,
      floor: DEPARTMENTS.indexOf(manualData.dept) % 4 + 1,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'waiting'
    };
    setQueue([...queue, newPatient]);
    setManualData({ name: '', dept: 'General Medicine' });
    setShowManualForm(false);
  };

  const waitingCount = queue.filter(p => p.status === 'waiting').length;
  const calledCount = queue.filter(p => p.status === 'called').length;

  return (
    <div className="animate-in" style={{ maxWidth: '960px', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title text-gradient" style={{ marginBottom: '0.25rem' }}>Counter Staff Dashboard</h1>
          <p className="page-subtitle">Today's registered patients queue</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowManualForm(!showManualForm)}
          style={{ flexShrink: 0 }}
        >
          {showManualForm ? <><X size={18} /> Close</> : <><UserPlus size={18} /> Add Patient</>}
        </button>
      </div>

      {/* Manual Registration Form (Gap #2) */}
      {showManualForm && (
        <div className="glass-card animate-in" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontFamily: "'Outfit',sans-serif", marginBottom: '1rem', fontSize: '1.1rem' }}>
            Manual Patient Registration
          </h3>
          <form onSubmit={handleManualRegister} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div className="form-group" style={{ flex: '2 1 200px' }}>
              <label className="form-label">Patient Name</label>
              <input
                type="text" className="form-input" placeholder="Patient name"
                value={manualData.name}
                onChange={e => { setManualData({ ...manualData, name: e.target.value }); setManualError(''); }}
                style={{ borderColor: manualError ? 'var(--error)' : undefined }}
              />
              {manualError && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.3rem', color: 'var(--error)', fontSize: '0.8rem', fontWeight: 500 }}>
                  <AlertCircle size={14} /> {manualError}
                </div>
              )}
            </div>
            <div className="form-group" style={{ flex: '1 1 160px' }}>
              <label className="form-label">Department</label>
              <select className="form-input" value={manualData.dept} onChange={e => setManualData({ ...manualData, dept: e.target.value })}>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <button type="submit" className="btn btn-primary" style={{ height: '48px', flexShrink: 0 }}>
              <ArrowRight size={18} /> Register
            </button>
          </form>
        </div>
      )}

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--primary-100)' }}>
            <Users size={24} color="var(--primary-600)" />
          </div>
          <div>
            <div className="stat-value" style={{ color: 'var(--primary-600)' }}>{queue.length}</div>
            <div className="stat-label">Total Patients</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7' }}>
            <Clock size={24} color="#92400e" />
          </div>
          <div>
            <div className="stat-value" style={{ color: '#92400e' }}>{waitingCount}</div>
            <div className="stat-label">Waiting</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#d1fae5' }}>
            <Phone size={24} color="#065f46" />
          </div>
          <div>
            <div className="stat-value" style={{ color: '#065f46' }}>{calledCount}</div>
            <div className="stat-label">Called</div>
          </div>
        </div>
      </div>

      {/* Queue Table */}
      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Token</th>
                <th>Patient</th>
                <th>Department</th>
                <th>Floor</th>
                <th>Time</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {queue.map((p) => (
                <tr key={p.id}>
                  <td>
                    <span style={{ fontWeight: 700, fontFamily: "'Outfit',sans-serif", color: 'var(--primary-600)' }}>
                      {p.token}
                    </span>
                  </td>
                  <td style={{ fontWeight: 500 }}>{p.name}</td>
                  <td><span className="badge badge-blue">{p.dept}</span></td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Building2 size={14} color="var(--text-tertiary)" /> {p.floor}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{p.time}</td>
                  <td>
                    <span className={`badge ${statusColor[p.status]}`}>
                      {p.status === 'called' ? '● Called' : '○ Waiting'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      className="btn btn-primary"
                      style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
                      onClick={() => {
                        setQueue(queue.map(q => q.id === p.id ? { ...q, status: 'called' } : q));
                      }}
                      disabled={p.status === 'called'}
                    >
                      <Phone size={14} /> Call
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
