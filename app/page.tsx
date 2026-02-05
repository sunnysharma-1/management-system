'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { TopHeader } from '@/components/top-header';
import { DashboardContent } from '@/components/dashboard-content';
import { ModuleContent } from '@/components/module-content';
import { LoginPage } from '@/components/login-page';
import { navigationData } from '@/lib/navigation';
import { useAuth } from '@/components/providers/auth-context';

export default function Home() {
  const [activeItem, setActiveItem] = useState('dashboard');
  const { user } = useAuth();

  if (!user) {
    return <LoginPage />;
  }

  const renderContent = () => {
    if (activeItem === 'dashboard') {
      return <DashboardContent />;
    }
    return <ModuleContent activeItem={activeItem} />;
  };

  return (
    <main className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar items={navigationData} onItemClick={setActiveItem} activeItem={activeItem} />
      <TopHeader />
      <div className="flex-1 flex flex-col mt-16 w-full overflow-hidden">
        {renderContent()}
      </div>
    </main>
  );
}
