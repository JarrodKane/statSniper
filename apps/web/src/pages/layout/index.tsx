
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import React from 'react';


interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen ">
      <Navbar />
      <main className="flex flex-col flex-grow container relative py-6 gap-5">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
