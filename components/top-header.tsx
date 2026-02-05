'use client';

import { Bell, Settings, LogOut, User } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from './providers/auth-context';

export function TopHeader() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user, role, logout } = useAuth();

  if (!user) return null; // Or return a login button/placeholder

  return (
    <div className="fixed top-0 right-0 left-72 h-16 bg-gradient-to-r from-background/95 via-background/90 to-background/85 border-b border-primary/20 backdrop-blur-lg flex items-center justify-between px-8 shadow-lg shadow-primary/10 z-40">
      {/* Left side - Search and Info */}
      <div className="flex items-center gap-4">
        <div className="hidden md:block">
          <p className="text-sm text-accent">Welcome back, Admin!</p>
          <p className="text-xs text-muted-foreground">HRM System Status: Active</p>
        </div>
      </div>

      {/* Right side - Notifications and Profile */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <button className="relative p-2 text-muted-foreground hover:text-accent transition-all duration-300 hover:bg-primary/10 rounded-lg border border-transparent hover:border-accent/30 group">
          <Bell className="w-5 h-5 group-hover:animate-bounce" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full animate-pulse" />
        </button>

        {/* Settings */}
        <button className="p-2 text-muted-foreground hover:text-primary transition-all duration-300 hover:bg-primary/10 rounded-lg border border-transparent hover:border-primary/30">
          <Settings className="w-5 h-5 hover:rotate-90 transition-transform" />
        </button>

        {/* Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 px-3 py-1 hover:bg-primary/10 rounded-lg transition-all duration-300 border border-transparent hover:border-primary/30"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg shadow-primary/30">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="hidden sm:block text-sm font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{user.name}</span>
          </button>

          {/* Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-card/95 border border-primary/30 rounded-lg shadow-2xl shadow-primary/20 animate-slide-down backdrop-blur-md">
              <div className="p-4 border-b border-primary/20">
                <p className="text-sm font-semibold text-foreground">{user.name}</p>
                <p className="text-xs text-accent">{role?.name}</p>
              </div>
              <div className="p-2 space-y-1">
                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:text-primary hover:bg-primary/10 rounded transition-all duration-300 border border-transparent hover:border-primary/30">
                  <User className="w-4 h-4" />
                  Profile Settings
                </button>
                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:text-primary hover:bg-primary/10 rounded transition-all duration-300 border border-transparent hover:border-primary/30">
                  <Settings className="w-4 h-4" />
                  System Settings
                </button>
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:text-accent hover:bg-accent/10 rounded transition-all duration-300 border border-transparent hover:border-accent/30"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
