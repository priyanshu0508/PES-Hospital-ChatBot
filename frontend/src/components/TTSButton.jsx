import { Volume2 } from 'lucide-react';

const TTSButton = ({ text, lang = 'en-IN' }) => {
  const speak = () => {
    if (!('speechSynthesis' in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Attempt to map our app language to speech language
    const langMap = {
      'en': 'en-IN',
      'hi': 'hi-IN',
      'kn': 'kn-IN',
      'te': 'te-IN',
      'ta': 'ta-IN'
    };
    utterance.lang = langMap[lang] || 'en-IN';
    
    window.speechSynthesis.cancel(); // stop any ongoing speech
    window.speechSynthesis.speak(utterance);
  };

  return (
    <button 
      onClick={speak} 
      className="btn btn-outline"
      style={{
        padding: '0.5rem',
        borderRadius: '50%',
        display: 'inline-flex',
        marginLeft: '10px',
        border: 'none',
        background: 'rgba(14, 165, 233, 0.1)'
      }}
      title="Read Aloud"
    >
      <Volume2 size={24} color="var(--primary)" />
    </button>
  );
};

export default TTSButton;
