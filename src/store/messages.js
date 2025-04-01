// src/utils/messages.js
const STORAGE_KEY = 'messages_par_ouvrier';

export const getMessages = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : {};
};

export const saveMessage = (pseudo, message) => {
  const allMessages = getMessages();
  if (!allMessages[pseudo]) {
    allMessages[pseudo] = [];
  }
  allMessages[pseudo].push(message);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allMessages));
};
