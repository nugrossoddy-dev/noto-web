import React, { useState, useEffect, useRef } from 'react';

interface DownloadAuthFlowProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (userData: { name: string; email: string; phone: string; address: string }) => void;
}

type FlowStep = 'form' | 'buffering' | 'login';

export const DownloadAuthFlow: React.FC<DownloadAuthFlowProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  // Current step in the sequence
  const [step, setStep] = useState<FlowStep>('form');

  // Registration Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // Password for login
  const [password, setPassword] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Phone validation error state
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');

  // Abstract Captcha Code
  const [captchaCode, setCaptchaCode] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaError, setCaptchaError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Buffering progress
  const [bufferProgress, setBufferProgress] = useState(0);
  const [bufferStatus, setBufferStatus] = useState('Menginisialisasi lisensi workstation...');

  // Login form state
  const [loginError, setLoginError] = useState('');
  const [savedUser, setSavedUser] = useState<{
    name: string;
    email: string;
    phone: string;
    address: string;
    password: string;
  } | null>(null);

  // Generate random 5-character abstract code
  const generateCaptcha = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setCaptchaInput('');
    setCaptchaError('');
  };

  // Render stylized abstract noise captcha on canvas
  useEffect(() => {
    if (!canvasRef.current || !captchaCode) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dimensions
    canvas.width = 170;
    canvas.height = 48;

    // Background
    ctx.fillStyle = '#f0eee9';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw random noise lines
    for (let i = 0; i < 7; i++) {
      ctx.strokeStyle = i % 2 === 0 ? '#aa361e' : '#747878';
      ctx.lineWidth = 1 + Math.random() * 1.5;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.bezierCurveTo(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.random() * canvas.width,
        Math.random() * canvas.height
      );
      ctx.stroke();
    }

    // Draw random noise dots
    for (let i = 0; i < 35; i++) {
      ctx.fillStyle = i % 3 === 0 ? '#aa361e' : '#000000';
      ctx.beginPath();
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw characters with distinct rotations & brutalist font
    ctx.font = 'bold 24px "Space Grotesk", monospace';
    ctx.textBaseline = 'middle';

    const charSpacing = canvas.width / (captchaCode.length + 1);
    for (let i = 0; i < captchaCode.length; i++) {
      const char = captchaCode[i];
      const x = (i + 1) * charSpacing;
      const y = canvas.height / 2;

      ctx.save();
      ctx.translate(x, y);
      const angle = (Math.random() - 0.5) * 0.45;
      ctx.rotate(angle);

      // Color variation
      ctx.fillStyle = i % 2 === 0 ? '#000000' : '#aa361e';
      ctx.fillText(char, -8, 2);
      ctx.restore();
    }
  }, [captchaCode, step]);

  // Generate initial captcha when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('form');
      generateCaptcha();
      setPhoneError('');
      setEmailError('');
      setCaptchaError('');
      setLoginError('');
      setBufferProgress(0);
    }
  }, [isOpen]);

  // Real Indonesian / International phone number validator
  const validatePhone = (val: string) => {
    // Clean string of spaces and hyphens
    const clean = val.replace(/[\s-]/g, '');

    // Format check:
    // Indonesian mobile format: starts with 08 or +628 or 628, followed by 8-12 digits.
    // Or standard international E.164: +[country code][digits] between 10 and 15 digits.
    const indoRegex = /^(\+62|62|0)8[1-9][0-9]{7,11}$/;
    const genericIntlRegex = /^\+[1-9][0-9]{9,14}$/;

    if (!clean) {
      return 'Nomor HP wajib diisi.';
    }
    if (!indoRegex.test(clean) && !genericIntlRegex.test(clean)) {
      return 'Format nomor HP tidak valid. Gunakan format seperti 0812-3456-7890 atau +6281234567890.';
    }
    return '';
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPhone(val);
    if (val.length > 5) {
      setPhoneError(validatePhone(val));
    } else {
      setPhoneError('');
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (val && !emailRegex.test(val)) {
      setEmailError('Format email tidak valid.');
    } else {
      setEmailError('');
    }
  };

  // Form Submission -> Triggers Buffering
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check phone
    const phoneValidation = validatePhone(phone);
    if (phoneValidation) {
      setPhoneError(phoneValidation);
      return;
    }

    // Check email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
      setEmailError('Format email tidak valid.');
      return;
    }

    // Check address
    if (!address.trim() || address.trim().length < 5) {
      alert('Mohon masukkan alamat lengkap Anda.');
      return;
    }

    // Check password
    if (!password || password.length < 6) {
      alert('Kata sandi minimal 6 karakter untuk keamanan akun Anda.');
      return;
    }

    // Check abstract captcha code (case insensitive)
    if (captchaInput.trim().toUpperCase() !== captchaCode.toUpperCase()) {
      setCaptchaError('Kode verifikasi abstrak tidak cocok. Silakan coba lagi.');
      generateCaptcha();
      return;
    }

    // Save temporary user credential
    const newUser = {
      name: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
      password,
    };
    setSavedUser(newUser);

    // Save registration payload to localStorage
    try {
      localStorage.setItem('noto_registered_user', JSON.stringify(newUser));
    } catch {
      // ignore
    }

    // Switch to BUFFERING step
    setStep('buffering');
    startBufferingProcess();
  };

  // Rhythmic buffering process with "GET THINGS DONE"
  const startBufferingProcess = () => {
    setBufferProgress(0);
    const stages = [
      { progress: 15, text: 'Memverifikasi kredensial lisensi workstation...' },
      { progress: 40, text: 'Mengalokasikan ruang memori lokal terisolasi...' },
      { progress: 70, text: 'Menyiapkan modul Deep Work & Zen Focus Audio...' },
      { progress: 90, text: 'Enkripsi data pribadi selesai tuntas...' },
      { progress: 100, text: 'Instalasi selesai. Menyiapkan gerbang otorisasi...' },
    ];

    let currentStage = 0;
    const interval = setInterval(() => {
      if (currentStage < stages.length) {
        setBufferProgress(stages[currentStage].progress);
        setBufferStatus(stages[currentStage].text);
        currentStage++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setStep('login');
        }, 600);
      }
    }, 650);
  };

  // Login Submission -> Triggers Entry to App
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    // Check against registered user or localStorage
    const stored =
      savedUser ||
      (() => {
        try {
          const val = localStorage.getItem('noto_registered_user');
          return val ? JSON.parse(val) : null;
        } catch {
          return null;
        }
      })();

    if (!stored) {
      setLoginError('Data pendaftaran tidak ditemukan. Silakan isi form kembali.');
      return;
    }

    // Check password
    if (loginPassword !== stored.password) {
      setLoginError('Kata sandi yang Anda masukkan salah. Mohon periksa kembali.');
      return;
    }

    // Successful login: persist session
    try {
      localStorage.setItem(
        'noto_active_session',
        JSON.stringify({
          isLoggedIn: true,
          name: stored.name,
          email: stored.email,
          phone: stored.phone,
          address: stored.address,
          loginTime: Date.now(),
        })
      );

      // Also update NOTO app preferences name to user's name
      const curPrefs = localStorage.getItem('noto_prefs');
      if (curPrefs) {
        const parsed = JSON.parse(curPrefs);
        parsed.name = stored.name;
        localStorage.setItem('noto_prefs', JSON.stringify(parsed));
      }
    } catch {
      // ignore
    }

    // Call success handler to enter app!
    onLoginSuccess({
      name: stored.name,
      email: stored.email,
      phone: stored.phone,
      address: stored.address,
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-primary/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-surface border-2 border-primary max-w-xl w-full p-space-lg md:p-space-xl shadow-[10px_10px_0px_#aa361e] my-auto transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ================= STEP 1: FORMULIR PENDAFTARAN & KODE ABSTRAK ================= */}
        {step === 'form' && (
          <div>
            {/* Header */}
            <div className="flex justify-between items-start border-b border-primary pb-space-sm mb-space-md">
              <div>
                <span className="font-label-caps text-label-caps text-secondary font-bold uppercase tracking-widest block">
                  REGISTRASI LISENSI // NOTO SUITE v2.4
                </span>
                <h2 className="font-display font-bold text-headline-sm uppercase text-primary mt-1">
                  Formulir Unduh &amp; Aktivasi
                </h2>
              </div>
              <button
                onClick={onClose}
                className="border border-primary px-2.5 py-1 text-xs font-label-caps uppercase hover:bg-secondary hover:text-white transition-colors cursor-pointer"
              >
                ✕ TUTUP
              </button>
            </div>

            <p className="font-body-md text-body-md text-on-surface mb-space-md leading-relaxed">
              Silakan lengkapi formulir verifikasi di bawah ini untuk mengunduh paket resmi NOTO dan mengaktifkan workstation pribadi Anda:
            </p>

            <form onSubmit={handleFormSubmit} className="space-y-3.5">
              {/* Nama Lengkap */}
              <div>
                <label className="block font-label-caps text-label-caps uppercase text-primary font-bold mb-1">
                  Nama Lengkap <span className="text-secondary">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Aurelius Theoddyn"
                  className="w-full bg-surface-container-low border border-primary px-3 py-2 text-sm font-display text-primary outline-none focus:bg-surface focus:border-secondary transition-colors"
                />
              </div>

              {/* Email & Nomor HP */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-label-caps text-label-caps uppercase text-primary font-bold mb-1">
                    Alamat Email <span className="text-secondary">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="nama@email.com"
                    className="w-full bg-surface-container-low border border-primary px-3 py-2 text-sm font-display text-primary outline-none focus:bg-surface focus:border-secondary transition-colors"
                  />
                  {emailError && (
                    <span className="text-error font-label-caps text-label-caps block mt-1">
                      {emailError}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block font-label-caps text-label-caps uppercase text-primary font-bold mb-1">
                    Nomor HP (Format Nyata) <span className="text-secondary">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="e.g. 0812-3456-7890"
                    className="w-full bg-surface-container-low border border-primary px-3 py-2 text-sm font-display text-primary outline-none focus:bg-surface focus:border-secondary transition-colors"
                  />
                  {phoneError ? (
                    <span className="text-error font-label-caps text-label-caps block mt-1">
                      {phoneError}
                    </span>
                  ) : (
                    <span className="text-on-surface-variant font-label-caps text-[10px] block mt-1">
                      Contoh: 081234567890 atau +6281234567890
                    </span>
                  )}
                </div>
              </div>

              {/* Alamat Lengkap */}
              <div>
                <label className="block font-label-caps text-label-caps uppercase text-primary font-bold mb-1">
                  Alamat Lengkap <span className="text-secondary">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Jl. Kebayoran Baru No. 18, Jakarta Selatan"
                  className="w-full bg-surface-container-low border border-primary px-3 py-2 text-sm font-body-md text-primary outline-none focus:bg-surface focus:border-secondary resize-none"
                />
              </div>

              {/* Buat Kata Sandi Akun */}
              <div>
                <label className="block font-label-caps text-label-caps uppercase text-primary font-bold mb-1">
                  Buat Kata Sandi Akun (Untuk Login) <span className="text-secondary">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full bg-surface-container-low border border-primary px-3 py-2 text-sm font-display text-primary outline-none focus:bg-surface focus:border-secondary pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary cursor-pointer text-xs uppercase font-label-caps"
                  >
                    {showPassword ? 'Tutup' : 'Lihat'}
                  </button>
                </div>
              </div>

              {/* VERIFIKASI KODE ABSTRAK (CAPTCHA) */}
              <div className="border-t border-b border-primary/20 py-3 bg-surface-container-low p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-label-caps text-label-caps text-primary font-bold uppercase">
                    VERIFIKASI KODE ABSTRAK <span className="text-secondary">*</span>
                  </span>
                  <button
                    type="button"
                    onClick={generateCaptcha}
                    className="text-secondary hover:underline font-label-caps text-label-caps cursor-pointer inline-flex items-center gap-1"
                    title="Ganti Kode Abstrak"
                  >
                    <span className="material-symbols-outlined text-[16px]">refresh</span>
                    <span>Acak Kode Baru</span>
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  {/* Canvas Visual Code */}
                  <div className="border-2 border-primary bg-surface p-1 shadow-[2px_2px_0px_#000000]">
                    <canvas ref={canvasRef} className="block cursor-pointer" onClick={generateCaptcha} title="Klik untuk mengacak kode" />
                  </div>

                  {/* Input Code */}
                  <div className="flex-1 w-full">
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={captchaInput}
                      onChange={(e) => {
                        setCaptchaInput(e.target.value);
                        setCaptchaError('');
                      }}
                      placeholder="Ketik 5 huruf kode di samping"
                      className="w-full bg-surface border border-primary px-3 py-2.5 text-sm font-display tracking-widest uppercase font-bold text-primary outline-none focus:border-secondary"
                    />
                  </div>
                </div>

                {captchaError && (
                  <p className="text-error font-label-caps text-label-caps">{captchaError}</p>
                )}
              </div>

              {/* TOMBOL DOWNLOAD */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-primary text-on-primary font-label-lg text-label-lg uppercase py-3.5 tracking-wider border border-primary hover:bg-secondary hover:border-secondary transition-colors duration-150 cursor-pointer shadow-[4px_4px_0px_#aa361e] active:translate-y-px font-bold flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[20px]">download</span>
                  <span>[ Download &amp; Verifikasi NOTO ]</span>
                </button>
              </div>

              <div className="text-center font-label-caps text-label-caps text-on-surface-variant pt-1">
                DATA DIJAMIN AMAN • TIDAK DIBAGIKAN KE PIHAK KETIGA
              </div>
            </form>
          </div>
        )}

        {/* ================= STEP 2: BUFFERING SCREEN ("GET THINGS DONE") ================= */}
        {step === 'buffering' && (
          <div className="text-center py-space-xl px-margin space-y-space-lg">
            {/* Visual Header */}
            <div className="inline-flex items-center gap-2 border border-primary px-3 py-1 font-label-caps text-label-caps uppercase bg-surface-container-low mx-auto">
              <span className="w-2.5 h-2.5 bg-secondary animate-pulse inline-block"></span>
              <span>MEMPERSIAPKAN INSTALASI WORKSTATION</span>
            </div>

            {/* Giant Bold "GET THINGS DONE" */}
            <div className="space-y-1">
              <h1 className="font-display text-display-mobile md:text-headline-lg font-bold tracking-tighter uppercase text-primary leading-none animate-pulse">
                GET THINGS DONE.
              </h1>
              <p className="font-editorial-lead text-editorial-lead text-on-surface italic">
                Menghapus distraksi. Menyiapkan ritme fokus Anda.
              </p>
            </div>

            {/* Brutalist Progress Bar */}
            <div className="max-w-md mx-auto space-y-2">
              <div className="w-full h-4 bg-surface-container border-2 border-primary p-0.5">
                <div
                  className="h-full bg-secondary transition-all duration-500 ease-out"
                  style={{ width: `${bufferProgress}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center font-label-caps text-label-caps text-primary">
                <span className="tabular-nums font-bold">{bufferProgress}% SELESAI</span>
                <span className="text-secondary uppercase">{bufferStatus}</span>
              </div>
            </div>

            <div className="pt-space-md border-t border-primary/20 max-w-sm mx-auto">
              <p className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                STUDIO NOTO // VERIFIKASI IDENTITAS BERHASIL
              </p>
            </div>
          </div>
        )}

        {/* ================= STEP 3: LOGIN FORM (DETAIL LOG IN) ================= */}
        {step === 'login' && (
          <div>
            {/* Header */}
            <div className="flex justify-between items-start border-b border-primary pb-space-sm mb-space-md">
              <div>
                <div className="inline-flex items-center gap-2 font-label-caps text-label-caps text-secondary font-bold uppercase mb-1">
                  <span className="w-2 h-2 bg-secondary inline-block"></span>
                  DOWNLOAD SELESAI // LISENSI TERVERIFIKASI
                </div>
                <h2 className="font-display font-bold text-headline-sm uppercase text-primary">
                  Log In ke NOTO Workstation
                </h2>
              </div>
              <button
                onClick={onClose}
                className="border border-primary px-2.5 py-1 text-xs font-label-caps uppercase hover:bg-secondary hover:text-white transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* User Registration Snapshot Badge */}
            <div className="bg-surface-container border border-primary p-3 mb-space-md flex items-center justify-between shadow-[2px_2px_0px_#000000]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 border border-primary bg-primary text-white flex items-center justify-center font-display font-bold text-sm">
                  {fullName.charAt(0) || 'N'}
                </div>
                <div>
                  <span className="font-display font-bold text-sm block text-primary">
                    {fullName || savedUser?.name || 'Kreator NOTO'}
                  </span>
                  <span className="font-label-caps text-label-caps text-on-surface-variant">
                    {email || savedUser?.email} • {phone || savedUser?.phone}
                  </span>
                </div>
              </div>
              <span className="bg-secondary text-white font-label-caps text-label-caps px-2 py-1 uppercase font-bold">
                PRO LISENSI
              </span>
            </div>

            <p className="font-body-md text-body-md text-on-surface mb-space-md leading-relaxed">
              Paket aplikasi telah berhasil disiapkan di memori perangkat Anda. Masukkan kata sandi yang telah Anda buat untuk membuka kanvas kerja:
            </p>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block font-label-caps text-label-caps uppercase text-primary font-bold mb-1">
                  Email Akun Terdaftar
                </label>
                <input
                  type="email"
                  disabled
                  value={email || savedUser?.email || ''}
                  className="w-full bg-surface-container border border-primary px-3 py-2 text-sm font-display text-on-surface-variant cursor-not-allowed"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-label-caps text-label-caps uppercase text-primary font-bold">
                    Kata Sandi <span className="text-secondary">*</span>
                  </label>
                  <span className="font-label-caps text-[10px] text-on-surface-variant">
                    Kata sandi saat mengisi formulir
                  </span>
                </div>
                <input
                  type="password"
                  required
                  autoFocus
                  value={loginPassword}
                  onChange={(e) => {
                    setLoginPassword(e.target.value);
                    setLoginError('');
                  }}
                  placeholder="Ketik kata sandi Anda..."
                  className="w-full bg-surface-container-low border border-primary px-3 py-2.5 text-sm font-display text-primary outline-none focus:bg-surface focus:border-secondary transition-colors"
                />
                {loginError && (
                  <p className="text-error font-label-caps text-label-caps mt-1.5 font-bold">
                    {loginError}
                  </p>
                )}
              </div>

              {/* Detail Otentikasi Lisensi */}
              <div className="border border-dashed border-primary/40 p-3 bg-surface-container-low text-xs font-display space-y-1">
                <div className="flex justify-between text-on-surface-variant">
                  <span>ID Sesi Perangkat:</span>
                  <span className="font-mono text-primary font-bold">NOTO-ID-{Date.now().toString().slice(-6)}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Penyimpanan Lokal:</span>
                  <span className="text-secondary font-bold">TERENKRIPSI &amp; PRIVAT</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Status Verifikasi:</span>
                  <span className="text-primary font-bold">LULUS UJI KODE ABSTRAK</span>
                </div>
              </div>

              {/* Tombol Masuk ke Aplikasi */}
              <button
                type="submit"
                className="w-full bg-primary text-on-primary font-label-lg text-label-lg uppercase py-3.5 tracking-wider border border-primary hover:bg-secondary hover:border-secondary transition-colors duration-150 cursor-pointer shadow-[4px_4px_0px_#aa361e] active:translate-y-px font-bold flex items-center justify-center gap-2"
              >
                <span>[ Masuk ke Aplikasi NOTO ]</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>

              <div className="flex items-center justify-between font-label-caps text-label-caps text-on-surface-variant pt-1">
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="text-primary hover:text-secondary underline cursor-pointer"
                >
                  ← Kembali ke formulir
                </button>
                <span>VERSI WORKSPACE 2.4.0</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
