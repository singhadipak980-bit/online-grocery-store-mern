import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";
import "../auth.css";

function Login({ setIsLoggedIn }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", {
        email: form.email.toLowerCase(),
        password: form.password,
      });

      if (!res.data || !res.data.token) {
        throw new Error("Token missing in response");
      }

      localStorage.setItem("token", res.data.token);
      setIsLoggedIn(true);

      navigate("/");
    } catch (err) {
      console.error("LOGIN ERROR (FRONTEND):", err);
      alert("Login failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button type="submit">Login</button>
        </form>

        <div className="auth-link">
          Don’t have an account? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
