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
  const navigate = useNavigate();
  const sonNotif = useRef(null);
  const lastMessageId = useRef(null);

  // 🔐 Autoriser les notif (une fois au clic utilisateur)
  useEffect(() => {
    const autoriser = () => {
      sonNotif.current?.play().catch(() => {});
      navigator.vibrate?.(1);
      window.removeEventListener('click', autoriser);
    };
    window.addEventListener('click', autoriser);
    return () => window.removeEventListener('click', autoriser);
  }, []);

  // 🔁 Initialisation : récupérer pseudo + charger les messages
  useEffect(() => {
    const userRaw = localStorage.getItem("currentUser");
    if (!userRaw) {
      navigate('/auth-ouvrier');
      return;
    }

    try {
      const user = JSON.parse(userRaw);
      if (!user.pseudo) {
        navigate('/auth-ouvrier');
        return;
      }

      setPseudo(user.pseudo);

      const fetchMessages = async () => {
        const all = await getMessages();
        const filtered = all.filter(
          (msg) =>
            (msg.pseudo === user.pseudo && msg.destinataire === "Chef") ||
            (msg.pseudo === "Chef" && msg.destinataire === user.pseudo)
        );
        const sorted = filtered.sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        );
        setMessages(sorted);

        const last = sorted[sorted.length - 1];
        if (
          last &&
          last.pseudo === "Chef" &&
          last.timestamp !== lastMessageId.current
        ) {
          triggerNotif(last.texte);
          lastMessageId.current = last.timestamp;
        }
      };

      fetchMessages();
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    } catch (e) {
      navigate('/auth-ouvrier');
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

    await addMessage("Chef", nouveauMessage);
    setMessage('');
    setNotifVisible(true);
    setTimeout(() => setNotifVisible(false), 2000);
  };

  const triggerNotif = (texte) => {
    if (Notification.permission === 'granted') {
      new Notification("📩 Nouveau message du chef", {
        body: texte,
      });
    }
    sonNotif.current?.play().catch(() => {});
    navigator.vibrate?.([200]);
  };

  const deconnexion = () => {
    localStorage.removeItem('currentUser');
    navigate('/auth-ouvrier');
  };

  if (!pseudo) return null;

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
