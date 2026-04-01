import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Activity, Users, TrendingUp, Globe } from 'lucide-react';

const deptData = [
  { name: 'Gen Med', patients: 120 },
  { name: 'Cardio', patients: 45 },
  { name: 'ENT', patients: 35 },
  { name: 'Ortho', patients: 65 },
  { name: 'Paeds', patients: 50 },
  { name: 'Derma', patients: 30 },
  { name: 'Dental', patients: 25 },
  { name: 'Gastro', patients: 40 },
];

const peakHours = [
  { time: '8 AM', count: 20 },
  { time: '9 AM', count: 80 },
  { time: '10 AM', count: 120 },
  { time: '11 AM', count: 95 },
  { time: '12 PM', count: 40 },
  { time: '1 PM', count: 30 },
  { time: '2 PM', count: 55 },
  { time: '3 PM', count: 45 },
];

const langData = [
  { name: 'Kannada', value: 420 },
  { name: 'English', value: 280 },
  { name: 'Hindi', value: 150 },
  { name: 'Telugu', value: 90 },
  { name: 'Tamil', value: 60 },
];

const COLORS = ['#3b82f6', '#8b5cf6', '#14b8a6', '#f59e0b', '#f43f5e'];

const totalPatients = deptData.reduce((s, d) => s + d.patients, 0);
const peakHour = peakHours.reduce((a, b) => a.count > b.count ? a : b);

const AdminDashboard = () => {
  return (
    <div className="animate-in" style={{ maxWidth: '1100px', width: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="page-title text-gradient" style={{ marginBottom: '0.25rem' }}>Admin Analytics</h1>
        <p className="page-subtitle">Real-time hospital registration insights</p>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { icon: <Users size={22} />, label: 'Total Patients', value: totalPatients, color: 'var(--primary-600)', bg: 'var(--primary-100)' },
          { icon: <TrendingUp size={22} />, label: 'Peak Hour', value: peakHour.time, color: '#065f46', bg: '#d1fae5' },
          { icon: <Activity size={22} />, label: 'Active Depts', value: deptData.length, color: '#5b21b6', bg: '#ede9fe' },
          { icon: <Globe size={22} />, label: 'Languages Used', value: langData.length, color: '#92400e', bg: '#fef3c7' }
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{ background: s.bg }}>
              <span style={{ color: s.color, display: 'flex' }}>{s.icon}</span>
            </div>
            <div>
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Patients per Dept */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Patients per Department
          </h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip
                  cursor={{ fill: 'rgba(59,130,246,0.05)' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontFamily: "'Inter',sans-serif" }}
                />
                <defs>
                  <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#1d4ed8" />
                  </linearGradient>
                </defs>
                <Bar dataKey="patients" fill="url(#blueGrad)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Peak Hours */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Registration Volume by Hour
          </h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={peakHours} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip
                  cursor={{ fill: 'rgba(20,184,166,0.05)' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontFamily: "'Inter',sans-serif" }}
                />
                <defs>
                  <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#14b8a6" />
                    <stop offset="100%" stopColor="#0d9488" />
                  </linearGradient>
                </defs>
                <Bar dataKey="count" fill="url(#tealGrad)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Language Pie Chart */}
      <div className="glass-card" style={{ padding: '1.5rem', maxWidth: '480px' }}>
        <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Language Distribution
        </h3>
        <div style={{ height: '280px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={langData} cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {langData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontFamily: "'Inter',sans-serif" }} />
              <Legend iconType="circle" wrapperStyle={{ fontFamily: "'Inter',sans-serif", fontSize: '0.85rem' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
