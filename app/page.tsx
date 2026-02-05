'use client';

import { useState } from 'react';
import { GlassNavigation } from '@/components/layout/glass-navigation';
import { TopHeader } from '@/components/top-header'; // Keep for now or replace later
import { BentoDashboard } from '@/components/dashboard/bento-dashboard';
import { ModuleContent } from '@/components/module-content';
import { LoginPage } from '@/components/login-page';
import { useAuth } from '@/components/providers/auth-context';

export default function Home() {
  const [activeItem, setActiveItem] = useState('dashboard');
  const { user } = useAuth();

  if (!user) {
    return <LoginPage />;
  }

  const renderContent = () => {
    if (activeItem === 'dashboard') {
      return <BentoDashboard onNavigate={setActiveItem} />;
    }
    return (
      <div className="pl-24 pt-4 h-full flex flex-col">
        <ModuleContent activeItem={activeItem} />
      </div>
    );
  };

  return (
    <main className="flex h-screen bg-background text-foreground overflow-hidden font-sans selection:bg-primary selection:text-white">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 w-full h-full flex">
        <GlassNavigation onNavigate={setActiveItem} activeItem={activeItem} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col w-full h-full overflow-hidden">
          {/* Note: We might remove TopHeader if we want full clean look, but keeping functionality for now */}
          {/* <TopHeader />  <-- Commented out to test full clean look first, can restore if needed */}
          {renderContent()}
        </div>
      </div>
    </main>
  );
}
