import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container" style={styles.container}>
      <h1 style={styles.title}>Bienvenue sur l'application</h1>
      <p style={styles.subtitle}>Veuillez choisir une option :</p>
      <div style={styles.buttons}>
        <button style={styles.button} onClick={() => navigate('/auth-ouvrier')}>
          🔐 Se connecter
        </button>
        <button
          style={{ ...styles.button, backgroundColor: '#3F51B5' }}
          onClick={() => navigate('/register-ouvrier')}
        >
          📝 S'inscrire
        </button>
      </div>
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
    fontSize: '28px',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#555',
    marginBottom: '30px',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    flexWrap: 'wrap',
  },
  button: {
    padding: '12px 24px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    backgroundColor: '#4CAF50',
    color: 'white',
  },
};

export default Home;
