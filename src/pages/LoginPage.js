import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/dashboard");
        } catch (error) {
            alert("Login failed: " + error.message);
        }
    };

    return (
        <div className="login-container">
            <h2>Login to AgriConnect</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    value={email}
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    value={password}
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>

            {/* Sign Up Link Button */}
            <p>
                Don’t have an account?{" "}
                <button onClick={() => navigate("/signup")} className="signup-btn">
                    Sign Up
                </button>
            </p>
        </div>
    );
};

export default LoginPage;
