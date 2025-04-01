import React from 'react';
import Header from '../components/Header';

const AccessDenied = () => {
  return (
    <div className="page-container">
      <Header />
      <h2>🚫 Accès refusé</h2>
      <p>Tu n’as pas le droit d’accéder à cette page.</p>
      <p>Vérifie le lien ou contacte un administrateur.</p>
    </div>
  );
};

export default AccessDenied;
