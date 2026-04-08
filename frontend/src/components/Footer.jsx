import { Phone, Mail, MapPin, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  return (
    <footer style={{
      width: '100%',
      background: 'rgba(255,255,255,0.78)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      borderTop: '1px solid rgba(255,255,255,0.55)',
      boxShadow: '0 -2px 16px rgba(59,130,246,0.05)',
      marginTop: 'auto',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '1.25rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60px',
      }}>
        <div style={{
          fontFamily: "'Inter', sans-serif", 
          fontSize: '0.9rem',
          color: 'var(--text-tertiary)', 
          fontWeight: 500,
          textAlign: 'center',
          letterSpacing: '0.01em',
        }}>
          PES Hospital © {year} All Rights Reserved
        </div>
      </div>
    </footer>
  );
};

export default Footer;
