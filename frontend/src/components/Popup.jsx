import { useEffect } from 'react';

function Popup({ type = 'success', message, onClose, duration = 2500 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const icons = {
    success: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    error: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
  };

  const styles = {
    overlay: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
    },
    card: {
      background: 'rgba(15, 15, 20, 0.95)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '2.5rem',
      borderRadius: '24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1.5rem',
      textAlign: 'center',
      minWidth: '320px',
      boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
      animation: 'popupBounce 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },
    message: {
      margin: 0,
      fontSize: '1.1rem',
      fontWeight: '700',
      color: '#fff',
    },
    btn: {
      background: type === 'success' ? '#10b981' : '#f43f5e',
      color: '#fff',
      border: 'none',
      padding: '0.75rem 2rem',
      borderRadius: '12px',
      fontWeight: '800',
      cursor: 'pointer',
      transition: '0.2s',
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <style>{`
        @keyframes popupBounce {
           0% { transform: scale(0.5); opacity: 0; }
           100% { transform: scale(1); opacity: 1; }
        }
        .popup-close-btn:hover { filter: brightness(1.1); transform: translateY(-2px); }
      `}</style>
      <div style={styles.card} onClick={(e) => e.stopPropagation()}>
        <div>{icons[type]}</div>
        <p style={styles.message}>{message}</p>
        <button style={styles.btn} className="popup-close-btn" onClick={onClose}>OK</button>
      </div>
    </div>
  );
}

export default Popup;
