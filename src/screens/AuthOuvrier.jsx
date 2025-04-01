import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserFromFirebase } from '../services/userService';

const AuthOuvrier = () => {
  const [numero, setNumero] = useState('');
  const [pseudo, setPseudo] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    const cleanNumero = numero.replace(/\s/g, '');
    const cleanPseudo = pseudo.trim();

    if (!cleanNumero || !cleanPseudo) {
      alert('Veuillez remplir tous les champs.');
      return;
    }

    try {
      const user = await getUserFromFirebase(cleanNumero);
      console.log("→ Utilisateur récupéré :", user);

      if (!user) {
        alert("Aucun compte trouvé.");
        return;
      }

      console.log("Pseudo tapé :", cleanPseudo);
      console.log("Pseudo Firebase :", user.pseudo);

      if (user.pseudo !== cleanPseudo) {
        alert("Pseudo incorrect.");
        return;
      }

      localStorage.setItem('currentUser', JSON.stringify(user));
      navigate('/chat-ouvrier');
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      alert("Une erreur est survenue lors de la connexion.");
    }
  };

  return (
    <div className="page-container" style={styles.container}>
      <h2 style={styles.title}>Connexion Ouvrier</h2>
      <p style={styles.subtitle}>Connectez-vous à votre espace</p>

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

      <button style={styles.button} onClick={handleLogin}>
        🔐 Se connecter
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

export default AuthOuvrier;
