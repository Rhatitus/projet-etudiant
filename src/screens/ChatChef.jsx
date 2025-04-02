import React, { useEffect, useState } from 'react';
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

      // Grouper les messages par pseudo (hors "Chef")
      const map = new Map();

      allMessages.forEach(msg => {
        const isChef = msg.pseudo === 'Chef';
        const destinataire = isChef ? msg.destinataire : msg.pseudo;
        if (!map.has(destinataire)) {
          map.set(destinataire, []);
        }
        map.get(destinataire).push(msg);
      });

      const ouvriers = Array.from(map.entries()).map(([pseudo, messages]) => {
        const lastMessage = messages[messages.length - 1];
        const lastTimestamp = lastMessage?.timestamp || new Date().toISOString();
        const lu = localStorage.getItem('lu_' + pseudo) === 'true';

        return {
          pseudo,
          message: lastMessage?.texte || '',
          date: lastMessage?.date || '',
          timestamp: lastTimestamp,
          nonLu: !lu && lastMessage?.pseudo !== 'Chef',
        };
      });

      const sorted = ouvriers.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setDiscussions(sorted);
    };

    updateDiscussions();
    const interval = setInterval(updateDiscussions, 3000);
    return () => clearInterval(interval);
  }, []);

  const openChat = (pseudo) => {
    localStorage.setItem('lu_' + pseudo, 'true');
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
          onClick={() => openChat(item.pseudo)}
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
