import React, { useState } from 'react';
import { Language } from '../../types';
import './Login.css';

interface LoginProps {
  language: Language;
  onLogin: (userType: 'admin' | 'user', userEmail: string) => void;
  onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ language, onLogin, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    confirmPassword: '',
    address: '',
    area: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Admin credentials
  const ADMIN_EMAIL = 'summit_kw@hotmail.com';
  const ADMIN_PASSWORD = 'Ff91998910';

  const texts = {
    ar: {
      loginTitle: 'تسجيل الدخول',
      registerTitle: 'إنشاء حساب جديد',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      confirmPassword: 'تأكيد كلمة المرور',
      name: 'الاسم الكامل',
      phone: 'رقم الهاتف',
      address: 'العنوان',
      area: 'المحافظة',
      login: 'تسجيل الدخول',
      register: 'إنشاء حساب',
      emailPlaceholder: 'أدخل البريد الإلكتروني',
      passwordPlaceholder: 'أدخل كلمة المرور',
      confirmPasswordPlaceholder: 'أعد إدخال كلمة المرور',
      namePlaceholder: 'أدخل اسمك الكامل',
      phonePlaceholder: 'أدخل رقم الهاتف',
      addressPlaceholder: 'أدخل عنوانك بالتفصيل',
      areaPlaceholder: 'اختر المحافظة',
      switchToRegister: 'ليس لديك حساب؟ إنشاء حساب جديد',
      switchToLogin: 'لديك حساب؟ تسجيل الدخول',
      invalidCredentials: 'بيانات الدخول غير صحيحة',
      emailExists: 'البريد الإلكتروني مستخدم مسبقاً',
      passwordMismatch: 'كلمتا المرور غير متطابقتان',
      registrationSuccess: 'تم إنشاء الحساب بنجاح',
      welcome: 'مرحباً بك',
      adminWelcome: 'مرحباً بك في لوحة الإدارة',
      userWelcome: 'مرحباً بك في فكهاني',
      close: 'إغلاق',
      fillAllFields: 'يرجى ملء جميع الحقول',
      secureLogin: 'تسجيل دخول آمن',
      areas: [
        'العاصمة',
        'حولي',
        'الأحمدي',
        'الجهراء',
        'مبارك الكبير',
        'الفروانية'
      ]
    },
    en: {
      loginTitle: 'Login',
      registerTitle: 'Create New Account',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      name: 'Full Name',
      phone: 'Phone Number',
      address: 'Address',
      area: 'Area',
      login: 'Login',
      register: 'Sign Up',
      emailPlaceholder: 'Enter email address',
      passwordPlaceholder: 'Enter password',
      confirmPasswordPlaceholder: 'Re-enter password',
      namePlaceholder: 'Enter your full name',
      phonePlaceholder: 'Enter phone number',
      addressPlaceholder: 'Enter your detailed address',
      areaPlaceholder: 'Select area',
      switchToRegister: "Don't have an account? Sign up",
      switchToLogin: 'Have an account? Login',
      invalidCredentials: 'Invalid credentials',
      emailExists: 'Email already exists',
      passwordMismatch: 'Passwords do not match',
      registrationSuccess: 'Account created successfully',
      welcome: 'Welcome',
      adminWelcome: 'Welcome to Admin Panel',
      userWelcome: 'Welcome to Fakahani',
      close: 'Close',
      fillAllFields: 'Please fill all fields',
      secureLogin: 'Secure Login',
      areas: [
        'Capital',
        'Hawalli',
        'Ahmadi',
        'Jahra',
        'Mubarak Al-Kabeer',
        'Farwaniya'
      ]
    }
  };

  const currentTexts = texts[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (isLogin) {
      // Login logic
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if admin
      if (credentials.email === ADMIN_EMAIL && credentials.password === ADMIN_PASSWORD) {
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('userEmail', ADMIN_EMAIL);
        localStorage.setItem('userType', 'admin');
        localStorage.setItem('userName', 'مدير النظام');
        onLogin('admin', ADMIN_EMAIL);
        return;
      }

      // Check regular users from localStorage
      const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const user = users.find((u: any) => u.email === credentials.email && u.password === credentials.password);

      if (user) {
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userType', 'user');
        localStorage.setItem('userName', user.name);
        onLogin('user', user.email);
      } else {
        setError(currentTexts.invalidCredentials);
      }
    } else {
      // Registration logic
      if (!credentials.name || !credentials.email || !credentials.password || !credentials.phone || !credentials.address || !credentials.area) {
        setError(currentTexts.fillAllFields);
        setIsLoading(false);
        return;
      }

      if (credentials.password !== credentials.confirmPassword) {
        setError(currentTexts.passwordMismatch);
        setIsLoading(false);
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if email already exists
      const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      if (users.find((u: any) => u.email === credentials.email) || credentials.email === ADMIN_EMAIL) {
        setError(currentTexts.emailExists);
        setIsLoading(false);
        return;
      }

      // Register new user
      const newUser = {
        id: Date.now(),
        name: credentials.name,
        email: credentials.email,
        password: credentials.password,
        phone: credentials.phone,
        address: credentials.address,
        area: credentials.area,
        registeredAt: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem('registeredUsers', JSON.stringify(users));

      // Auto login after registration
      localStorage.setItem('userLoggedIn', 'true');
      localStorage.setItem('userEmail', newUser.email);
      localStorage.setItem('userType', 'user');
      localStorage.setItem('userName', newUser.name);
      onLogin('user', newUser.email);
    }

    setIsLoading(false);
  };

  return (
    <div className="login-overlay">
      <div className="login-container">
        <div className="login-header">
          <div className="logo-section">
            <div className="login-logo-container">
              <img 
                src="/images/logo.jpeg" 
                alt="فكهاني الكويت"
                className="login-logo"
                onError={(e) => {
                  // Try PNG if JPEG fails
                  if (e.currentTarget.src.includes('.jpeg')) {
                    e.currentTarget.src = '/images/logo.png';
                  } else {
                    // Fallback to text if both fail
                    e.currentTarget.style.display = 'none';
                    const fallbackElement = e.currentTarget.nextElementSibling as HTMLElement;
                    if (fallbackElement) {
                      fallbackElement.style.display = 'block';
                    }
                  }
                }}
              />
              <h1 className="site-name fallback-login-title" style={{display: 'none'}}>🥭 فكهاني</h1>
            </div>
            <p className="login-subtitle">{currentTexts.secureLogin}</p>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="login-content">
          <h2>{isLogin ? currentTexts.loginTitle : currentTexts.registerTitle}</h2>

          {error && (
            <div className="error-message">
              <span>⚠️ {error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="name">{currentTexts.name}</label>
                <input
                  type="text"
                  id="name"
                  value={credentials.name}
                  onChange={(e) => setCredentials({...credentials, name: e.target.value})}
                  placeholder={currentTexts.namePlaceholder}
                  required={!isLogin}
                  className="form-input"
                />
              </div>
            )}

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

            {!isLogin && (
              <div className="form-group">
                <label htmlFor="phone">{currentTexts.phone}</label>
                <input
                  type="tel"
                  id="phone"
                  value={credentials.phone}
                  onChange={(e) => setCredentials({...credentials, phone: e.target.value})}
                  placeholder={currentTexts.phonePlaceholder}
                  required={!isLogin}
                  className="form-input"
                />
              </div>
            )}

            {!isLogin && (
              <>
                <div className="form-group">
                  <label htmlFor="area">{currentTexts.area}</label>
                  <select
                    id="area"
                    value={credentials.area}
                    onChange={(e) => setCredentials({...credentials, area: e.target.value})}
                    required={!isLogin}
                    className="form-input"
                  >
                    <option value="">{currentTexts.areaPlaceholder}</option>
                    {currentTexts.areas.map((area, index) => (
                      <option key={index} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="address">{currentTexts.address}</label>
                  <textarea
                    id="address"
                    value={credentials.address}
                    onChange={(e) => setCredentials({...credentials, address: e.target.value})}
                    placeholder={currentTexts.addressPlaceholder}
                    required={!isLogin}
                    className="form-input"
                    rows={3}
                  />
                </div>
              </>
            )}

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

            {!isLogin && (
              <div className="form-group">
                <label htmlFor="confirmPassword">{currentTexts.confirmPassword}</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={credentials.confirmPassword}
                  onChange={(e) => setCredentials({...credentials, confirmPassword: e.target.value})}
                  placeholder={currentTexts.confirmPasswordPlaceholder}
                  required={!isLogin}
                  className="form-input"
                />
              </div>
            )}

            <button 
              type="submit" 
              className={`login-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading-spinner">⏳</span>
              ) : (
                <span>
                  {isLogin ? '🔑' : '👤'} {isLogin ? currentTexts.login : currentTexts.register}
                </span>
              )}
            </button>
          </form>

          <button 
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setCredentials({
                email: '',
                password: '',
                name: '',
                phone: '',
                confirmPassword: '',
                address: '',
                area: ''
              });
            }}
            className="switch-mode-btn"
          >
            {isLogin ? currentTexts.switchToRegister : currentTexts.switchToLogin}
          </button>
        </div>

        <div className="login-footer">
          <p>© 2025 فكهاني - {currentTexts.welcome}</p>
        </div>
      </div>
    </div>
  );
};

export default Login;