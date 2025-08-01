import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { db, storage } from "../firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import "./QueryPortalPage.css";

const QueryPortalPage = () => {
  const [queryText, setQueryText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const chatContainerRef = useRef(null);
  
  const { transcript, resetTranscript, listening } = useSpeechRecognition();

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  useEffect(() => {
    if (transcript) {
      setQueryText(transcript);
    }
  }, [transcript]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith("image/") && file.size <= 10 * 1024 * 1024) {
        setSelectedFile(file);
      } else if (file.type === "application/pdf" && file.size <= 10 * 1024 * 1024) {
        setSelectedFile(file);
      } else {
        alert("Only image files and PDFs under 10MB are allowed.");
      }
    }
  };

  const handleVoiceInput = () => {
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      alert("Speech recognition not supported in your browser.");
      return;
    }
    resetTranscript();
    SpeechRecognition.startListening({ continuous: false, language: 'en-US' });
  };

  const handleFileUpload = () => {
    fileInputRef.current.click();
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const addToChatHistory = (message, isUser = true, response = null) => {
    const newMessage = {
      id: Date.now(),
      message,
      isUser,
      timestamp: new Date(),
      hasFile: selectedFile ? true : false,
      fileName: selectedFile ? selectedFile.name : null
    };
    
    setChatHistory(prev => [...prev, newMessage]);
    
    if (response) {
      const botMessage = {
        id: Date.now() + 1,
        message: response,
        isUser: false,
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, botMessage]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const queryContent = queryText.trim() || transcript.trim();
    
    if (!queryContent && !selectedFile) {
      alert("Please provide a question or upload a file.");
      return;
    }

    setUploading(true);
    setIsTyping(true);
    let fileUrl = "";
    const finalQuery = queryContent || "Please analyze this file";

    // Add user message to chat
    addToChatHistory(finalQuery, true);

    // Upload file if present
    if (selectedFile) {
      try {
        const storageRef = ref(storage, `queries/${Date.now()}_${selectedFile.name}`);
        await uploadBytes(storageRef, selectedFile);
        fileUrl = await getDownloadURL(storageRef);
      } catch (error) {
        console.error("File upload error:", error);
        alert("Failed to upload file. Please try again.");
        setUploading(false);
        setIsTyping(false);
        return;
      }
    }

    // Save to Firestore
    try {
      await addDoc(collection(db, "queries"), {
        text: finalQuery,
        fileUrl,
        fileName: selectedFile ? selectedFile.name : null,
        fileType: selectedFile ? selectedFile.type : null,
        createdAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Firestore error:", error);
    }

    // Get AI response
    try {
      const formData = new FormData();
      formData.append('text', finalQuery);
      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      const res = await axios.post("http://localhost:5000/api/query", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const response = res.data.response || res.data.message;
      addToChatHistory(response, false);
    } catch (err) {
      console.error("AI response error:", err);
      const errorMessage = "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.";
      addToChatHistory(errorMessage, false);
    }

    // Reset form
    setSelectedFile(null);
    setQueryText("");
    resetTranscript();
    setUploading(false);
    setIsTyping(false);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const clearChat = () => {
    setChatHistory([]);
  };

  return (
    <div className="query-portal">
      <div className="query-portal-header">
        <h1>🌾 AgriConnect AI Assistant</h1>
        <p>Ask me anything about agriculture, crop diseases, farming techniques, and more!</p>
      </div>

      <div className="chat-container" ref={chatContainerRef}>
        {chatHistory.length === 0 ? (
          <div className="welcome-message">
            <div className="welcome-icon">🤖</div>
            <h3>Welcome to AgriConnect AI!</h3>
            <p>I can help you with:</p>
            <ul>
              <li>🌱 Crop identification and care</li>
              <li>🐛 Disease detection and treatment</li>
              <li>🌾 Farming best practices</li>
              <li>🌤️ Weather-related advice</li>
              <li>📊 Market insights</li>
              <li>🔬 Agricultural research</li>
            </ul>
            <p>You can ask me questions via text, voice, or upload images/documents!</p>
          </div>
        ) : (
          chatHistory.map((msg) => (
            <div key={msg.id} className={`chat-message ${msg.isUser ? 'user-message' : 'bot-message'}`}>
              <div className="message-content">
                {msg.hasFile && (
                  <div className="file-attachment">
                    📎 {msg.fileName}
                  </div>
                )}
                <p>{msg.message}</p>
                <span className="message-time">
                  {msg.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))
        )}
        
        {isTyping && (
          <div className="chat-message bot-message">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="input-container">
        <form onSubmit={handleSubmit} className="query-form">
          <div className="input-group">
            <input
              type="text"
              placeholder="Ask about agriculture, crops, farming techniques..."
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              className="text-input"
              disabled={uploading}
            />
            
            <div className="input-buttons">
              <button
                type="button"
                onClick={handleVoiceInput}
                disabled={listening || uploading}
                className={`voice-btn ${listening ? 'listening' : ''}`}
                title="Voice Input"
              >
                🎤 {listening ? "Listening..." : ""}
              </button>
              
              <button
                type="button"
                onClick={handleFileUpload}
                disabled={uploading}
                className="file-btn"
                title="Upload File"
              >
                📎
              </button>
              
              <button
                type="submit"
                disabled={uploading || (!queryText.trim() && !selectedFile)}
                className="submit-btn"
              >
                {uploading ? "Processing..." : "Send"}
              </button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf,.doc,.docx,.txt"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />

          {selectedFile && (
            <div className="file-preview">
              <span>📎 {selectedFile.name}</span>
              <button type="button" onClick={removeFile} className="remove-file">
                ✕
              </button>
            </div>
          )}

          {transcript && (
            <div className="voice-transcript">
              <strong>Voice Input:</strong> {transcript}
            </div>
          )}
        </form>

        <div className="chat-actions">
          <button onClick={clearChat} className="clear-btn">
            Clear Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default QueryPortalPage;
