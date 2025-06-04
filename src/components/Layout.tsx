import React, { ReactNode } from 'react';
import DarkModeToggle from './DarkModeToggle';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-dark-900 dark:to-dark-800 py-8 px-4 transition-colors duration-300">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-end mb-6">
          <DarkModeToggle />
        </div>
        {children}
      </div>
    </div>
  );
};

export default Layout;