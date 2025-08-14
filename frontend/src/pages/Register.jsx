import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import styles from '../styles/Register.module.css';
import Header from "../components/Header";
import Footer from "../components/Footer";

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
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
      const response = await axiosInstance.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      console.log('Registration successful:', response.data);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      navigate('/login');
      
    } catch (err) {
      console.error('Registration error:', err);
      setError(
        err.response?.data?.message || 
        'Registration failed. Please try again.'
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
          <h1 className={styles.title}>Create Account</h1>
          
          <div className={styles.form}>
            {error && (
              <div className={styles.errorMessage}>
                {error}
              </div>
            )}
            
            <div className={styles.inputGroup}>
              <label htmlFor="name" className={styles.label}>
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Enter your full name"
                required
              />
            </div>

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
                placeholder="Create a password"
                required
              />
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>

          <div className={styles.signInLink}>
            Already have an account?{' '}
            <span
              className={styles.link}
              onClick={() => navigate('/login')}
            >
              Click here to sign in
            </span>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default Register;