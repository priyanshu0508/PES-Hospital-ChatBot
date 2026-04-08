require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const connectDB  = require('./config/db');

// Routes
const patientRoutes   = require('./routes/patients');
const visitRoutes     = require('./routes/visits');

// Connect to MongoDB
connectDB();

const app  = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173', 'https://localhost:5173', 'http://localhost:5174', 'https://localhost:5174'],
  credentials: true
}));  // Vite frontend
app.use(express.json());

app.use('/api/patients', patientRoutes);
app.use('/api/visits',   visitRoutes);

// ─── Health Check ─────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: '✅ PES Hospital Backend is Running', version: '1.0' });
});

// ─── Start Server ─────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
