import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './screens/Home';
import RegisterOuvrier from './screens/RegisterOuvrier';
import AuthOuvrier from './screens/AuthOuvrier';
import ChatOuvrier from './screens/ChatOuvrier';
import ChatChef from './screens/ChatChef';
import ChatChefDiscussion from './screens/ChatChefDiscussion';
import CodeValidation from './screens/CodeValidation';
import AccessDenied from './screens/AccessDenied';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth-ouvrier" element={<AuthOuvrier />} />
        <Route path="/register-ouvrier" element={<RegisterOuvrier />} />
        <Route path="/code-validation" element={<CodeValidation />} />
        <Route path="/chat-ouvrier" element={<ChatOuvrier />} />
        <Route path="/chat-chef" element={<ChatChef />} />
        <Route path="/chat-chef/:pseudo" element={<ChatChefDiscussion />} />
        <Route path="/access-denied" element={<AccessDenied />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
