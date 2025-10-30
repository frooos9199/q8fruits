import React from 'react';
import { Language } from '../../types';
import './UserProfile.css';

interface UserProfileProps {
  language: Language;
  userType: 'admin' | 'user';
  userName: string;
  userEmail: string;
  onLogout: () => void;
  onAdminPanel?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({
  language,
  userType,
  userName,
  userEmail,
  onLogout,
  onAdminPanel
}) => {
  const texts = {
    ar: {
      welcome: 'مرحباً',
      admin: 'مدير النظام',
      user: 'عضو',
      adminPanel: 'لوحة الإدارة',
      logout: 'تسجيل خروج',
      profile: 'الملف الشخصي',
      orders: 'طلباتي',
      settings: 'الإعدادات'
    },
    en: {
      welcome: 'Welcome',
      admin: 'Administrator',
      user: 'Member',
      adminPanel: 'Admin Panel',
      logout: 'Logout',
      profile: 'Profile',
      orders: 'My Orders',
      settings: 'Settings'
    }
  };

  const currentTexts = texts[language];

  return (
    <div className="user-profile-dropdown">
      <div className="profile-header">
        <div className="user-avatar">
          {userType === 'admin' ? '👑' : '👤'}
        </div>
        <div className="user-info">
          <h4>{currentTexts.welcome}, {userName}</h4>
          <p className={`user-type ${userType}`}>
            {userType === 'admin' ? currentTexts.admin : currentTexts.user}
          </p>
          <span className="user-email">{userEmail}</span>
        </div>
      </div>

      <div className="profile-actions">
        {userType === 'admin' && onAdminPanel && (
          <button className="profile-btn admin-btn" onClick={onAdminPanel}>
            ⚙️ {currentTexts.adminPanel}
          </button>
        )}
        
        <button className="profile-btn">
          👤 {currentTexts.profile}
        </button>
        
        <button className="profile-btn">
          📦 {currentTexts.orders}
        </button>
        
        <button className="profile-btn">
          ⚙️ {currentTexts.settings}
        </button>
        
        <button className="profile-btn logout-btn" onClick={onLogout}>
          🚪 {currentTexts.logout}
        </button>
      </div>
    </div>
  );
};

export default UserProfile;