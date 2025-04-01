import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Debug = () => {
  const [pseudo, setPseudo] = useState('');
  const [info, setInfo] = useState('');
  const navigate = useNavigate();

  const handleConnect = () => {
    if (pseudo.trim() === '') {
      setInfo('⚠️ Entre un pseudo valide');
      return;
    }
    localStorage.setItem('pseudo', pseudo.trim());
    navigate('/chat-ouvrier');
  };

  const handleReset = () => {
    localStorage.clear();
    setInfo('✅ Session réinitialisée.');
  };

  return (
    <div className="page-container" style={{ textAlign: 'center' }}>
      <h2>🧪 Mode Débogage</h2>
      <input
        type="text"
        placeholder="Pseudo pour test"
        value={pseudo}
        onChange={(e) => setPseudo(e.target.value)}
        style={{
          padding: '10px',
          fontSize: '16px',
          marginBottom: '12px',
          borderRadius: '8px',
          border: '1px solid #ccc',
          width: '250px',
        }}
      />
      <div style={{ marginTop: '10px' }}>
        <button onClick={handleConnect} style={styles.button}>
          🎯 Se connecter
        </button>
        <button onClick={handleReset} style={styles.button}>
          🔄 Réinitialiser
        </button>
      </div>

      <div style={{ marginTop: '20px' }}>
        <a href="/chat-chef" style={{ color: '#6a11cb' }}>
          👨‍🍳 Accéder au Chat Chef
        </a>
      </div>

      {info && <p style={{ marginTop: '20px', color: '#333' }}>{info}</p>}
    </div>
  );
};

const styles = {
  button: {
    padding: '10px 16px',
    fontSize: '14px',
    margin: '5px',
    borderRadius: '20px',
    border: 'none',
    backgroundColor: '#ff6f61',
    color: 'white',
    cursor: 'pointer',
  },
};

export default Debug;
