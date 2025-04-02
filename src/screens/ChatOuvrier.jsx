import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import { addMessage, getMessages } from '../firebaseUtils';
import { useNavigate } from 'react-router-dom';

const ChatOuvrier = () => {
  const [pseudo, setPseudo] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [notifVisible, setNotifVisible] = useState(false);
  const messagesEndRef = useRef(null);
  const sonNotif = useRef(null);
  const lastMessageId = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!storedUser || !storedUser.pseudo) {
      navigate('/auth-ouvrier');
    } else {
      setPseudo(storedUser.pseudo);

      const fetchMessages = async () => {
        const messagesRecus = await getMessages();
        const filtered = messagesRecus.filter(
          (msg) =>
            (msg.pseudo === storedUser.pseudo && msg.destinataire === 'Chef') ||
            (msg.pseudo === 'Chef' && msg.destinataire === storedUser.pseudo)
        );
        const sorted = filtered.sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        );
        setMessages(sorted);

        const last = sorted[sorted.length - 1];
        if (
          last &&
          last.pseudo === 'Chef' &&
          last.timestamp !== lastMessageId.current
        ) {
          showNotification(last.texte);
          lastMessageId.current = last.timestamp;
        }
      };

      fetchMessages();
      const interval = setInterval(fetchMessages, 10000);
      return () => clearInterval(interval);
    }
  }, [navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const envoyerMessage = async () => {
    if (message.trim() === '' || !pseudo) return;

    const now = new Date();
    const nouveauMessage = {
      texte: message,
      date: now.toLocaleTimeString(),
      timestamp: now.toISOString(),
      pseudo,
    };

    await addMessage('Chef', nouveauMessage);
    setMessage('');
    afficherNotification();
  };

  const afficherNotification = () => {
    setNotifVisible(true);
    setTimeout(() => setNotifVisible(false), 2000);
  };

  const showNotification = (texte) => {
    // 📳 Vibration
    if ('vibrate' in navigator) {
      navigator.vibrate([200]);
    }

    // 🔊 Son
    if (sonNotif.current) {
      sonNotif.current.play().catch(() => {});
    }

    // 📩 Affichage bannière animée
    const existing = document.getElementById('custom-banner');
    if (existing) existing.remove();

    const banner = document.createElement('div');
    banner.id = 'custom-banner';
    banner.innerHTML = `📩 Nouveau message du chef : ${texte}`;
    Object.assign(banner.style, {
      position: 'fixed',
      top: '10px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: '#ff6f61',
      color: '#fff',
      padding: '12px 20px',
      borderRadius: '20px',
      fontWeight: 'bold',
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
      zIndex: 9999,
      animation: 'popNotif 0.3s ease, fadeOut 0.5s ease 2.5s forwards',
      fontSize: '15px',
      maxWidth: '90%',
      textAlign: 'center',
    });

    document.body.appendChild(banner);

    setTimeout(() => {
      banner.remove();
    }, 3000);
  };

  const deconnexion = () => {
    localStorage.removeItem('currentUser');
    navigate('/auth-ouvrier');
  };

  if (!pseudo) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h3>🔄 Chargement du chat...</h3>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Header />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <span><strong>👷 Connecté :</strong> {pseudo}</span>
        <button onClick={deconnexion} style={styles.logout}>🔓 Déconnexion</button>
      </div>

      <div style={styles.chatBox}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.messageWrapper,
              justifyContent: msg.pseudo === 'Chef' ? 'flex-start' : 'flex-end',
            }}
          >
            <div
              style={{
                ...styles.messageBubble,
                backgroundColor: msg.pseudo === 'Chef' ? '#e0f7fa' : '#dcf8c6',
              }}
            >
              <span style={styles.time}>[{msg.date}]</span>
              <strong>{msg.pseudo}:</strong> {msg.texte}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div style={styles.inputArea}>
        <input
          type="text"
          placeholder="Écris ton message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={styles.input}
        />
        <button onClick={envoyerMessage} style={styles.button}>Envoyer</button>
      </div>

      {notifVisible && (
        <div className="notif-bulle">✅ Message envoyé !</div>
      )}

      {/* 🔊 Son de notif */}
      <audio ref={sonNotif} src="/sounds/notification.mp3" preload="auto" />
    </div>
  );
};

const styles = {
  chatBox: {
    height: '300px',
    overflowY: 'auto',
    padding: '10px',
    backgroundColor: '#f2f2f2',
    borderRadius: '12px',
    marginBottom: '20px',
  },
  messageWrapper: {
    display: 'flex',
    marginBottom: '10px',
  },
  messageBubble: {
    padding: '12px 16px',
    borderRadius: '18px',
    maxWidth: '75%',
    color: '#222',
    fontSize: '15px',
    lineHeight: '1.5',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  time: {
    fontSize: '11px',
    color: '#888',
    display: 'block',
    marginBottom: '4px',
  },
  inputArea: {
    display: 'flex',
    gap: '10px',
  },
  input: {
    flex: 1,
    padding: '12px',
    borderRadius: '30px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '12px 20px',
    backgroundColor: '#ff6f61',
    color: 'white',
    border: 'none',
    borderRadius: '30px',
    cursor: 'pointer',
  },
  logout: {
    border: '1px solid #ccc',
    padding: '6px 12px',
    borderRadius: '20px',
    backgroundColor: 'white',
    fontSize: '14px',
    cursor: 'pointer',
  },
};

export default ChatOuvrier;
