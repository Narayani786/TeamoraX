import React, { useState } from 'react';
import axios from 'axios';
import { Link, Navigate, useNavigate } from 'react-router-dom';


const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const navigate = useNavigate();
    const [error, setError] = useState();


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
};


  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, email, password } = formData;
    if (!username || !email || !password) {
      alert("All fields are required");
      return;
    }
    try {
      const res = await axios.post( `${import.meta.env.VITE_API_URL}/api/team/register`, formData );

      const data = res.data;

      localStorage.setItem('Registration success:',data );
      navigate('/dashboard');
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
