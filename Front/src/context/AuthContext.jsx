import React from 'react'
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ROLES } from './roles'

// Roles disponibles en el sistema movidos a roles.js

const AuthContext = createContext(null);

const USERS_STORAGE_KEY = 'users';
const SESSION_STORAGE_KEY = 'session';

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  });
  const [session, setSession] = useState(() => {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (session) {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }, [session]);

  useEffect(() => {
    if (!users || users.length === 0) {
      setUsers([]);
    }
  }, []);

  // Migración: si existen usuarios con rol 'VENDEDOR' en almacenamiento previo, promoverlos a ADMIN
  useEffect(() => {
    setUsers((prev) => prev.map((u) => (u.rol === 'VENDEDOR' ? { ...u, rol: ROLES.ADMIN } : u)))
  }, [])

  const login = async (email, password) => {
    try {
      const resp = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernameOrEmail: email, password })
      });
      if (!resp.ok) return { ok: false, error: 'Credenciales inválidas' };
      const data = await resp.json();
      setSession({ token: data.token, username: data.username, nombre: data.nombre, email: data.email, rol: data.role });
      return { ok: true };
    } catch {
      return { ok: false, error: 'Error de red' };
    }
  };

  const logout = () => {
    setSession(null);
  };

  const register = async (payload) => {
    try {
      const resp = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: payload.nombre, email: payload.email, username: payload.email, password: payload.password })
      });
      if (!resp.ok) return { ok: false, error: 'Registro inválido' };
      const data = await resp.json();
      setSession({ token: data.token, username: data.username, nombre: data.nombre, email: data.email, rol: data.role });
      return { ok: true };
    } catch {
      return { ok: false, error: 'Error de red' };
    }
  };

  const refreshSession = async () => {
    if (!session?.token) return { ok: false };
    try {
      const resp = await fetch('http://localhost:8080/api/auth/refresh', {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.token}` }
      });
      if (!resp.ok) return { ok: false };
      const data = await resp.json();
      const newToken = data.token;
      let me = null;
      try {
        const meResp = await fetch('http://localhost:8080/api/users/me', {
          headers: { Authorization: `Bearer ${newToken}` }
        });
        if (meResp.ok) {
          me = await meResp.json();
        }
      } catch { me = null }
      setSession({
        token: newToken,
        username: me?.username || data.username,
        nombre: me?.nombre || data.nombre,
        apellidos: me?.apellidos || session?.apellidos || '',
        email: me?.email || data.email,
        rol: me?.role || data.role,
        direccion: me?.direccion || session?.direccion || '',
        region: me?.region || session?.region || '',
        comuna: me?.comuna || session?.comuna || '',
        fechaNacimiento: me?.fechaNacimiento || session?.fechaNacimiento || '',
      });
      return { ok: true };
    } catch {
      return { ok: false };
    }
  };

  useEffect(() => {
    if (session?.token) {
      refreshSession();
    }
  }, []);

  const updateUser = (id, changes) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...changes } : u)));
    if (session && session.id === id) {
      setSession({ ...session, ...changes });
    }
    return { ok: true };
  };

  const deleteUser = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    if (session && session.id === id) setSession(null);
    return { ok: true };
  };

  const updateProfile = async (changes) => {
    try {
      const resp = await fetch('http://localhost:8080/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.token}`,
        },
        body: JSON.stringify({
          nombre: changes.nombre,
          apellidos: changes.apellidos,
          email: changes.email,
          direccion: changes.direccion,
          region: changes.region,
          comuna: changes.comuna,
          fechaNacimiento: changes.fechaNacimiento,
        })
      })
      if (!resp.ok) return { ok: false }
      const data = await resp.json()
      setSession((prev) => ({
        ...prev,
        nombre: data.nombre,
        apellidos: data.apellidos || prev.apellidos,
        email: data.email,
        direccion: data.direccion || prev.direccion,
        region: data.region || prev.region,
        comuna: data.comuna || prev.comuna,
        fechaNacimiento: data.fechaNacimiento || prev.fechaNacimiento,
      }))
      return { ok: true }
    } catch {
      return { ok: false }
    }
  }

  const value = useMemo(() => ({
    user: session,
    users,
    login,
    logout,
    register,
    roles: ROLES,
    updateUser,
    deleteUser,
    updateProfile,
    refreshSession,
  }), [session, users]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    return {
      user: null,
      users: [],
      login: async () => ({ ok: false }),
      logout: () => {},
      register: async () => ({ ok: false }),
      roles: ROLES,
      updateUser: () => ({ ok: false }),
      deleteUser: () => ({ ok: false }),
      updateProfile: async () => ({ ok: false }),
      refreshSession: async () => ({ ok: false }),
    };
  }
  return ctx;
}