import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home');
    }, 2000); // 2 secondes avant de passer à la page d'accueil

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>✨ Bienvenue ✨</h1>
      <p>Chargement...</p>
    </div>
  );
}

export default Splash;
