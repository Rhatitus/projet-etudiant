import React from 'react';

const MessageItem = ({ pseudo, message, heure, onClick }) => {
  return (
    <div onClick={onClick} style={styles.container}>
      <div style={styles.header}>
        <strong style={styles.pseudo}>{pseudo}</strong>
        <span style={styles.heure}>{heure}</span>
      </div>
      <p style={styles.message}>{message}</p>
    </div>
  );
};

const styles = {
  container: {
    padding: '12px 16px',
    backgroundColor: '#fff',
    borderBottom: '1px solid #eee',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '4px',
  },
  pseudo: {
    fontSize: '15px',
    color: '#222',
  },
  heure: {
    fontSize: '11px',
    color: '#999',
  },
  message: {
    fontSize: '13px',
    color: '#666',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    margin: 0,
  },
};

export default MessageItem;
