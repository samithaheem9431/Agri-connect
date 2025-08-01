import React, { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./SignupPage.css";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    if (!acceptTerms) {
      setError("Please accept the Terms of Service and Privacy Policy.");
      return false;
    }
    return true;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (error) {
      let errorMessage = "Signup failed. Please try again.";
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = "An account with this email already exists.";
          break;
        case 'auth/invalid-email':
          errorMessage = "Please enter a valid email address.";
          break;
        case 'auth/weak-password':
          errorMessage = "Password is too weak. Please choose a stronger password.";
          break;
        case 'auth/operation-not-allowed':
          errorMessage = "Email/password accounts are not enabled. Please contact support.";
          break;
        default:
          errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-header">
          <div className="logo-section">
            <div className="logo-icon">🌾</div>
            <h1>AgriConnect</h1>
          </div>
          <p className="signup-subtitle">Create your account to get started with AgriConnect</p>
        </div>

        <form onSubmit={handleSignup} className="signup-form">
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <input
                id="email"
                type="email"
                value={email}
                placeholder="Enter your email address"
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className={error && error.includes('email') ? 'error' : ''}
              />
              <span className="input-icon">📧</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="Create a strong password"
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className={error && error.includes('password') ? 'error' : ''}
              />
              <span className="input-icon">🔒</span>
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            <div className="password-strength">
              <div className={`strength-bar ${password.length >= 6 ? 'strong' : password.length >= 4 ? 'medium' : 'weak'}`}></div>
              <span className="strength-text">
                {password.length === 0 ? 'Enter a password' : 
                 password.length < 4 ? 'Weak' : 
                 password.length < 6 ? 'Medium' : 'Strong'}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-wrapper">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                placeholder="Confirm your password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
                className={error && error.includes('match') ? 'error' : ''}
              />
              <span className="input-icon">🔒</span>
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {confirmPassword && (
              <div className="password-match">
                {password === confirmPassword ? (
                  <span className="match-success">✅ Passwords match</span>
                ) : (
                  <span className="match-error">❌ Passwords do not match</span>
                )}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="terms-checkbox">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                disabled={isLoading}
              />
              <span className="checkmark"></span>
              I agree to the{" "}
              <button type="button" className="terms-link">
                Terms of Service
              </button>{" "}
              and{" "}
              <button type="button" className="terms-link">
                Privacy Policy
              </button>
            </label>
          </div>

          <button 
            type="submit" 
            className={`signup-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="login-section">
          <p className="login-text">
            Already have an account?{" "}
            <button 
              onClick={() => navigate("/")} 
              className="login-link"
              disabled={isLoading}
            >
              Sign in here
            </button>
          </p>
        </div>

        <div className="signup-footer">
          <p>By creating an account, you agree to our Terms of Service and Privacy Policy.</p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
