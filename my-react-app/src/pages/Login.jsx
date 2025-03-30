import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_CONFIG, buildUrl, API_URL, isDevelopment } from '../config';
import Header from '../components/Header';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const endpoint = isSignUp ? 'api/auth/signup' : 'api/auth/login';
      const url = buildUrl(endpoint);
      
      // Debug logging
      console.log('Debug Info:');
      console.log('- API_URL:', API_URL);
      console.log('- Endpoint:', endpoint);
      console.log('- Final URL:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': window.location.origin
        },
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/categories');
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Connection failed. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <>
      <Header />
      <main className="main">
        <section className="login-section active">
          <div className="login-box">
            <h2>{isSignUp ? 'Sign Up' : 'Login'}</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit} className="login-form">
              {isSignUp && (
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    required={isSignUp}
                  />
                </div>
              )}
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="button login-button">
                {isSignUp ? 'Sign Up' : 'Login'}
              </button>
            </form>
            <p className="toggle-form">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <span onClick={() => setIsSignUp(!isSignUp)}>
                {isSignUp ? 'Login' : 'Sign Up'}
              </span>
            </p>
          </div>
        </section>
      </main>
    </>
  );
}

export default Login; 