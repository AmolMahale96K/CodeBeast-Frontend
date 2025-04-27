import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./login.css";

const Login = () => {
  const formRef = useRef(null);
  const topCircleRef = useRef(null);
  const bottomCircleRef = useRef(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );

    gsap.fromTo(
      topCircleRef.current,
      { scale: 0, x: -100, y: -100, opacity: 0 },
      { scale: 1, x: 0, y: 0, opacity: 1, duration: 1, ease: "elastic.out(0.3, 0.5)" }
    );

    gsap.fromTo(
      bottomCircleRef.current,
      { scale: 0, x: 100, y: 100, opacity: 0 },
      { scale: 1, x: 0, y: 0, opacity: 1, duration: 1.2, ease: "elastic.out(0.3, 0.3)", delay: 0.2 }
    );
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/login", formData);
      // const response = await axios.post(`http://${process.env.REACT_APP_API_URL}/api/login`, formData);
      const { token, message } = response.data;
      toast.success(message);
      
      // Store JWT token in localStorage
      localStorage.setItem("token", token);

      setFormData({ email: "", password: "" });
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed.");
    }
  };

  return (
    <div className="login-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <div ref={topCircleRef} className="half-circle top-left"></div>
      <div ref={bottomCircleRef} className="half-circle bottom-right"></div>

      <form ref={formRef} className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
