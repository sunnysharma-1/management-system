'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

export interface Permission {
  id: string; // navigation ID
}

export interface Role {
  id: string;
  name: string;
  permissions: string[]; // List of allowed navigation IDs
  isSystem?: boolean; // System roles cannot be deleted
}

export interface User {
  id: string;
  username: string;
  name: string;
  password?: string; // Only used for initial checking, not stored in state usually, but for mock we need it
  roleId: string;
}

interface AuthContextType {
  user: User | null;
  role: Role | null;
  allUsers: User[];
  allRoles: Role[];
  login: (username: string, password: string) => boolean;
  logout: () => void;
  createRole: (role: Role) => void;
  updateRole: (role: Role) => void;
  deleteRole: (roleId: string) => void;
  createUser: (user: User) => void;
  updateUser: (user: User) => void;
  deleteUser: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MASTER_ROLE_ID = 'master-role';
const ADMIN_USER_ID = 'admin-user';

const INITIAL_ROLES: Role[] = [
  {
    id: MASTER_ROLE_ID,
    name: 'Master Admin',
    permissions: ['ALL'], // Special keyword for full access
    isSystem: true,
  },
  {
    id: 'employee-role',
    name: 'Employee',
    permissions: ['dashboard', 'employee', 'mis'],
    isSystem: false,
  }
];

const INITIAL_USERS: User[] = [
  {
    id: ADMIN_USER_ID,
    username: 'admin',
    name: 'System Master',
    password: 'admin', // Demo password
    roleId: MASTER_ROLE_ID,
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [allRoles, setAllRoles] = useState<Role[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const router = useRouter();

  // Load data from localStorage on mount
  useEffect(() => {
    const storedRoles = localStorage.getItem('hrm_roles');
    const storedUsers = localStorage.getItem('hrm_users');
    const storedSession = localStorage.getItem('hrm_session_user');

    if (storedRoles) {
      setAllRoles(JSON.parse(storedRoles));
    } else {
      setAllRoles(INITIAL_ROLES);
      localStorage.setItem('hrm_roles', JSON.stringify(INITIAL_ROLES));
    }

    if (storedUsers) {
      setAllUsers(JSON.parse(storedUsers));
    } else {
      setAllUsers(INITIAL_USERS);
      localStorage.setItem('hrm_users', JSON.stringify(INITIAL_USERS));
    }

    if (storedSession) {
      const sessionUser = JSON.parse(storedSession);
      setUser(sessionUser);
      // Find role for session user
      // We need to wait for roles to be set, but in this synchronous block we might need to look at storedRoles or INITIAL_ROLES
      const currentRoles = storedRoles ? JSON.parse(storedRoles) : INITIAL_ROLES;
      const userRole = currentRoles.find((r: Role) => r.id === sessionUser.roleId);
      setRole(userRole || null);
    }
  }, []);

  const login = (username: string, password: string) => {
    const foundUser = allUsers.find(u => u.username === username && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      const userRole = allRoles.find(r => r.id === foundUser.roleId);
      setRole(userRole || null);
      localStorage.setItem('hrm_session_user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem('hrm_session_user');
    // Force reload to clear any state
    window.location.reload(); 
  };

  const createRole = (newRole: Role) => {
    const updatedRoles = [...allRoles, newRole];
    setAllRoles(updatedRoles);
    localStorage.setItem('hrm_roles', JSON.stringify(updatedRoles));
  };

  const updateRole = (updatedRole: Role) => {
    const updatedRoles = allRoles.map(r => r.id === updatedRole.id ? updatedRole : r);
    setAllRoles(updatedRoles);
    localStorage.setItem('hrm_roles', JSON.stringify(updatedRoles));
    
    // Update current role if it was modified
    if (role?.id === updatedRole.id) {
        setRole(updatedRole);
    }
  };
  
  const deleteRole = (roleId: string) => {
      const updatedRoles = allRoles.filter(r => r.id !== roleId);
      setAllRoles(updatedRoles);
      localStorage.setItem('hrm_roles', JSON.stringify(updatedRoles));
  }

  const createUser = (newUser: User) => {
    const updatedUsers = [...allUsers, newUser];
    setAllUsers(updatedUsers);
    localStorage.setItem('hrm_users', JSON.stringify(updatedUsers));
  };

  const updateUser = (updatedUser: User) => {
    const updatedUsers = allUsers.map(u => u.id === updatedUser.id ? updatedUser : u);
    setAllUsers(updatedUsers);
    localStorage.setItem('hrm_users', JSON.stringify(updatedUsers));
    
    // Update current user if it was modified
    if (user?.id === updatedUser.id) {
        setUser(updatedUser);
        localStorage.setItem('hrm_session_user', JSON.stringify(updatedUser));
        
        // Also update role reference if changed
        const newRole = allRoles.find(r => r.id === updatedUser.roleId);
        setRole(newRole || null);
    }
  };
  
  const deleteUser = (userId: string) => {
      const updatedUsers = allUsers.filter(u => u.id !== userId);
      setAllUsers(updatedUsers);
      localStorage.setItem('hrm_users', JSON.stringify(updatedUsers));
  }


  return (
    <AuthContext.Provider value={{ 
        user, 
        role, 
        allUsers, 
        allRoles, 
        login, 
        logout,
        createRole,
        updateRole,
        deleteRole,
        createUser,
        updateUser,
        deleteUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
