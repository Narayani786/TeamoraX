import React, { useState } from 'react';
import API from '../api';
import { Link, useNavigate } from 'react-router-dom';


const Register = () => {

    const [error, setError] = useState();
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post( '/api/auth/register', {
        name,
        email,
        password,
      });
      const token = res.data.token;
      if (token) {
        localStorage.setItem('token', token);
        navigate('/dashboard');
      } else {
        console.log('No token received');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Registration failed';
      console.error("Registration failed:", errorMsg);
      setError(errorMsg);
    }
  };


return (
        <div className="register-form-container">
            <h2>Register</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                name="name"
                value={name}
                className='register-input'
                onChange={(e) => setName(e.target.value)}
                placeholder="Username"
                required
                />
                <br/>
                <input
                name="email"
                type="email"
                value={email}
                className='register-input'
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                />
                <br/>
                <input
                name="password"
                type="password"
                value={password}
                className='register-input'
                onChange={(e) => setPassword(e.target.value)}
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
