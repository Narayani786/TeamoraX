import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const navigate = useNavigate();

 const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
            email,
            password,
        });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        navigate('/dashboard');
    } catch (err) {
        alert ('Login failed');
        console.error(err);
    }
};

return( 
    <div className="login-form-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
            <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='login-input'
            placeholder="Email"
            required
            />
            <br/>
            <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='login-input'
            placeholder="Password"
            required
            />
            <br/>
            <button type="submit" className='login-btn'>Login</button>
            <br/>
            <p>
                Don't have an account?
                <Link to="/register"> Register here</Link>
            </p>
        </form>
    </div>
    );
 };

export default Login;
