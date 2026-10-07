/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PageRoute } from './types';
import { Header } from './components/Header';
import { MobileDrawer } from './components/MobileDrawer';
import { Footer } from './components/Footer';
import { DownloadAuthFlow } from './components/DownloadAuthFlow';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { BlogPage } from './pages/BlogPage';
import { NotoApp } from './components/app/NotoApp';

export default function App() {
  // Page routing state: 'home' | 'about' | 'blog' | 'app'
  const [currentPage, setCurrentPage] = useState<PageRoute>(() => {
    const hash = window.location.hash.toLowerCase();
    if (hash.includes('app') || hash.includes('launch') || hash.includes('download-app')) {
      return 'app';
    }
    if (hash.includes('about')) return 'about';
    if (hash.includes('blog') || hash.includes('journal')) return 'blog';
    return 'home';
  });

  // Mobile drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Download & Onboarding auth modal state
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);

  // Navigate handler that scrolls to top and updates hash
  const handleNavigate = (page: PageRoute) => {
    setCurrentPage(page);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Direct app launcher after successful verification & login
  const handleLoginSuccess = () => {
    setDownloadModalOpen(false);
    handleNavigate('app');
  };

  // Sync hash changes if user uses browser back/forward buttons
  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('app') || hash.includes('launch')) setCurrentPage('app');
      else if (hash.includes('about')) setCurrentPage('about');
      else if (hash.includes('blog') || hash.includes('journal')) setCurrentPage('blog');
      else setCurrentPage('home');
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // If user is currently running the NOTO application:
  if (currentPage === 'app') {
    return (
      <div className="min-h-screen bg-[#fbf9f5] text-[#1b1c1a]">
        <NotoApp onBackToMarketing={() => handleNavigate('home')} />
      </div>
    );
  }

  // Otherwise, render the Marketing Website (Home, About Us, Blog):
  return (
    <div className="marketing-view bg-background text-on-background min-h-screen flex flex-col font-body-md antialiased overflow-x-hidden selection:bg-secondary selection:text-on-primary">
      {/* HEADER WITH REVISED NAVIGATION: HOME, ABOUT US, BLOG */}
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenDrawer={() => setDrawerOpen(true)}
        onOpenDownload={() => setDownloadModalOpen(true)}
      />

      {/* MOBILE DRAWER */}
      <MobileDrawer
        isOpen={drawerOpen}
        currentPage={currentPage}
        onClose={() => setDrawerOpen(false)}
        onNavigate={handleNavigate}
        onOpenDownload={() => setDownloadModalOpen(true)}
      />

      {/* DEDICATED MARKETING PAGE VIEWS */}
      <main className="flex-grow">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onOpenDownload={() => setDownloadModalOpen(true)}
          />
        )}
        {currentPage === 'about' && (
          <AboutPage
            onNavigate={handleNavigate}
            onOpenDownload={() => setDownloadModalOpen(true)}
          />
        )}
        {currentPage === 'blog' && (
          <BlogPage
            onNavigate={handleNavigate}
            onOpenDownload={() => setDownloadModalOpen(true)}
          />
        )}
      </main>

      {/* SHARED BRUTALIST FOOTER */}
      <Footer
        onNavigate={handleNavigate}
        onOpenDownload={() => setDownloadModalOpen(true)}
      />

      {/* DOWNLOAD, BUFFERING, AND LOGIN AUTH FLOW MODAL */}
      <DownloadAuthFlow
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
