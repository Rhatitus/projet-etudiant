import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { getMessages, addMessage } from '../firebaseUtils';

const ChatChefDiscussion = () => {
  const { pseudo } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchDiscussion = async () => {
      const allMessages = await getMessages();

      const filtered = allMessages.filter(
        (msg) =>
          (msg.pseudo === pseudo && msg.destinataire === 'Chef') ||
          (msg.pseudo === 'Chef' && msg.destinataire === pseudo)
      );

      const sorted = filtered.sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );

      setMessages(sorted);
    };

    fetchDiscussion();
    const interval = setInterval(fetchDiscussion, 1000);
    return () => clearInterval(interval);
  }, [pseudo]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const envoyerMessage = async () => {
    if (message.trim() === '') return;

    const now = new Date();
    const nouveauMessage = {
      texte: message,
      date: now.toLocaleTimeString(),
      timestamp: now.toISOString(),
      pseudo: 'Chef', // bien défini
    };

    await addMessage(pseudo, nouveauMessage); // pseudo = destinataire
    setMessage('');
  };

  const handleRetour = () => {
    navigate('/chat-chef?code=sekret123');
  };

  return (
    <div className="page-container">
      <Header />
      <div style={styles.topBar}>
        <button onClick={handleRetour} style={styles.backButton}>
          ⬅ Retour
        </button>
        <strong>Conversation avec {pseudo}</strong>
      </div>

      <div style={styles.chatBox}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.messageWrapper,
              justifyContent: msg.pseudo === 'Chef' ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                ...styles.messageBubble,
                backgroundColor: msg.pseudo === 'Chef' ? '#cce5ff' : '#f1f0f0',
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
          placeholder="Votre message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={styles.input}
        />
        <button onClick={envoyerMessage} style={styles.button}>
          Envoyer
        </button>
      </div>
    </div>
  );
};

const styles = {
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  backButton: {
    backgroundColor: '#eee',
    border: 'none',
    borderRadius: '20px',
    padding: '6px 12px',
    cursor: 'pointer',
  },
  chatBox: {
    height: '300px',
    overflowY: 'auto',
    padding: '10px',
    backgroundColor: '#fff',
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
    backgroundColor: '#6a11cb',
    color: 'white',
    border: 'none',
    borderRadius: '30px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

export default ChatChefDiscussion;
