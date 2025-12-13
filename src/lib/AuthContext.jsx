import React, { createContext, useContext, useMemo } from 'react';

// יצירת הקונטקסט
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // הגדרת ערכים סטטיים - ללא שימוש בשרת חיצוני
  const value = useMemo(() => ({
    user: null,
    isAuthenticated: false,
    isLoadingAuth: false,
    isLoadingPublicSettings: false,
    authError: null,
    appPublicSettings: null,
    
    // פונקציות דמה (Mock) למניעת שגיאות
    logout: () => console.log('Mock logout'),
    navigateToLogin: () => console.log('Mock login redirect'),
    checkAppState: async () => console.log('Mock check state'),
  }), []);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};