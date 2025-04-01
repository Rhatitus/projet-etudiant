import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getMessages } from '../firebaseUtils';

const CODE_CHEF = 'sekret123';

const ChatChef = () => {
  const [searchParams] = useSearchParams();
  const [discussions, setDiscussions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get('code');
    if (code !== CODE_CHEF) {
      navigate('/access-denied');
    }
  }, [searchParams, navigate]);

  useEffect(() => {
    const updateDiscussions = async () => {
      const allMessages = await getMessages();

      // Group messages by pseudo (only those sent to Chef)
      const grouped = {};

      allMessages.forEach((msg) => {
        if (msg.destinataire === 'Chef') {
          if (!grouped[msg.pseudo]) grouped[msg.pseudo] = [];
          grouped[msg.pseudo].push(msg);
        }
      });

      const list = Object.entries(grouped).map(([pseudo, messages]) => {
        // Trier les messages par timestamp
        const sortedMessages = messages.sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        );

        const lastMessage = sortedMessages[sortedMessages.length - 1];

        const lastSeen = localStorage.getItem('lu_' + pseudo);
        const nonLu = lastSeen !== lastMessage.timestamp;

        return {
          pseudo,
          message: lastMessage.texte,
          date: lastMessage.date,
          timestamp: lastMessage.timestamp,
          nonLu,
        };
      });

      const sorted = list.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );

      setDiscussions(sorted);
    };

    updateDiscussions();
    const interval = setInterval(updateDiscussions, 1000);
    return () => clearInterval(interval);
  }, []);

  const openChat = (pseudo, timestamp) => {
    localStorage.setItem('lu_' + pseudo, timestamp); // Marquer comme lu
    navigate(`/chat-chef/${pseudo}`);
  };

  return (
    <div className="page-container">
      <h2>📬 Messages reçus</h2>
      {discussions.length === 0 && <p>Aucune discussion pour le moment.</p>}
      {discussions.map((item, index) => (
        <div
          key={index}
          style={styles.discussionBox}
          onClick={() => openChat(item.pseudo, item.timestamp)}
        >
          <div style={styles.row}>
            <strong>{item.pseudo}</strong>
            <span style={styles.time}>{item.date}</span>
          </div>
          <div style={styles.previewWrapper}>
            <p style={styles.preview}>{item.message}</p>
            {item.nonLu && <span style={styles.badge}>🔵</span>}
          </div>
        </div>
      ))}
    </div>
  );
};

const styles = {
  discussionBox: {
    backgroundColor: '#fff',
    padding: '12px 16px',
    borderRadius: '12px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
    marginBottom: '12px',
    cursor: 'pointer',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  previewWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  preview: {
    marginTop: '6px',
    color: '#555',
    fontSize: '14px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    flex: 1,
  },
  time: {
    fontSize: '12px',
    color: '#999',
  },
  badge: {
    marginLeft: '10px',
    fontSize: '14px',
  },
};

export default ChatChef;
