import React, { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      alert("Signup failed: " + error.message);
    }
  };

  return (
    <div className="signup-container">
      <h2>Signup for AgriConnect</h2>
      <form onSubmit={handleSignup}>
        <input type="email" value={email} placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default SignupPage;
