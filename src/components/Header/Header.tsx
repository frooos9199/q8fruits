import React from 'react';
import { Language } from '../../types';
import UserProfile from '../UserProfile/UserProfile.tsx';
import './Header.css';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  cartItemsCount: number;
  onCartClick: () => void;
  onAdminClick: () => void;
  onLoginClick: () => void;
  isLoggedIn: boolean;
  userType?: 'admin' | 'user';
  userName?: string;
  userEmail?: string;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  cartItemsCount,
  onCartClick,
  onAdminClick,
  onLoginClick,
  isLoggedIn,
  userType,
  userName,
  userEmail,
  onLogout,
}) => {
  const [clickCount, setClickCount] = React.useState(0);
  const [lastClickTime, setLastClickTime] = React.useState(0);
  const [showProfile, setShowProfile] = React.useState(false);

  const handleTitleClick = () => {
    if (!isLoggedIn) {
      const now = Date.now();
      if (now - lastClickTime < 500) { // Less than 500ms between clicks
        setClickCount(prev => prev + 1);
        if (clickCount >= 4) { // 5 rapid clicks total
          onLoginClick();
          setClickCount(0);
        }
      } else {
        setClickCount(1);
      }
      setLastClickTime(now);
      
      // Reset counter after 2 seconds of inactivity
      setTimeout(() => {
        setClickCount(0);
      }, 2000);
    }
  };

  const texts = {
    ar: {
      title: 'فكهاني الكويت',
      subtitle: 'أفضل الفواكه والخضار الطازجة',
      phone: '98899426',
      cart: 'السلة',
      admin: 'الإدارة',
      login: 'تسجيل دخول'
    },
    en: {
      title: 'Fakahani Kuwait',
      subtitle: 'Fresh Fruits & Vegetables',
      phone: '98899426',
      cart: 'Cart',
      admin: 'Admin Panel',
      login: 'Login'
    }
  };

  const currentTexts = texts[language];

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo and Title */}
        <div className="header-brand" onClick={handleTitleClick} style={{cursor: 'pointer'}}>
          <div className="logo-container">
            <img 
              src="/images/logo.jpeg" 
              alt={currentTexts.title}
              className="header-logo"
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
            <h1 className="header-title fallback-title" style={{display: 'none'}}>{currentTexts.title}</h1>
          </div>
          <p className="header-subtitle">{currentTexts.subtitle}</p>
          <div className="header-phone">
            <span className="phone-icon">📞</span>
            <span className="phone-number">{currentTexts.phone}</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="header-nav">
          {/* Language Toggle */}
          <button
            className="language-toggle"
            onClick={() => onLanguageChange(language === 'ar' ? 'en' : 'ar')}
          >
            {language === 'ar' ? 'EN' : 'عربي'}
          </button>

          {/* Cart Button */}
          <button className="cart-button" onClick={onCartClick}>
            <span className="cart-icon">🛒</span>
            <span className="cart-text">{currentTexts.cart}</span>
            {cartItemsCount > 0 && (
              <span className="cart-count">{cartItemsCount}</span>
            )}
          </button>

          {/* User Authentication Section */}
          {isLoggedIn ? (
            <div className="user-section">
              <button 
                className="user-button"
                onClick={() => setShowProfile(!showProfile)}
              >
                <span className="user-icon">
                  {userType === 'admin' ? '👑' : '👤'}
                </span>
                <span className="user-name">{userName}</span>
                <span className="dropdown-arrow">⏷</span>
              </button>
              
              {showProfile && (
                <div className="profile-dropdown">
                  <UserProfile
                    language={language}
                    userType={userType!}
                    userName={userName!}
                    userEmail={userEmail!}
                    onLogout={() => {
                      setShowProfile(false);
                      onLogout();
                    }}
                    onAdminPanel={userType === 'admin' ? () => {
                      setShowProfile(false);
                      onAdminClick();
                    } : undefined}
                  />
                </div>
              )}
            </div>
          ) : (
            <button className="login-button" onClick={onLoginClick}>
              <span className="login-icon">🔑</span>
              <span className="login-text">{currentTexts.login}</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;