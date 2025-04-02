import React, { useEffect, useState } from 'react';

const ChatOuvrier = () => {
  const [log, setLog] = useState("🔍 Chargement initial...");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userRaw = localStorage.getItem("currentUser");
    if (!userRaw) {
      setLog("❌ Aucun currentUser dans localStorage");
      return;
    }

    try {
      const parsed = JSON.parse(userRaw);
      setUser(parsed);
      setLog("✅ Utilisateur détecté : " + JSON.stringify(parsed));
    } catch (err) {
      setLog("❌ Erreur parsing JSON : " + err.message);
    }
  }, []);

  return (
    <div style={{
      padding: "20px",
      color: "white",
      fontFamily: "monospace",
      background: "linear-gradient(to right, #4b6cb7, #182848)",
      height: "100vh",
    }}>
      <h1>🧪 Diagnostic Chat Ouvrier</h1>
      <p>{log}</p>

      {user && (
        <div style={{ marginTop: "20px", color: "lightgreen" }}>
          <strong>Pseudo :</strong> {user.pseudo} <br />
          <strong>Numéro :</strong> {user.numero} <br />
          <strong>Code :</strong> {user.code}
        </div>
      )}
    </div>
  );
};

export default ChatOuvrier;
