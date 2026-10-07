import React from 'react';
import { PageRoute } from '../types';

interface HeaderProps {
  currentPage: PageRoute;
  onNavigate: (page: PageRoute) => void;
  onOpenDrawer: () => void;
  onOpenDownload: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  onOpenDrawer,
  onOpenDownload,
}) => {
  return (
    <header className="bg-surface border-b border-outline-variant sticky top-0 z-50 transition-colors">
      <div className="flex justify-between items-center w-full px-margin md:px-margin-desktop py-space-sm max-w-full">
        {/* Brand Zone */}
        <div className="flex items-center gap-space-sm">
          <button
            aria-label="Open Navigation"
            onClick={onOpenDrawer}
            className="md:hidden p-space-xs text-primary hover:bg-surface-container transition-colors duration-150 cursor-pointer"
            id="menu-btn"
          >
            <span className="material-symbols-outlined text-primary text-[24px]">menu</span>
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 cursor-pointer bg-transparent border-0 p-0 text-left"
          >
            <img
              alt="NOTO"
              className="w-7 h-7 object-contain inline-block"
              src="https://lh3.googleusercontent.com/aida/AEtjO1XknagExYZactv4avwZOx2Kte72kG9VaFJNme3GrMAGHb-jO_ShU9Mmr_G_lBRT1zExUGEPfg5VTdAvuuPFB9aV1eJIn-UVuh8otcVoAAXMj_LoEFdaY1oCxnXQaO4rmnTLwUOMfsTvAmYpicMWthaH6pw8MAqWRJ8zcfJ2vTPC1zVSclSSnalERiujcT6k1fkhz66NipA91yj-M5srvpBh3UUzf9K4JTnJxhpFzd2tDA"
            />
            <span className="font-display text-headline-md font-bold tracking-tighter text-primary uppercase">
              NOTO
            </span>
          </button>
        </div>

        {/* Navigation Zone: HOME, ABOUT US, BLOG */}
        <nav className="hidden md:flex items-center gap-space-lg">
          <button
            onClick={() => onNavigate('home')}
            className={`font-label-lg text-label-lg uppercase transition-all pb-1 cursor-pointer tracking-wider ${
              currentPage === 'home'
                ? 'text-primary border-b-2 border-primary font-bold'
                : 'text-on-surface-variant hover:text-primary border-b-2 border-transparent'
            }`}
          >
            HOME
          </button>
          <button
            onClick={() => onNavigate('about')}
            className={`font-label-lg text-label-lg uppercase transition-all pb-1 cursor-pointer tracking-wider ${
              currentPage === 'about'
                ? 'text-primary border-b-2 border-primary font-bold'
                : 'text-on-surface-variant hover:text-primary border-b-2 border-transparent'
            }`}
          >
            ABOUT US
          </button>
          <button
            onClick={() => onNavigate('blog')}
            className={`font-label-lg text-label-lg uppercase transition-all pb-1 cursor-pointer tracking-wider ${
              currentPage === 'blog'
                ? 'text-primary border-b-2 border-primary font-bold'
                : 'text-on-surface-variant hover:text-primary border-b-2 border-transparent'
            }`}
          >
            BLOG
          </button>
        </nav>

        {/* Action Zone */}
        <div className="flex items-center gap-space-sm">
          <button
            onClick={onOpenDownload}
            className="bg-primary text-on-primary font-label-lg text-label-lg uppercase px-space-md py-space-xs tracking-wider border border-primary hover:bg-secondary hover:border-secondary transition-colors duration-150 active:translate-y-px cursor-pointer"
          >
            [ Download NOTO ]
          </button>
        </div>
      </div>
    </header>
  );
};
