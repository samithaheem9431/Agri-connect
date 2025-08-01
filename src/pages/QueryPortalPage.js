import React, { useState } from "react";
import axios from "axios";
import { db, storage } from "../firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const QueryPortalPage = () => {
  const [image, setImage] = useState(null);
  const [queryText, setQueryText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [botResponse, setBotResponse] = useState("");
  const { transcript, resetTranscript, listening } = useSpeechRecognition();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024) {
      setImage(file);
    } else {
      alert("Only image files under 5MB are allowed.");
    }
  };

  const handleVoiceInput = () => {
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      alert("Speech recognition not supported in your browser.");
      return;
    }
    resetTranscript();
    SpeechRecognition.startListening({ continuous: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!queryText && !transcript && !image) {
      alert("Provide at least one input.");
      return;
    }

    setUploading(true);
    let imageUrl = "";
    const queryContent = queryText || transcript;

    if (image) {
      const storageRef = ref(storage, `queries/${Date.now()}_${image.name}`);
      await uploadBytes(storageRef, image);
      imageUrl = await getDownloadURL(storageRef);
    }

    await addDoc(collection(db, "queries"), {
      text: queryContent,
      imageUrl,
      createdAt: Timestamp.now(),
    });

    try {
      const res = await axios.post("http://localhost:5000/api/query", { text: queryContent });
      setBotResponse(res.data.response);
    } catch (err) {
      console.error(err);
      setBotResponse("Sorry, I couldn't understand that.");
    }

    setImage(null);
    setQueryText("");
    resetTranscript();
    setUploading(false);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "1rem" }}>
      <h2>Ask a Question</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Type your question"
          value={queryText}
          onChange={(e) => setQueryText(e.target.value)}
        />
        <p>OR</p>
        <button type="button" onClick={handleVoiceInput} disabled={listening}>
          🎤 {listening ? "Listening..." : "Use Voice Input"}
        </button>
        <p><strong>Voice:</strong> {transcript}</p>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Submit"}
        </button>
      </form>

      {botResponse && (
        <div style={{
          marginTop: "1rem",
          padding: "1rem",
          backgroundColor: "#f0f0f0",
          borderRadius: "8px"
        }}>
          <strong>AI Response:</strong>
          <p>{botResponse}</p>
        </div>
      )}
    </div>
  );
};

export default QueryPortalPage;
