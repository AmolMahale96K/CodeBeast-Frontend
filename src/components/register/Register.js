//register.js
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./register.css";

const Register = () => {
  const formRef = useRef(null);
  const topCircleRef = useRef(null);
  const bottomCircleRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profilePic: null, // New field for profile picture
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

  const handleFileChange = (e) => {
    setFormData({ ...formData, profilePic: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    if (formData.profilePic) {
      formDataToSend.append("profilePic", formData.profilePic);
    }
  
    try {
      const response = await axios.post("http://localhost:5000/api/register", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      toast.success(response.data.message);
      setFormData({ name: "", email: "", password: "", profilePic: null });
    } catch (err) {
      console.error("Error uploading file:", err);
      toast.error(err.response?.data?.message || "Registration failed.");
    }
  };
  

  return (
    <div className="register-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <div ref={topCircleRef} className="half-circle top-left"></div>
      <div ref={bottomCircleRef} className="half-circle bottom-right"></div>
      
      <form ref={formRef} className="register-form" onSubmit={handleSubmit} encType="multipart/form-data">
        <h2>Register</h2>

        <div className="input-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="profilePic">Profile Picture</label>
          <input type="file" id="profilePic" name="profilePic" accept="image/*" onChange={handleFileChange} />
        </div>

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Register;
