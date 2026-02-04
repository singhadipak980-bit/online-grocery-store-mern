import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

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

      // 🔴 IMPORTANT CHECK
      if (!res.data || !res.data.token) {
        throw new Error("Token missing in response");
      }

      localStorage.setItem("token", res.data.token);
      setIsLoggedIn(true);

      alert("Login successful");
      navigate("/");
    } catch (err) {
      console.error("LOGIN ERROR (FRONTEND):", err);
      alert("Login failed");
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
