import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserByEmail, getUserByUsername, createUser } from '../database/queries';
import { initDB, waitForDB } from '../database/db';

interface User {
  username: string;
  name: string;
  email: string;
  avatar: null | string;
  followers: number;
  following: number;
  posts: number;
  membershipType: string;
  membershipExpiry: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AUTH_STORAGE_KEY = '@bhub_logged_in_user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount: initialise DB, then restore persisted login
  useEffect(() => {
    const bootstrap = async () => {
      try {
        await initDB();
        const savedUsername = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        if (savedUsername) {
          const dbUser = await getUserByUsername(savedUsername);
          if (dbUser) {
            setUser({
              username: dbUser.username,
              name: dbUser.name,
              email: dbUser.email,
              avatar: dbUser.avatar,
              followers: dbUser.followers,
              following: dbUser.following,
              posts: dbUser.posts,
              membershipType: dbUser.membershipType,
              membershipExpiry: dbUser.membershipExpiry,
            });
            setToken(dbUser.username);
          }
        }
      } catch (err) {
        console.error('Auth bootstrap error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    bootstrap();
  }, []);

  const refreshUser = async () => {
    if (!user?.username) return;
    const dbUser = await getUserByUsername(user.username);
    if (dbUser) {
      setUser({
        username: dbUser.username,
        name: dbUser.name,
        email: dbUser.email,
        avatar: dbUser.avatar,
        followers: dbUser.followers,
        following: dbUser.following,
        posts: dbUser.posts,
        membershipType: dbUser.membershipType,
        membershipExpiry: dbUser.membershipExpiry,
      });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await waitForDB(); // ensure DB is fully initialized
      console.log('[Auth] Attempting login for:', email);
      const dbUser = await getUserByEmail(email);
      if (!dbUser) {
        console.log('[Auth] No user found for email:', email);
        return { success: false, message: 'User not found. Try: clement@bhub.app / 123456' };
      }
      if (dbUser.password !== password) {
        return { success: false, message: 'Invalid password' };
      }
      console.log('[Auth] Login success for:', dbUser.username);
      setUser({
        username: dbUser.username,
        name: dbUser.name,
        email: dbUser.email,
        avatar: dbUser.avatar,
        followers: dbUser.followers,
        following: dbUser.following,
        posts: dbUser.posts,
        membershipType: dbUser.membershipType,
        membershipExpiry: dbUser.membershipExpiry,
      });
      setToken(dbUser.username);
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, dbUser.username);
      return { success: true };
    } catch (err: any) {
      console.error('[Auth] Login error:', err);
      return { success: false, message: err.message || 'Login failed' };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      await waitForDB(); // ensure DB is fully initialized
      console.log('[Auth] Attempting registration for:', email);
      // Check if email already taken
      const existing = await getUserByEmail(email);
      if (existing) {
        return { success: false, message: 'Email already registered' };
      }
      // Generate username from name
      const username = name.toLowerCase().replace(/[^a-z0-9]/g, '') + '_' + Math.floor(Math.random() * 1000);
      console.log('[Auth] Creating user:', username);
      await createUser(username, name, email, password);
      console.log('[Auth] Registration success for:', username);

      setUser({
        username,
        name,
        email,
        avatar: null,
        followers: 0,
        following: 0,
        posts: 0,
        membershipType: 'Standard Pass',
        membershipExpiry: '2027-01-01',
      });
      setToken(username);
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, username);
      return { success: true };
    } catch (err: any) {
      console.error('[Auth] Registration error:', err);
      return { success: false, message: err.message || 'Registration failed' };
    }
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
