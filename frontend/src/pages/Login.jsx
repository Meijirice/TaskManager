import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance'; 
import styles from '../styles/Login.module.css';
import Header from "../components/Header";
import Footer from "../components/Footer";

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axiosInstance.post('/auth/login', {
        email: formData.email,
        password: formData.password
      });
      
      console.log('Login successful:', response.data);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }

      navigate('/Boards');
      
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.message || 
        'Login failed. Please check your credentials.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
        <Header/>
        <div className={styles.container}>
        <div className={styles.formWrapper}>
            <h1 className={styles.title}>Login</h1>
            
            <div className={styles.form}>
            {error && (
                <div className={styles.errorMessage}>
                {error}
                </div>
            )}
            
            <div className={styles.inputGroup}>
                <label htmlFor="email" className={styles.label}>
                Email Address
                </label>
                <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Enter your email"
                required
                />
            </div>

            <div className={styles.inputGroup}>
                <label htmlFor="password" className={styles.label}>
                Password
                </label>
                <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Enter your password"
                required
                />
            </div>

            <button
                type="submit"
                className={styles.submitButton}
                onClick={handleSubmit}
                disabled={isLoading}
            >
                {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
            </div>

            <div className={styles.signUpLink}>
            Don't have an account?{' '}
            <span
                className={styles.link}
                onClick={() => navigate('/register')}
            >
                Sign up to create an account
            </span>
            </div>
        </div>
        </div>
        <Footer/>
    </div>
  );
};

export default Login;