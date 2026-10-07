import React from 'react';
import { PageRoute } from '../types';

interface FooterProps {
  onNavigate: (page: PageRoute) => void;
  onOpenDownload: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenDownload }) => {
  return (
    <footer className="bg-surface-container border-t border-primary w-full px-margin md:px-margin-desktop py-space-xl flex flex-col justify-between">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-space-xl pb-space-xl border-b border-primary/20">
        {/* Brandmark and Slogan */}
        <div className="md:col-span-5 space-y-space-sm">
          <div className="flex items-center gap-3">
            <img
              alt="NOTO Brandmark"
              className="w-10 h-10 object-contain"
              src="https://lh3.googleusercontent.com/aida/AEtjO1XknagExYZactv4avwZOx2Kte72kG9VaFJNme3GrMAGHb-jO_ShU9Mmr_G_lBRT1zExUGEPfg5VTdAvuuPFB9aV1eJIn-UVuh8otcVoAAXMj_LoEFdaY1oCxnXQaO4rmnTLwUOMfsTvAmYpicMWthaH6pw8MAqWRJ8zcfJ2vTPC1zVSclSSnalERiujcT6k1fkhz66NipA91yj-M5srvpBh3UUzf9K4JTnJxhpFzd2tDA"
            />
            <span className="font-display text-display font-bold tracking-tighter text-primary uppercase leading-none">
              NOTO
            </span>
          </div>
          <p className="font-display text-headline-lg uppercase text-primary tracking-tight font-bold">
            GET THINGS DONE.
          </p>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
            Sistem produktivitas yang menghargai ketenangan pikiran dan kejernihan fokus para kreator modern Indonesia.
          </p>
        </div>

        {/* Links Directory */}
        <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-space-md font-label-caps text-label-caps uppercase">
          <div className="space-y-space-sm">
            <span className="text-secondary font-bold block">NAVIGASI UTAMA</span>
            <ul className="space-y-2 text-on-surface-variant">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-secondary transition-colors duration-100 uppercase cursor-pointer text-left"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-secondary transition-colors duration-100 uppercase cursor-pointer text-left"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('blog')}
                  className="hover:text-secondary transition-colors duration-100 uppercase cursor-pointer text-left"
                >
                  Blog (Journal)
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenDownload}
                  className="hover:text-secondary transition-colors duration-100 uppercase cursor-pointer text-left font-bold text-secondary"
                >
                  Download NOTO
                </button>
              </li>
            </ul>
          </div>
          <div className="space-y-space-sm">
            <span className="text-secondary font-bold block">ARSIP & HUKUM</span>
            <ul className="space-y-2 text-on-surface-variant">
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-secondary transition-colors duration-100 uppercase cursor-pointer text-left"
                >
                  Manifesto
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-secondary transition-colors duration-100 uppercase cursor-pointer text-left"
                >
                  Colophon
                </button>
              </li>
              <li>
                <span className="text-outline cursor-default">Privacy Policy (Local-Only)</span>
              </li>
              <li>
                <span className="text-outline cursor-default">Terms of Service</span>
              </li>
            </ul>
          </div>
          <div className="space-y-space-sm">
            <span className="text-secondary font-bold block">HUBUNGAN</span>
            <ul className="space-y-2 text-on-surface-variant">
              <li>
                <a
                  className="hover:text-secondary transition-colors duration-100"
                  href="https://instagram.com"
                  rel="noreferrer"
                  target="_blank"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  className="hover:text-secondary transition-colors duration-100"
                  href="https://linkedin.com"
                  rel="noreferrer"
                  target="_blank"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  className="hover:text-secondary transition-colors duration-100"
                  href="mailto:studio@noto.id"
                >
                  studio@noto.id
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="pt-space-lg flex flex-col sm:flex-row justify-between items-center gap-space-sm font-label-caps text-label-caps uppercase text-on-surface-variant">
        <div>
          © 2025 NOTO Studio. All rights reserved. GET THINGS DONE.
        </div>
        <div>
          DIRANCANG DENGAN DISIPLIN DI JAKARTA, INDONESIA
        </div>
      </div>
    </footer>
  );
};
