import { QRCodeSVG } from 'qrcode.react';
import { Printer, Home, Copy, Check } from 'lucide-react';
import { useState } from 'react';

const QRSlip = ({ slip, onDone }) => {
  const [copied, setCopied] = useState(false);

  const qrPayload = JSON.stringify({
    uhid: slip.uhid,
    token: slip.token,
    name: slip.name,
    dept: slip.department,
    floor: slip.floor,
    room: slip.room,
    date: slip.date,
    issuer: 'PES Hospital OPD',
  });

  const copyUHID = () => {
    navigator.clipboard.writeText(slip.uhid).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <>
      <style>{`
        @media print {
          .chat-page, header, footer, .chat-input-bar, .no-print { display: none !important; }
          .qr-slip-print-wrapper {
            position: fixed !important;
            inset: 0 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            background: white !important;
          }
          .qr-slip-card {
            box-shadow: none !important;
            border: 1px solid #e2e8f0 !important;
            max-width: 400px !important;
          }
        }
      `}</style>

      <div className="qr-slip-print-wrapper">
        <div className="qr-slip-card" style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
          border: '1.5px solid #bbf7d0',
          borderRadius: '20px',
          padding: '1.75rem',
          maxWidth: '380px',
          width: '100%',
          boxShadow: '0 8px 32px rgba(16,185,129,0.12)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '0.7rem', fontWeight: 700, letterSpacing: '2px',
              textTransform: 'uppercase', color: '#059669', marginBottom: '0.25rem'
            }}>
              PES HOSPITAL OPD SLIP
            </div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{slip.date}</div>
          </div>

          {/* UHID row */}
          <div style={{
            width: '100%', background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
            borderRadius: '12px', padding: '0.75rem 1rem',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{
                fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase',
                color: '#065f46', letterSpacing: '0.5px'
              }}>Patient ID (UHID)</div>
              <div style={{
                fontSize: '1.1rem', fontWeight: 800, color: '#065f46',
                letterSpacing: '1px', fontFamily: "'Outfit', sans-serif"
              }}>{slip.uhid}</div>
              <div style={{ fontSize: '0.65rem', color: '#047857' }}>{slip.name}</div>
            </div>
            <button onClick={copyUHID} className="no-print" style={{
              width: '36px', height: '36px', borderRadius: '8px', border: 'none',
              cursor: 'pointer',
              background: copied ? '#059669' : 'rgba(255,255,255,0.6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
            }}>
              {copied ? <Check size={16} color="white" /> : <Copy size={16} color="#065f46" />}
            </button>
          </div>

          {/* Token */}
          <div style={{
            background: 'linear-gradient(135deg, #ede9fe, #ddd6fe)',
            borderRadius: '14px', padding: '1rem 1.5rem', textAlign: 'center', width: '100%',
          }}>
            <div style={{
              fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase',
              color: '#5b21b6', letterSpacing: '1px', marginBottom: '0.25rem'
            }}>Token Number</div>
            <div style={{
              fontSize: '2.5rem', fontWeight: 900,
              background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              fontFamily: "'Outfit', sans-serif", letterSpacing: '-1px'
            }}>
              {slip.token}
            </div>
          </div>

          {/* Dept details */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              { label: 'Department', value: slip.department },
              { label: 'Location', value: `Floor ${slip.floor} — Room ${slip.room}` },
            ].map((row, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.6rem 0.9rem', borderRadius: '10px',
                background: 'rgba(255,255,255,0.8)', border: '1px solid #d1fae5',
              }}>
                <span style={{ fontSize: '0.75rem', color: '#6b7280', minWidth: '85px' }}>{row.label}</span>
                <span style={{ fontWeight: 600, color: '#111827', fontSize: '0.85rem' }}>{row.value}</span>
              </div>
            ))}
          </div>

          {/* QR Code */}
          <div style={{
            padding: '0.75rem', background: 'white',
            borderRadius: '12px', border: '1px solid #e5e7eb'
          }}>
            <QRCodeSVG value={qrPayload} size={140} level="H" includeMargin={false} />
          </div>
          <div style={{ fontSize: '0.65rem', color: '#9ca3af', textAlign: 'center' }}>
            Scan this QR at the OPD counter
          </div>

          {/* Actions */}
          <div className="no-print" style={{
            display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', marginTop: '0.25rem'
          }}>
            <button onClick={() => window.open(`https://wa.me/?text=Hello! Here is your PES Hospital OPD Token: *${slip.token}*. Department: ${slip.department}, Floor: ${slip.floor}, Room: ${slip.room}.`, '_blank')} style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              padding: '0.65rem', borderRadius: '10px', border: 'none',
              background: '#25D366', color: 'white', fontWeight: 600, cursor: 'pointer',
              fontSize: '0.85rem', transition: 'all 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              Share via WhatsApp (Demo)
            </button>
            <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
              <button onClick={() => window.print()} style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                padding: '0.65rem', borderRadius: '10px', border: '1.5px solid #d1d5db',
                background: 'white', color: '#374151', fontWeight: 600, cursor: 'pointer',
                fontSize: '0.85rem', transition: 'all 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                onMouseLeave={e => e.currentTarget.style.background = 'white'}
              >
                <Printer size={15} /> Print
              </button>
              <button onClick={onDone} style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                padding: '0.65rem', borderRadius: '10px', border: 'none',
                background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white',
                fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem', transition: 'all 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                <Home size={15} /> Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QRSlip;
