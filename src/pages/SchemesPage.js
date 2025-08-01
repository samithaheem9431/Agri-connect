import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";

const SchemePage = () => {
  const [schemes, setSchemes] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "schemes"), (snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data());
      setSchemes(data);
    });

    return () => unsub();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>🏛 Government Agriculture Schemes (Pakistan)</h2>
      {schemes.length === 0 ? (
        <p>No schemes available at the moment.</p>
      ) : (
        schemes.map((s, i) => (
          <div key={i} style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "1rem",
            marginBottom: "1rem",
            backgroundColor: "#f9f9f9"
          }}>
            <h3>{s.title} ({s.province})</h3>
            <p><strong>Description:</strong> {s.description}</p>
            <p><strong>Eligibility:</strong> {s.eligibility}</p>
            {s.validUntil && <p><strong>Valid Until:</strong> {s.validUntil}</p>}
            {s.link && <p><a href={s.link} target="_blank" rel="noreferrer">Apply/More Info</a></p>}
          </div>
        ))
      )}
    </div>
  );
};

export default SchemePage;
