import { firebaseApp } from './firebaseConfig'; 
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';

const db = getFirestore(firebaseApp);

// Ajouter un message
export const addMessage = async (destinataire, message) => {
  try {
    const docRef = await addDoc(collection(db, 'messages'), {
      ...message,
      destinataire, // 🔥 nouveau champ ajouté
    });
    console.log('Message ajouté avec ID: ', docRef.id);
  } catch (e) {
    console.error('Erreur lors de l\'ajout du message: ', e);
  }
};

// Récupérer tous les messages
export const getMessages = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'messages'));
    const messages = [];
    querySnapshot.forEach((doc) => {
      messages.push(doc.data());
    });
    return messages;
  } catch (e) {
    console.error('Erreur lors de la récupération des messages: ', e);
    return [];
  }
};
