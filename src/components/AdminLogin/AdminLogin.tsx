import React, { useState } from 'react';
import { Language } from '../../types';
import './AdminLogin.css';

interface AdminLoginProps {
  language: Language;
  onLogin: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ language, onLogin }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Admin credentials
  const ADMIN_EMAIL = 'summit_kw@hotmail.com';
  const ADMIN_PASSWORD = 'Ff91998910';

  const texts = {
    ar: {
      title: 'تسجيل دخول المشرف',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      login: 'تسجيل الدخول',
      emailPlaceholder: 'أدخل البريد الإلكتروني',
      passwordPlaceholder: 'أدخل كلمة المرور',
      invalidCredentials: 'بيانات الدخول غير صحيحة',
      welcome: 'مرحباً بك في لوحة الإدارة',
      enterCredentials: 'يرجى إدخال بيانات المشرف للدخول',
      backToSite: 'العودة للموقع',
      adminPanel: 'لوحة الإدارة',
      secureLogin: 'تسجيل دخول آمن'
    },
    en: {
      title: 'Admin Login',
      email: 'Email',
      password: 'Password',
      login: 'Login',
      emailPlaceholder: 'Enter email address',
      passwordPlaceholder: 'Enter password',
      invalidCredentials: 'Invalid credentials',
      welcome: 'Welcome to Admin Panel',
      enterCredentials: 'Please enter admin credentials to continue',
      backToSite: 'Back to Site',
      adminPanel: 'Admin Panel',
      secureLogin: 'Secure Login'
    }
  };

  const currentTexts = texts[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate loading time
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (credentials.email === ADMIN_EMAIL && credentials.password === ADMIN_PASSWORD) {
      // Store login state
      localStorage.setItem('adminLoggedIn', 'true');
      localStorage.setItem('adminEmail', ADMIN_EMAIL);
      onLogin();
    } else {
      setError(currentTexts.invalidCredentials);
    }

    setIsLoading(false);
  };

  const handleBackToSite = () => {
    window.location.href = '/';
  };

  return (
    <div className="admin-login-overlay">
      <div className="admin-login-container">
        <div className="login-header">
          <div className="logo-section">
            <h1 className="site-name">🥭 فكهاني</h1>
            <p className="admin-subtitle">{currentTexts.adminPanel}</p>
          </div>
          <div className="secure-badge">
            <span>🔒 {currentTexts.secureLogin}</span>
          </div>
        </div>

        <div className="login-content">
          <h2>{currentTexts.title}</h2>
          <p className="login-description">{currentTexts.enterCredentials}</p>

          {error && (
            <div className="error-message">
              <span>⚠️ {error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">{currentTexts.email}</label>
              <input
                type="email"
                id="email"
                value={credentials.email}
                onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                placeholder={currentTexts.emailPlaceholder}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">{currentTexts.password}</label>
              <input
                type="password"
                id="password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                placeholder={currentTexts.passwordPlaceholder}
                required
                className="form-input"
              />
            </div>

            <button 
              type="submit" 
              className={`login-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading-spinner">⏳</span>
              ) : (
                <span>🔑 {currentTexts.login}</span>
              )}
            </button>
          </form>

          <button 
            onClick={handleBackToSite}
            className="back-to-site-btn"
          >
            ← {currentTexts.backToSite}
          </button>
        </div>

        <div className="login-footer">
          <p>© 2025 فكهاني - {currentTexts.welcome}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;