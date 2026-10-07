import React from 'react';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchApp: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  isOpen,
  onClose,
  onLaunchApp,
}) => {
  if (!isOpen) return null;

  const handleLaunch = () => {
    onClose();
    onLaunchApp();
  };

  const handleDownloadStandalone = (platformName: string) => {
    // Generate an offline standalone web app bundle shortcut file
    const content = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>NOTO App</title>
<meta http-equiv="refresh" content="0; url=${window.location.origin}/#app">
<script>window.location.href = "${window.location.origin}/#app";</script>
</head>
<body>
<p>Membuka NOTO App... <a href="${window.location.origin}/#app">Klik di sini jika tidak terbuka otomatis</a></p>
</body>
</html>`;
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NOTO-${platformName.replace(/\s+/g, '-').toLowerCase()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Also directly launch the app!
    handleLaunch();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-primary/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface border-2 border-primary max-w-lg w-full p-space-lg md:p-space-xl shadow-[8px_8px_0px_#aa361e]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start border-b border-primary pb-space-sm mb-space-md">
          <div className="flex items-center gap-2">
            <img
              alt="NOTO Brandmark"
              className="w-6 h-6 object-contain"
              src="https://lh3.googleusercontent.com/aida/AEtjO1XknagExYZactv4avwZOx2Kte72kG9VaFJNme3GrMAGHb-jO_ShU9Mmr_G_lBRT1zExUGEPfg5VTdAvuuPFB9aV1eJIn-UVuh8otcVoAAXMj_LoEFdaY1oCxnXQaO4rmnTLwUOMfsTvAmYpicMWthaH6pw8MAqWRJ8zcfJ2vTPC1zVSclSSnalERiujcT6k1fkhz66NipA91yj-M5srvpBh3UUzf9K4JTnJxhpFzd2tDA"
            />
            <span className="font-display font-bold text-headline-sm uppercase text-primary">
              DOWNLOAD &amp; LUNCURKAN NOTO
            </span>
          </div>
          <button
            onClick={onClose}
            className="border border-primary px-2 py-0.5 text-xs font-label-caps uppercase hover:bg-secondary hover:text-white transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        <p className="font-body-md text-body-md text-on-surface mb-space-md leading-relaxed">
          Pilih opsi di bawah. Aplikasi NOTO akan <strong>langsung dibuka dan siap digunakan</strong> di browser atau disimpan ke perangkat Anda:
        </p>

        <div className="space-y-3 font-display">
          {/* Primary instant launch CTA */}
          <button
            onClick={handleLaunch}
            className="w-full border-2 border-secondary bg-surface-container-low p-3.5 flex items-center justify-between hover:bg-secondary hover:text-white transition-colors cursor-pointer group shadow-[4px_4px_0px_#aa361e]"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[28px] text-secondary group-hover:text-white">
                rocket_launch
              </span>
              <div className="text-left">
                <span className="font-bold text-base block group-hover:text-white">
                  Luncurkan Aplikasi NOTO Sekarang
                </span>
                <span className="font-label-caps text-label-caps text-on-surface-variant group-hover:text-white/80">
                  Langsung menuju ke aplikasi lengkap • Siap pakai
                </span>
              </div>
            </div>
            <span className="font-label-caps text-label-caps bg-secondary text-white group-hover:bg-primary px-3 py-1.5 uppercase font-bold">
              BUKA SEGERA →
            </span>
          </button>

          {/* iOS option */}
          <button
            onClick={() => handleDownloadStandalone('iOS-App')}
            className="w-full border-2 border-primary p-3 flex items-center justify-between hover:bg-surface-container transition-colors cursor-pointer group text-left"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[24px]">phone_iphone</span>
              <div>
                <span className="font-bold text-sm block">Apple iOS (iPhone &amp; iPad)</span>
                <span className="font-label-caps text-label-caps text-on-surface-variant">
                  Download &amp; Buka Instan • iOS Web App
                </span>
              </div>
            </div>
            <span className="font-label-caps text-label-caps bg-primary text-white px-2.5 py-1 uppercase group-hover:bg-secondary">
              Unduh &amp; Buka
            </span>
          </button>

          {/* Android option */}
          <button
            onClick={() => handleDownloadStandalone('Android-App')}
            className="w-full border-2 border-primary p-3 flex items-center justify-between hover:bg-surface-container transition-colors cursor-pointer group text-left"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[24px]">android</span>
              <div>
                <span className="font-bold text-sm block">Google Android</span>
                <span className="font-label-caps text-label-caps text-on-surface-variant">
                  Download &amp; Buka Instan • Android Web App
                </span>
              </div>
            </div>
            <span className="font-label-caps text-label-caps bg-primary text-white px-2.5 py-1 uppercase group-hover:bg-secondary">
              Unduh &amp; Buka
            </span>
          </button>
        </div>

        <div className="mt-space-md pt-space-sm border-t border-primary/20 flex justify-between items-center text-on-surface-variant font-label-caps text-label-caps">
          <span>DATA DISIMPAN DI PERANGKAT LOKAL ANDA</span>
          <span className="text-secondary font-bold">PRIVASI 100%</span>
        </div>
      </div>
    </div>
  );
};
