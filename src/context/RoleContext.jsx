import React, { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../utils/constants';
import { getStorageItem, setStorageItem } from '../services/storage';

const RoleContext = createContext();

export function RoleProvider({ children }) {
  const [role, setRole] = useState(() => {
    return getStorageItem(STORAGE_KEYS.ROLE, 'student');
  });

  // Simulated student session profile for seamless UX testing
  const [studentProfile, setStudentProfile] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@student.campus.edu',
    rollNo: 'CS-2023-042',
    department: 'Computer Science & Engineering',
    year: '3rd Year',
  });

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.ROLE, role);
  }, [role]);

  const toggleRole = () => {
    setRole((prev) => (prev === 'student' ? 'admin' : 'student'));
  };

  const switchToStudent = () => setRole('student');
  const switchToAdmin = () => setRole('admin');

  return (
    <RoleContext.Provider
      value={{
        role,
        isAdmin: role === 'admin',
        isStudent: role === 'student',
        toggleRole,
        switchToStudent,
        switchToAdmin,
        studentProfile,
        setStudentProfile,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
