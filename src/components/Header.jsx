import React from 'react';

const Header = () => {
  return (
    <header style={styles.header}>
      <div style={styles.logo}>🌟</div>
      <h1 style={styles.title}>Vida Loca</h1>
    </header>
  );
};

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    background: 'linear-gradient(to right, #ff6f61, #6a11cb)',
    padding: '12px 24px',
    borderRadius: '12px',
    marginBottom: '20px',
    color: '#fff',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
  },
  logo: {
    fontSize: '28px',
  },
  title: {
    fontSize: '20px',
    fontWeight: 'bold',
    margin: 0,
  },
};

export default Header;
