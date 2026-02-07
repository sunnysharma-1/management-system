'use client';

import { useState } from 'react';
import { TopHeader } from '@/components/top-header';
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
      <div className="px-8 pt-4 h-full flex flex-col">
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

      <div className="relative z-10 w-full h-full flex flex-col">
        {/* Top Header with Navigation */}
        <TopHeader onNavigate={setActiveItem} activeItem={activeItem} />

        {/* Main Content Area */}
        <div className="flex-1 w-full h-full overflow-hidden pt-20">
          {renderContent()}
        </div>
      </div>
    </main>
  );
}
