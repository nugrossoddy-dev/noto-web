import React from 'react';
import { PageRoute } from '../types';

interface MobileDrawerProps {
  isOpen: boolean;
  currentPage: PageRoute;
  onClose: () => void;
  onNavigate: (page: PageRoute) => void;
  onOpenDownload: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  currentPage,
  onClose,
  onNavigate,
  onOpenDownload,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-[1px] flex"
      id="mobile-drawer"
      onClick={onClose}
    >
      <div
        className="w-4/5 max-w-xs h-full bg-surface border-r border-primary flex flex-col justify-between p-space-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-space-lg">
          <div className="flex justify-between items-center border-b border-primary/20 pb-space-sm">
            <div className="flex items-center gap-2">
              <img
                alt="NOTO Brandmark"
                className="w-6 h-6 object-contain"
                src="https://lh3.googleusercontent.com/aida/AEtjO1XknagExYZactv4avwZOx2Kte72kG9VaFJNme3GrMAGHb-jO_ShU9Mmr_G_lBRT1zExUGEPfg5VTdAvuuPFB9aV1eJIn-UVuh8otcVoAAXMj_LoEFdaY1oCxnXQaO4rmnTLwUOMfsTvAmYpicMWthaH6pw8MAqWRJ8zcfJ2vTPC1zVSclSSnalERiujcT6k1fkhz66NipA91yj-M5srvpBh3UUzf9K4JTnJxhpFzd2tDA"
              />
              <span className="font-display text-headline-sm font-bold text-primary">NOTO</span>
            </div>
            <button
              className="p-1 hover:text-secondary cursor-pointer"
              onClick={onClose}
              id="close-drawer"
              aria-label="Close navigation"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <nav className="flex flex-col gap-space-md font-display text-headline-sm">
            <button
              className={`text-left transition-all cursor-pointer ${
                currentPage === 'home'
                  ? 'text-secondary font-bold translate-x-1'
                  : 'text-primary hover:text-secondary hover:translate-x-1'
              }`}
              onClick={() => {
                onNavigate('home');
                onClose();
              }}
            >
              01. HOME
            </button>
            <button
              className={`text-left transition-all cursor-pointer ${
                currentPage === 'about'
                  ? 'text-secondary font-bold translate-x-1'
                  : 'text-primary hover:text-secondary hover:translate-x-1'
              }`}
              onClick={() => {
                onNavigate('about');
                onClose();
              }}
            >
              02. ABOUT US
            </button>
            <button
              className={`text-left transition-all cursor-pointer ${
                currentPage === 'blog'
                  ? 'text-secondary font-bold translate-x-1'
                  : 'text-primary hover:text-secondary hover:translate-x-1'
              }`}
              onClick={() => {
                onNavigate('blog');
                onClose();
              }}
            >
              03. BLOG
            </button>
            <button
              className="text-left hover:text-secondary hover:translate-x-1 transition-all text-secondary pt-2 border-t border-primary/20 cursor-pointer font-bold"
              onClick={() => {
                onClose();
                onOpenDownload();
              }}
            >
              04. DOWNLOAD NOTO →
            </button>
          </nav>
        </div>

        <div className="border-t border-primary/20 pt-space-sm font-label-caps text-label-caps text-on-surface-variant">
          JAKARTA / BANDUNG / YOGYAKARTA<br />EST. 2025 — INDONESIA
        </div>
      </div>
    </div>
  );
};
