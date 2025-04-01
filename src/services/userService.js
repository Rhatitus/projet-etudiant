import { getFirestore, setDoc, doc, getDoc } from 'firebase/firestore';
import { firebaseApp } from '../firebaseConfig';

const db = getFirestore(firebaseApp);

export const registerUserToFirebase = async (numero, pseudo, code) => {
  const userRef = doc(db, 'ouvriers', numero);
  await setDoc(userRef, {
    numero,
    pseudo,
    code,
  });
};

export const getUserFromFirebase = async (numero) => {
  const userRef = doc(db, 'ouvriers', numero);
  const snap = await getDoc(userRef);
  if (snap.exists()) return snap.data();
  return null;
};
