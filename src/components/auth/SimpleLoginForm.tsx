import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SimpleLoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted!');
    console.log('Email:', email);
    console.log('Password:', password);
    
    // Simple check
    if (email === 'pm@example.com' && password === 'password123') {
      console.log('Login successful!');
      localStorage.setItem('token', 'mock-token-123');
      localStorage.setItem('user', JSON.stringify({
        id: '1',
        email: 'pm@example.com',
        name: 'Portfolio Manager',
        role: 'portfolio_manager'
      }));
      navigate('/dashboard');
    } else {
      console.error('Invalid credentials!');
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      backgroundColor: '#f3f4f6'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h1 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Citalf Login</h1>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              Email:
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  marginTop: '0.25rem'
                }}
                required
              />
            </label>
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              Password:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  marginTop: '0.25rem'
                }}
                required
              />
            </label>
          </div>
          
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#0066ff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Sign In
          </button>
        </form>
        
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          backgroundColor: '#e0f2fe',
          borderRadius: '4px'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>Demo Credentials:</p>
          <p style={{ margin: '0.25rem 0' }}>Email: pm@example.com</p>
          <p style={{ margin: '0.25rem 0' }}>Password: password123</p>
        </div>
        
        <button
          onClick={() => {
            setEmail('pm@example.com');
            setPassword('password123');
          }}
          style={{
            width: '100%',
            marginTop: '0.5rem',
            padding: '0.5rem',
            backgroundColor: '#f3f4f6',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Fill Demo Credentials
        </button>
      </div>
    </div>
  );
};

export default SimpleLoginForm;