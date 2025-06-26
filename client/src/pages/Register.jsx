import React, { useState } from 'react';
import axios from 'axios';
import { Link, Navigate, useNavigate } from 'react-router-dom';


const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const navigate = useNavigate();
    const [error, setError] = useState();


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
};


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post( `${import.meta.env.VITE_API_URL}/api/auth/register`, {
        name,
        email,
        password,
      });

      const data = res.data;
      const token = res.data.token;

      if (token) {
        localStorage.setItem('token', token);
        console.log('token saved', token);
        navigate('/dashboard');
      } else {
        console.log('No token found')
      }
    } catch (err) {
      console.error("Registration failed:", err.response?.data || err.message);
      alert("Registration failed");
    }
  };


return (
        <div className="register-form-container">
            <h2>Register</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                name="username"
                value={formData.username}
                className='register-input'
                onChange={handleChange}
                placeholder="Username"
                required
                />
                <br/>
                <input
                name="email"
                type="email"
                value={formData.email}
                className='register-input'
                onChange={handleChange}
                placeholder="Email"
                required
                />
                <br/>
                <input
                name="password"
                type="password"
                value={formData.password}
                className='register-input'
                onChange={handleChange}
                placeholder="Password"
                required
                />
                <button type="submit" className='register-btn'>Register</button>
                <br/>
                <p>
                    Already have an account?
                    <Link to="/login">Login here</Link>
                </p>
            </form>
        </div>
        );
      };

export default Register;
