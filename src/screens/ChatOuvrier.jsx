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
    if (Notification.permission !== 'granted') {
      Notification.requestPermission().then((permission) => {
        console.log('🔔 Permission notifications :', permission);
      });
    }
  }, []);

  useEffect(() => {
    const autoriserSonEtVib = () => {
      if (sonNotif.current) {
        sonNotif.current.play().catch(() => {});
      }
      if ('vibrate' in navigator) {
        navigator.vibrate(1);
      }
      window.removeEventListener('click', autoriserSonEtVib);
    };
    window.addEventListener('click', autoriserSonEtVib);
    return () => window.removeEventListener('click', autoriserSonEtVib);
  }, []);

  useEffect(() => {
    const userRaw = localStorage.getItem("currentUser");
    console.log("📦 localStorage[currentUser] :", userRaw);

    if (!userRaw) {
      console.log("⛔ Aucun utilisateur trouvé, redirection");
      navigate("/auth-ouvrier");
      return;
    }

    try {
      const user = JSON.parse(userRaw);
      console.log("✅ Utilisateur récupéré :", user);

      if (!user.pseudo) {
        console.log("⛔ Pseudo manquant");
        navigate("/auth-ouvrier");
        return;
      }

      setPseudo(user.pseudo);

      const fetchMessages = async () => {
        const allMessages = await getMessages();

        const filtered = allMessages.filter(
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
          showNotification(last.texte);
          lastMessageId.current = last.timestamp;
        }
      };

      fetchMessages();
      const interval = setInterval(fetchMessages, 10000);
      return () => clearInterval(interval);
    } catch (error) {
      console.log("❌ Erreur JSON :", error);
      navigate("/auth-ouvrier");
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
    if (Notification.permission === 'granted') {
      new Notification('📩 Nouveau message du chef', {
        body: texte
      });
    }

    if (sonNotif.current) {
      sonNotif.current.play().catch(() => {
        console.log("⚠️ Son bloqué");
      });
    }

    if ('vibrate' in navigator) {
      navigator.vibrate([200]);
    }

    console.log("🔔 Notif déclenchée :", texte);
  };

  const deconnexion = () => {
    localStorage.removeItem('currentUser');
    navigate('/auth-ouvrier');
  };

  // ✅ Important : attendre la valeur de pseudo === null uniquement
  if (pseudo === null) {
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
