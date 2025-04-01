import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUserToFirebase } from '../services/userService';

const RegisterOuvrier = () => {
  const [numero, setNumero] = useState('');
  const [pseudo, setPseudo] = useState('');
  const [code, setCode] = useState(null);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!numero.trim() || !pseudo.trim()) {
      alert('Merci de remplir tous les champs.');
      return;
    }

    const generatedCode = Math.floor(1000 + Math.random() * 9000);
    setCode(generatedCode);

    const user = {
      numero: numero.replace(/\s/g, ''),
      pseudo: pseudo.trim(),
      code: generatedCode,
    };

    try {
      await registerUserToFirebase(user.numero, user.pseudo, user.code);
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('pseudo', user.pseudo); // Ajouté
      setStep(2);
    } catch (error) {
      alert('Erreur lors de la création du compte.');
      console.error(error);
    }
  };

  const handleContinue = () => {
    navigate('/code-validation');
  };

  return (
    <div className="page-container" style={styles.container}>
      <h2 style={styles.title}>Inscription Ouvrier</h2>

      {step === 1 && (
        <>
          <p style={styles.subtitle}>Créez votre compte pour accéder au chat</p>
          <input
            style={styles.input}
            type="text"
            placeholder="Numéro de téléphone"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
          />
          <input
            style={styles.input}
            type="text"
            placeholder="Pseudo"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
          />
          <button style={styles.button} onClick={handleRegister}>
            📝 S'inscrire
          </button>
        </>
      )}

      {step === 2 && code && (
        <>
          <p style={styles.subtitle}>
            ✅ Votre code d’inscription est :
            <br />
            <span style={{ fontSize: '22px', fontWeight: 'bold' }}>{code}</span>
          </p>
          <p style={{ fontSize: '14px', color: '#777', marginBottom: '30px' }}>
            Veuillez le noter, vous en aurez besoin pour valider votre compte.
          </p>
          <button style={styles.button} onClick={handleContinue}>
            Continuer
          </button>
        </>
      )}
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
    marginBottom: '20px',
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

export default RegisterOuvrier;
