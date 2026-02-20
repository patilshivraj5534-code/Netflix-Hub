import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

const USERS_KEY = 'nf_users';
const CURRENT_USER_KEY = 'nf_current_user';

function readUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function readCurrentUser() {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeCurrentUser(user) {
  if (!user) {
    localStorage.removeItem(CURRENT_USER_KEY);
  } else {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const existing = readCurrentUser();
    if (existing) {
      setUser(existing);
    }
  }, []);

  const signup = (payload) => {
    const users = readUsers();
    const exists = users.find((u) => u.email.toLowerCase() === payload.email.toLowerCase());
    if (exists) {
      throw new Error('User with this email already exists.');
    }
    const newUser = {
      id: crypto.randomUUID(),
      email: payload.email,
      password: payload.password,
      name: payload.name
    };
    const updated = [...users, newUser];
    writeUsers(updated);
    writeCurrentUser(newUser);
    setUser(newUser);
  };

  const login = ({ email, password }) => {
    const users = readUsers();
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) {
      throw new Error('Invalid email or password.');
    }
    writeCurrentUser(found);
    setUser(found);
  };

  const logout = () => {
    writeCurrentUser(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      signup,
      login,
      logout
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}

