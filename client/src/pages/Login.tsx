import React, { useState, useEffect } from "react";
import { handleLogin } from "../api"; // Impor fungsi handleLogin dari file api.ts
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import "../styles/Login.css";

interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userDetail = localStorage.getItem("user_detail");
    if (userDetail) {
      // Jika user_detail ada di local storage, lempar ke route /
      navigate("/");
    } else {
      setLoading(false); // Jika tidak ada, berhenti loading
    }
  }, [navigate]);

  const onLogin = async () => {
    try {
      await handleLogin(username, password, navigate);
      // Implement logic for successful login, like redirecting to another page
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(
          (error as Error).message || "Failed to login. Please try again later."
        );
      } else {
        setErrorMessage("Failed to login. Please try again later.");
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div
      style={{
        display: "flex",
        height: "89vh",
        alignItems: "center",
      }}
    >
      <div className="login-container">
        <h2>Login</h2>
        <div className="input-container">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="input-container">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="error-message">{errorMessage}</div>
        <button className="login-button" onClick={onLogin}>
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
