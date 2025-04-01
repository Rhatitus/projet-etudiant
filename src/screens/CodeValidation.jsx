import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CodeValidation = () => {
  const [codeInput, setCodeInput] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!savedUser) {
      navigate('/home'); // sécurité : si pas de user, on repart du début
    } else {
      setCurrentUser(savedUser);
    }
  }, [navigate]);

  const handleValidate = () => {
    if (codeInput.trim() === String(currentUser.code)) {
      navigate('/chat-ouvrier');
    } else {
      alert('❌ Code incorrect. Veuillez réessayer.');
    }
  };

  if (!currentUser) return null;

  return (
    <div className="page-container" style={styles.container}>
      <h2 style={styles.title}>Validation du code</h2>
      <p style={styles.subtitle}>
        Un code vous a été attribué lors de l'inscription. Veuillez le saisir pour continuer.
      </p>

      <input
        style={styles.input}
        type="text"
        placeholder="Entrez votre code"
        value={codeInput}
        onChange={(e) => setCodeInput(e.target.value)}
      />

      <button style={styles.button} onClick={handleValidate}>
        ✅ Valider
      </button>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    padding: '60px 20px',
    fontFamily: 'sans-serif',
  },
  title: {
    fontSize: '24px',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#555',
    marginBottom: '30px',
  },
  input: {
    display: 'block',
    width: '80%',
    margin: '10px auto',
    padding: '12px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '12px 24px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    backgroundColor: '#4CAF50',
    color: 'white',
    marginTop: '20px',
  },
};

export default CodeValidation;
