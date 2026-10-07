import React, { useState, useEffect, useRef } from 'react';
import { Task, PageRoute } from '../types';

interface HomePageProps {
  onNavigate: (page: PageRoute) => void;
  onOpenDownload: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenDownload }) => {
  // Task list state (interactive mockup 1)
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Selesaikan draf editorial majalah Jakarta',
      time: '09:30',
      completed: true,
      isCurrent: false,
    },
    {
      id: '2',
      title: 'Review arsitektur sistem bersama tim Bandung',
      time: '13:00',
      completed: false,
      isCurrent: true,
    },
    {
      id: '3',
      title: 'Finalisasi pengiriman prototype fisik NOTO v1',
      time: '16:00',
      completed: false,
      isCurrent: false,
    },
  ]);
  const [newTaskInput, setNewTaskInput] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);

  // Focus timer state (interactive mockup 2)
  const [timerSeconds, setTimerSeconds] = useState(24 * 60 + 18); // 24:18 default as in mockup
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [ambientSound, setAmbientSound] = useState<'rain' | 'off'>('rain');
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);

  // Micro Notes state (interactive mockup 3)
  const [noteContent, setNoteContent] = useState<string>(() => {
    return (
      localStorage.getItem('noto_micro_notes') ||
      '"Kombinasi linen mentah dan tipografi brutalist memberikan efek psikologis bahwa pekerjaan ini nyata, bukan sekadar klik di layar kaca."'
    );
  });
  const [noteCopied, setNoteCopied] = useState(false);

  // AI Intel refresh feedback
  const [intelVersion, setIntelVersion] = useState(1);

  // Save notes to localStorage
  useEffect(() => {
    localStorage.setItem('noto_micro_notes', noteContent);
  }, [noteContent]);

  // Focus countdown timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  // Ambient sound synthesis
  const toggleAmbientSound = () => {
    if (ambientSound === 'rain') {
      stopAmbientAudio();
      setAmbientSound('off');
    } else {
      startAmbientAudio();
      setAmbientSound('rain');
    }
  };

  const startAmbientAudio = () => {
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 650;

      const gain = ctx.createGain();
      gain.gain.value = 0.07;

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start();
      noiseNodeRef.current = whiteNoise;
    } catch {
      // Audio autoplay policy fallback
    }
  };

  const stopAmbientAudio = () => {
    if (noiseNodeRef.current) {
      try {
        (noiseNodeRef.current as AudioBufferSourceNode).stop();
        noiseNodeRef.current.disconnect();
      } catch {
        // Ignored
      }
      noiseNodeRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      stopAmbientAudio();
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Task actions
  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextCompleted = !t.completed;
          return {
            ...t,
            completed: nextCompleted,
            isCurrent: !nextCompleted && t.isCurrent,
          };
        }
        return t;
      })
    );
  };

  const setAsCurrentTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => ({
        ...t,
        isCurrent: t.id === id,
      }))
    );
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskInput.trim(),
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      completed: false,
      isCurrent: tasks.length === 0,
    };
    setTasks((prev) => [...prev, newTask]);
    setNewTaskInput('');
    setIsAddingTask(false);
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const activeCount = tasks.filter((t) => !t.completed).length;

  return (
    <div>
      {/* EDITORIAL TICKER RIBBON */}
      <div className="border-b border-primary bg-surface-container-high py-space-xs px-margin text-center overflow-hidden">
        <p className="font-label-caps text-label-caps uppercase tracking-widest text-primary flex items-center justify-center gap-3">
          <span>JAKARTA</span>
          <span>•</span>
          <span>BANDUNG</span>
          <span>•</span>
          <span>YOGYAKARTA</span>
          <span>—</span>
          <span>EST. 2025</span>
          <span className="hidden md:inline">• INDONESIA'S DISCIPLINED PRODUCTIVITY SUITE</span>
        </p>
      </div>

      {/* SECTION 1 — HOMEPAGE HERO */}
      <section className="border-b border-primary relative" id="hero">
        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* Hero Left / Top Column: Dominating Image */}
          <div className="md:col-span-7 border-b md:border-b-0 md:border-r border-primary relative group overflow-hidden bg-surface-container">
            <div className="relative w-full aspect-[4/3] md:aspect-auto md:h-full min-h-[380px] md:min-h-[560px]">
              <img
                alt="Young Indonesian creative deeply focused on work with laptop and notebook in a bright, modern Jakarta studio cafe"
                className="w-full h-full object-cover grayscale contrast-110 hover:grayscale-0 transition-all duration-700"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBU4o4GA8igPHh9GRI2u1xtPZiU_UB0klXSKOALbz39RJD483eMsn-XUMrd3guqhbBMAa8LHBijDj-7ZJUUqlWzeL2SGfJ8H4Q2zpmfD5NkSikjrR0xNlBXbf-WTm5F3KNeGtd2-Q04ANUgYqexKca61wr8aqW5WXECdhT4cg8Ny9Yn3hnwDMOwMahdlfjKaQoXruuYugZqL_tdjR29y75kZWPodjyu97U1QyeaoucD"
              />
              <div className="absolute bottom-0 left-0 bg-primary text-on-primary px-space-md py-space-xs font-label-caps text-label-caps uppercase tracking-wider">
                FIG. 01 — THE DEEP WORKER / KEBAYORAN BARU
              </div>
            </div>
          </div>

          {/* Hero Right Column: Editorial Typography & CTAs */}
          <div className="md:col-span-5 p-margin md:p-space-xl flex flex-col justify-between bg-surface">
            <div className="space-y-space-md">
              <div className="inline-flex items-center gap-2 border border-primary px-space-sm py-1 font-label-caps text-label-caps uppercase bg-surface-container-low">
                <span className="w-2 h-2 bg-secondary inline-block"></span>
                SISTEM PRODUKTIVITAS TERKURASI
              </div>
              <h1 className="font-display text-display-mobile md:text-display font-bold tracking-tighter uppercase text-primary leading-none">
                GET<br />THINGS<br />DONE.
              </h1>
              <p className="font-editorial-lead text-editorial-lead text-on-surface leading-relaxed text-balance">
                NOTO membantu kamu menata hal-hal yang penting—dari tugas, waktu, hingga fokus—agar hidup terasa lebih terarah dan pekerjaan benar-benar selesai.
              </p>
            </div>
            <div className="pt-space-lg space-y-space-sm border-t border-primary/20 mt-space-lg">
              <div className="flex flex-col sm:flex-row gap-space-sm">
                <button
                  onClick={onOpenDownload}
                  className="w-full sm:w-auto text-center bg-primary text-on-primary font-label-lg text-label-lg uppercase px-space-lg py-space-md tracking-wider border border-primary hover:bg-secondary hover:border-secondary transition-colors duration-150 cursor-pointer"
                >
                  [ Download NOTO ]
                </button>
                <a
                  className="w-full sm:w-auto text-center bg-transparent text-primary font-label-lg text-label-lg uppercase px-space-lg py-space-md tracking-wider border border-primary hover:bg-surface-container transition-colors duration-150"
                  href="#showcase"
                >
                  [ Explore NOTO ]
                </a>
              </div>
              <div className="flex items-center justify-between text-on-surface-variant font-label-caps text-label-caps pt-2">
                <span>VERSI 2.4.0 — TERSAJI RINGKAS</span>
                <span>ANDROID / IOS / WEB</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — THE PROBLEM */}
      <section className="border-b border-primary bg-surface-container-low" id="problem">
        <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-primary">
          {/* Left Column: Stark Warning & Critique */}
          <div className="md:col-span-5 p-margin md:p-space-xl flex flex-col justify-between">
            <div>
              <span className="font-label-caps text-label-caps uppercase text-secondary font-bold tracking-widest block mb-space-sm">
                [ 01 — MASALAH KOGNITIF ]
              </span>
              <h2 className="font-display text-headline-lg-mobile md:text-headline-lg font-bold tracking-tight uppercase text-primary mb-space-md leading-tight">
                Too much to do.<br />Too little clarity.
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface leading-relaxed">
                Di tengah pekerjaan, tugas, deadline, dan berbagai hal yang harus diingat, masalahnya sering kali bukan kurangnya waktu. Kita hanya kehilangan kejelasan tentang apa yang perlu dilakukan lebih dulu.
              </p>
            </div>
            <div className="mt-space-lg pt-space-md border-t border-primary/20">
              <div className="font-label-caps text-label-caps text-on-surface-variant">
                ANALISIS KEBOCORAN FOKUS
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 font-display text-headline-sm">
                <div className="border border-primary p-3 bg-surface">
                  <span className="text-secondary text-headline-md block font-bold">78%</span>
                  <span className="font-label-caps text-label-caps text-on-surface">KEBISINGAN DIGITAL</span>
                </div>
                <div className="border border-primary p-3 bg-surface">
                  <span className="text-primary text-headline-md block font-bold">4.2 Jam</span>
                  <span className="font-label-caps text-label-caps text-on-surface">WAKTU TERBUANG</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Pull-Quote Matrix */}
          <div className="md:col-span-7 p-margin md:p-space-xl flex flex-col justify-center bg-surface relative">
            <div className="max-w-xl mx-auto space-y-space-lg">
              <span className="font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant block">
                PRINSIP DASAR ARSITEKTUR NOTO
              </span>
              <blockquote className="font-editorial-lead text-headline-lg md:text-display font-light italic leading-tight text-primary border-l-4 border-secondary pl-space-md py-2">
                “Semakin sedikit yang terlihat, semakin fokus otak bekerja.”
              </blockquote>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Aplikasi produktivitas konvensional justru menuntut kamu untuk merapikan folder, memberi tag tak berujung, dan mengelola database mikro yang rumit. NOTO menghapus semua friksi itu: hanya kanvas monokrom yang tegas, jadwal hari ini, dan keheningan berpikir.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — WHAT IS NOTO */}
      <section className="border-b border-primary bg-surface" id="features">
        <div className="p-margin md:p-space-xl border-b border-primary flex flex-col md:flex-row md:items-end justify-between gap-space-md">
          <div>
            <span className="font-label-caps text-label-caps uppercase text-secondary font-bold tracking-widest">
              [ 02 — THE APPARATUS ]
            </span>
            <h2 className="font-display text-headline-lg-mobile md:text-headline-lg font-bold tracking-tight uppercase text-primary mt-1">
              Not another productivity app.
            </h2>
          </div>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md">
            NOTO dibuat untuk membantu kamu melihat apa yang penting, menentukan langkah berikutnya, dan benar-benar mengerjakannya.
          </p>
        </div>

        {/* 3 Core Elements Asymmetric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-primary">
          {/* Pillar 01: TASK */}
          <a
            href="#showcase-tasks"
            className="p-margin md:p-space-lg flex flex-col justify-between hover:bg-surface-container transition-colors duration-150 group block"
          >
            <div>
              <div className="flex justify-between items-center mb-space-lg">
                <span className="font-display text-headline-lg font-bold text-primary">01</span>
                <span className="font-label-caps text-label-caps uppercase border border-primary px-2 py-0.5">INTI UTAMA</span>
              </div>
              <h3 className="font-display text-headline-md font-bold text-primary uppercase mb-space-sm group-hover:text-secondary transition-colors">
                TASK
              </h3>
              <p className="font-body-md text-body-md text-on-surface leading-relaxed">
                Hanya apa yang perlu dikerjakan hari ini. Tanpa tumpukan daftar yang membebani pikiran atau hierarki folder yang membingungkan.
              </p>
            </div>
            <div className="mt-space-lg pt-space-sm border-t border-primary/20 flex items-center justify-between font-label-caps text-label-caps text-on-surface-variant">
              <span>LIMIT 3-5 TUGAS / HARI</span>
              <span className="material-symbols-outlined text-sm">check_box</span>
            </div>
          </a>

          {/* Pillar 02: FOCUS */}
          <a
            href="#showcase-focus"
            className="p-margin md:p-space-lg flex flex-col justify-between bg-surface-container-low hover:bg-surface-container transition-colors duration-150 group block"
          >
            <div>
              <div className="flex justify-between items-center mb-space-lg">
                <span className="font-display text-headline-lg font-bold text-secondary">02</span>
                <span className="font-label-caps text-label-caps uppercase bg-secondary text-on-primary px-2 py-0.5">ISOLASI WAKTU</span>
              </div>
              <h3 className="font-display text-headline-md font-bold text-primary uppercase mb-space-sm group-hover:text-secondary transition-colors">
                FOCUS
              </h3>
              <p className="font-body-md text-body-md text-on-surface leading-relaxed">
                Sesi terisolasi dengan batas waktu nyata. Menjaga atensi dari distraksi digital melalui timer ritmis dan audio latar netral.
              </p>
            </div>
            <div className="mt-space-lg pt-space-sm border-t border-primary/20 flex items-center justify-between font-label-caps text-label-caps text-on-surface-variant">
              <span>INTERVAL 25 / 50 MENIT</span>
              <span className="material-symbols-outlined text-sm">timer</span>
            </div>
          </a>

          {/* Pillar 03: NOTES */}
          <a
            href="#showcase-notes"
            className="p-margin md:p-space-lg flex flex-col justify-between hover:bg-surface-container transition-colors duration-150 group block"
          >
            <div>
              <div className="flex justify-between items-center mb-space-lg">
                <span className="font-display text-headline-lg font-bold text-primary">03</span>
                <span className="font-label-caps text-label-caps uppercase border border-primary px-2 py-0.5">MEMORI INSTAN</span>
              </div>
              <h3 className="font-display text-headline-md font-bold text-primary uppercase mb-space-sm group-hover:text-secondary transition-colors">
                NOTES
              </h3>
              <p className="font-body-md text-body-md text-on-surface leading-relaxed">
                Menangkap ide sekilas dalam hitungan detik sebelum hilang tanpa jejak. Lembar kertas bersih digital tanpa pemformatan berlebih.
              </p>
            </div>
            <div className="mt-space-lg pt-space-sm border-t border-primary/20 flex items-center justify-between font-label-caps text-label-caps text-on-surface-variant">
              <span>SCRATCHPAD MINIMALIS</span>
              <span className="material-symbols-outlined text-sm">edit_note</span>
            </div>
          </a>
        </div>
      </section>

      {/* SECTION 4 — HOW NOTO WORKS */}
      <section className="border-b border-primary bg-surface-container-high">
        <div className="p-margin md:px-margin-desktop py-space-lg border-b border-primary">
          <span className="font-label-caps text-label-caps uppercase text-secondary font-bold tracking-widest">
            [ 03 — OPERATIONAL METHODOLOGY ]
          </span>
          <h2 className="font-display text-headline-lg-mobile md:text-headline-lg font-bold tracking-tight uppercase text-primary mt-1">
            HOW NOTO WORKS.
          </h2>
        </div>

        {/* Flow Progression Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-primary">
          <div className="p-margin md:p-space-md bg-surface flex flex-col justify-between">
            <div className="space-y-space-sm">
              <span className="font-label-caps text-label-caps text-secondary font-bold">TAHAP 01</span>
              <h3 className="font-display text-headline-md font-bold text-primary">PLAN.</h3>
              <p className="font-body-md text-body-md text-on-surface">
                Keluarkan semua hal dari kepala di awal pagi. Tumpahkan agenda mentah ke dalam kotak tunggu tanpa kurasi awal.
              </p>
            </div>
            <div className="mt-space-md pt-space-xs border-t border-primary/20 font-label-caps text-label-caps text-on-surface-variant flex items-center justify-between">
              <span>INPUT CEPAT</span>
              <span>→</span>
            </div>
          </div>

          <div className="p-margin md:p-space-md bg-surface flex flex-col justify-between">
            <div className="space-y-space-sm">
              <span className="font-label-caps text-label-caps text-secondary font-bold">TAHAP 02</span>
              <h3 className="font-display text-headline-md font-bold text-primary">DECIDE.</h3>
              <p className="font-body-md text-body-md text-on-surface">
                Pilih maksimal 3 tugas utama yang jika selesai, akan membuat hari kamu berarti. Sisanya dijadwalkan ulang.
              </p>
            </div>
            <div className="mt-space-md pt-space-xs border-t border-primary/20 font-label-caps text-label-caps text-on-surface-variant flex items-center justify-between">
              <span>PRIORITAS KETAT</span>
              <span>→</span>
            </div>
          </div>

          <div className="p-margin md:p-space-md bg-surface flex flex-col justify-between">
            <div className="space-y-space-sm">
              <span className="font-label-caps text-label-caps text-secondary font-bold">TAHAP 03</span>
              <h3 className="font-display text-headline-md font-bold text-primary">FOCUS.</h3>
              <p className="font-body-md text-body-md text-on-surface">
                Kunci layar pada satu tugas aktif. Aktifkan hitungan mundur hening dan selesaikan satu blok tanpa tab browsing terbuka.
              </p>
            </div>
            <div className="mt-space-md pt-space-xs border-t border-primary/20 font-label-caps text-label-caps text-on-surface-variant flex items-center justify-between">
              <span>MONO-TASKING</span>
              <span>→</span>
            </div>
          </div>

          <div className="p-margin md:p-space-md bg-surface flex flex-col justify-between">
            <div className="space-y-space-sm">
              <span className="font-label-caps text-label-caps text-secondary font-bold">TAHAP 04</span>
              <h3 className="font-display text-headline-md font-bold text-primary">COMPLETE.</h3>
              <p className="font-body-md text-body-md text-on-surface">
                Tandai selesai. Nikmati kepuasan psikologis garis coretan hitam tegas dan rasakan beban kognitif terangkat total.
              </p>
            </div>
            <div className="mt-space-md pt-space-xs border-t border-primary/20 font-label-caps text-label-caps text-on-surface-variant flex items-center justify-between">
              <span>HASIL TUNTAS</span>
              <span>✓</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — NOTO PRODUCT SHOWCASE (INTERACTIVE TACTILE BENCH) */}
      <section className="border-b border-primary bg-surface py-space-xl px-margin md:px-margin-desktop" id="showcase">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-primary pb-space-md mb-space-xl">
            <div>
              <span className="font-label-caps text-label-caps uppercase text-secondary font-bold tracking-widest">
                [ 04 — ANTARMUKA FISIKAL & DIGITAL ]
              </span>
              <h2 className="font-display text-headline-lg-mobile md:text-headline-lg font-bold tracking-tight uppercase text-primary mt-1">
                THE NOTO INTERFACE.
              </h2>
            </div>
            <p className="font-editorial-lead text-editorial-lead text-on-surface italic mt-2 md:mt-0">
              Didesain menyerupai lembaran buku agenda cetak kelas atelier. Coba instrumen di bawah:
            </p>
          </div>

          {/* UI Mockups Bento Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-space-md">
            {/* Mockup 1: Task Management Stack (7 Cols) */}
            <div
              id="showcase-tasks"
              className="md:col-span-7 border border-primary bg-surface p-space-md flex flex-col justify-between shadow-[4px_4px_0px_#000000] relative"
            >
              <div>
                <div className="flex justify-between items-center border-b border-primary pb-space-sm mb-space-md">
                  <span className="font-label-caps text-label-caps uppercase text-primary font-bold">
                    NOTO // HARI INI — RABU, 24 OKTOBER
                  </span>
                  <span className="font-label-caps text-label-caps text-secondary font-bold">
                    {activeCount} TUGAS AKTIF {completedCount > 0 && `(${completedCount} SELESAI)`}
                  </span>
                </div>

                <div className="space-y-2">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`p-space-sm flex items-center justify-between transition-all duration-150 ${
                        task.isCurrent && !task.completed
                          ? 'border-2 border-primary bg-surface ring-1 ring-primary/20'
                          : task.completed
                          ? 'border border-primary bg-surface-container opacity-80'
                          : 'border border-primary bg-surface hover:bg-surface-container-low'
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1 mr-2">
                        <button
                          type="button"
                          onClick={() => toggleTask(task.id)}
                          className="cursor-pointer flex-shrink-0"
                          title={task.completed ? 'Batalkan selesai' : 'Tandai selesai'}
                        >
                          {task.completed ? (
                            <span className="w-4 h-4 border border-primary bg-primary flex items-center justify-center text-[10px] text-white">
                              ✓
                            </span>
                          ) : task.isCurrent ? (
                            <span className="w-4 h-4 border-2 border-secondary inline-block"></span>
                          ) : (
                            <span className="w-4 h-4 border border-primary inline-block"></span>
                          )}
                        </button>
                        <span
                          onClick={() => toggleTask(task.id)}
                          className={`font-display text-sm md:text-base cursor-pointer select-none ${
                            task.completed
                              ? 'line-through text-on-surface-variant font-medium'
                              : task.isCurrent
                              ? 'font-bold text-primary'
                              : 'font-medium text-primary'
                          }`}
                        >
                          {task.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {task.isCurrent && !task.completed ? (
                          <span className="bg-secondary text-on-primary font-label-caps text-label-caps px-2 py-0.5 uppercase tracking-wider">
                            SEKARANG
                          </span>
                        ) : (
                          <span className="font-label-caps text-label-caps text-on-surface-variant">
                            {task.time}
                          </span>
                        )}
                        {!task.completed && !task.isCurrent && (
                          <button
                            onClick={() => setAsCurrentTask(task.id)}
                            className="text-xs text-on-surface-variant hover:text-secondary p-0.5 cursor-pointer"
                            title="Jadikan fokus sekarang"
                          >
                            <span className="material-symbols-outlined text-[16px]">priority_high</span>
                          </button>
                        )}
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="text-xs text-on-surface-variant hover:text-error p-0.5 cursor-pointer"
                          title="Hapus tugas"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Inline add task form */}
                  {isAddingTask && (
                    <form
                      onSubmit={handleAddTask}
                      className="border border-dashed border-primary p-2 bg-surface-container-low flex gap-2"
                    >
                      <input
                        type="text"
                        value={newTaskInput}
                        onChange={(e) => setNewTaskInput(e.target.value)}
                        placeholder="Ketik tugas esensial hari ini..."
                        autoFocus
                        className="w-full bg-transparent border-0 px-2 py-1 text-sm font-display text-primary outline-none"
                      />
                      <button
                        type="submit"
                        className="bg-primary text-on-primary px-3 py-1 text-xs font-label-caps uppercase cursor-pointer"
                      >
                        Simpan
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingTask(false);
                          setNewTaskInput('');
                        }}
                        className="border border-primary px-2 py-1 text-xs font-label-caps uppercase cursor-pointer"
                      >
                        Batal
                      </button>
                    </form>
                  )}
                </div>
              </div>

              <div className="mt-space-lg pt-space-sm border-t border-primary/20 flex justify-between items-center">
                <span className="font-label-caps text-label-caps text-on-surface-variant">
                  FITUR: DAILY STACK WITH PRIORITY LOCK
                </span>
                {!isAddingTask && (
                  <button
                    onClick={() => setIsAddingTask(true)}
                    className="font-display text-label-lg font-bold text-primary hover:text-secondary uppercase tracking-tight cursor-pointer"
                  >
                    + TULIS TUGAS BARU
                  </button>
                )}
              </div>
            </div>

            {/* Mockup 2: Focus Mode (5 Cols) */}
            <div
              id="showcase-focus"
              className="md:col-span-5 border border-primary bg-surface-container-high p-space-md flex flex-col justify-between shadow-[4px_4px_0px_#000000]"
            >
              <div>
                <div className="flex justify-between items-center border-b border-primary pb-space-sm mb-space-md">
                  <span className="font-label-caps text-label-caps uppercase text-secondary font-bold flex items-center gap-1">
                    SESI FOKUS TERKUNCI
                    {isTimerRunning && (
                      <span className="w-2 h-2 rounded-full bg-secondary animate-pulse inline-block"></span>
                    )}
                  </span>
                  <span className="material-symbols-outlined text-[16px]">lock</span>
                </div>

                <div className="text-center py-space-lg">
                  <span className="font-display text-display font-bold tracking-tighter text-primary block leading-none tabular-nums">
                    {formatTime(timerSeconds)}
                  </span>
                  <span className="font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant mt-2 block">
                    {isTimerRunning
                      ? 'INTERVAL KE-3 // DEEP WORK BERLANGSUNG'
                      : 'INTERVAL KE-3 // SIAP UNTUK DEEP WORK'}
                  </span>

                  <div className="flex items-center justify-center gap-2 mt-space-md">
                    <button
                      onClick={toggleAmbientSound}
                      className={`inline-flex items-center gap-2 border border-primary px-3 py-1 cursor-pointer transition-colors ${
                        ambientSound === 'rain'
                          ? 'bg-surface font-bold text-primary'
                          : 'bg-surface-container text-on-surface-variant'
                      }`}
                      title="Klik untuk menyalakan/mematikan white noise suasana hujan"
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          ambientSound === 'rain' ? 'bg-secondary animate-pulse' : 'bg-outline'
                        }`}
                      ></span>
                      <span className="font-label-caps text-label-caps">
                        AMBIENT: {ambientSound === 'rain' ? 'RAIN AT DAGO (ON)' : 'MUTED (OFF)'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-t border-primary/20 pt-space-sm flex gap-2">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="w-full bg-primary text-on-primary font-label-caps text-label-caps py-2 uppercase hover:bg-secondary transition-colors cursor-pointer"
                >
                  {isTimerRunning ? 'JEDA SEBENTAR' : 'MULAI SESI'}
                </button>
                <button
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimerSeconds(25 * 60);
                  }}
                  className="w-full border border-primary bg-surface font-label-caps text-label-caps py-2 uppercase hover:bg-surface-container transition-colors cursor-pointer"
                >
                  RESET 25M
                </button>
              </div>
            </div>

            {/* Mockup 3: Micro Notes (6 Cols) */}
            <div
              id="showcase-notes"
              className="md:col-span-6 border border-primary bg-surface p-space-md flex flex-col justify-between shadow-[4px_4px_0px_#000000]"
            >
              <div>
                <div className="flex justify-between items-center border-b border-primary pb-space-sm mb-space-md">
                  <span className="font-label-caps text-label-caps uppercase text-primary font-bold">
                    MICRO NOTES // CATATAN CEPAT
                  </span>
                  <div className="flex items-center gap-2">
                    {noteCopied && (
                      <span className="font-label-caps text-label-caps text-secondary font-bold">
                        TERSALIN!
                      </span>
                    )}
                    <span className="font-label-caps text-label-caps text-on-surface-variant">AUTO-SAVED</span>
                  </div>
                </div>

                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  rows={4}
                  className="w-full font-body-md text-body-md italic text-on-surface p-3 bg-surface-container-low border border-dashed border-primary/40 focus:border-solid focus:border-primary outline-none resize-none leading-relaxed"
                  placeholder="Tulis ide kilat di sini sebelum menguap..."
                />
              </div>

              <div className="pt-space-sm flex justify-between items-center font-label-caps text-label-caps text-on-surface-variant mt-space-sm">
                <div className="flex items-center gap-2">
                  <span>UNFORMATTED SCRATCHPAD</span>
                  <span>•</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(noteContent);
                      setNoteCopied(true);
                      setTimeout(() => setNoteCopied(false), 2000);
                    }}
                    className="text-primary hover:text-secondary underline cursor-pointer"
                  >
                    SALIN
                  </button>
                </div>
                <span>{noteContent.length} KARAKTER</span>
              </div>
            </div>

            {/* Mockup 4: AI Productivity Coach (6 Cols) */}
            <div className="md:col-span-6 border border-primary bg-surface-container-low p-space-md flex flex-col justify-between shadow-[4px_4px_0px_#000000]">
              <div>
                <div className="flex justify-between items-center border-b border-primary pb-space-sm mb-space-md">
                  <span className="font-label-caps text-label-caps uppercase text-secondary font-bold flex items-center gap-1">
                    NOTO INTEL // ASISTEN LOGIKA
                  </span>
                  <span className="material-symbols-outlined text-[16px] text-secondary">psychology</span>
                </div>

                <div className="p-3 bg-surface border border-primary space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="font-label-caps text-label-caps text-secondary font-bold">
                      INSIGHT HARIAN:
                    </div>
                    <span className="font-label-caps text-label-caps text-on-surface-variant">
                      SINKRONISASI AKTIF
                    </span>
                  </div>
                  <p className="font-body-md text-body-md text-primary font-medium">
                    {intelVersion % 2 === 1
                      ? `"${completedCount} tugas prioritas selesai, tersisa ${activeCount} agenda aktif. Tingkat konsentrasi puncak tercapai pada interval kedua. Disarankan istirahat tanpa layar 20 menit."`
                      : `"Pola kerja ritmis terdeteksi: 1 tugas sedang menjadi jangkar utama. Jangan membuka tab sekunder sebelum interval deep work ini selesai tuntas."`}
                  </p>
                </div>
              </div>

              <div className="pt-space-sm flex justify-between items-center font-label-caps text-label-caps text-on-surface-variant mt-space-sm">
                <div className="flex items-center gap-2">
                  <span>ALGORITMA LOKAL PRIVAT</span>
                  <span>•</span>
                  <button
                    onClick={() => setIntelVersion((v) => v + 1)}
                    className="text-primary hover:text-secondary underline cursor-pointer"
                  >
                    REFRESH ANALISIS
                  </button>
                </div>
                <span>0 DATA DIBAGIKAN</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK EXPLORE BANNER (Routes to About Us & Blog) */}
      <section className="border-b border-primary bg-surface-container-low py-space-lg px-margin md:px-margin-desktop">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-primary border border-primary bg-surface">
          <div className="p-space-lg flex flex-col justify-between">
            <div>
              <span className="font-label-caps text-label-caps text-secondary font-bold uppercase tracking-wider block mb-1">
                FILOSOFI & LATAR BELAKANG
              </span>
              <h3 className="font-display text-headline-md font-bold text-primary uppercase">
                ABOUT NOTO STUDIO
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                Pelajari manifesto hidup terarah, nilai-nilai dasar, dan alasan mengapa kesederhanaan monokrom kami mengalahkan aplikasi rumit lainnya.
              </p>
            </div>
            <div className="mt-space-md pt-space-xs">
              <button
                onClick={() => onNavigate('about')}
                className="font-display text-label-lg font-bold text-primary hover:text-secondary inline-flex items-center gap-2 cursor-pointer"
              >
                Baca Tentang Kami →
              </button>
            </div>
          </div>

          <div className="p-space-lg flex flex-col justify-between">
            <div>
              <span className="font-label-caps text-label-caps text-secondary font-bold uppercase tracking-wider block mb-1">
                DISPATCHES ON ATTENTION
              </span>
              <h3 className="font-display text-headline-md font-bold text-primary uppercase">
                THE NOTO JOURNAL (BLOG)
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                Eksplorasi artikel dan studi kasus tentang cara menata fokus, mengelola daftar tugas tanpa stres, dan membangun rutinitas bermakna.
              </p>
            </div>
            <div className="mt-space-md pt-space-xs">
              <button
                onClick={() => onNavigate('blog')}
                className="font-display text-label-lg font-bold text-primary hover:text-secondary inline-flex items-center gap-2 cursor-pointer"
              >
                Buka Arsip Blog →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9 — DOWNLOAD NOTO (CONVERSION) */}
      <section className="border-b border-primary bg-primary text-on-primary py-space-xl px-margin md:px-margin-desktop" id="download">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-space-lg items-center">
          <div className="md:col-span-7 space-y-space-md">
            <div className="inline-flex items-center gap-2 border border-on-primary/30 px-space-sm py-1 font-label-caps text-label-caps uppercase">
              <span className="w-2 h-2 bg-secondary inline-block"></span>
              SIAP DIUNDUH SEKARANG
            </div>
            <h2 className="font-display text-display-mobile md:text-display font-bold tracking-tighter uppercase text-on-primary leading-none">
              Your day is waiting.
            </h2>
            <p className="font-editorial-lead text-editorial-lead text-inverse-primary max-w-xl">
              Take NOTO with you. Organize what matters, focus on what needs to be done, and get things done.
            </p>
            <div className="pt-space-sm flex flex-col sm:flex-row gap-space-sm">
              <button
                onClick={onOpenDownload}
                className="text-center bg-on-primary text-primary font-label-lg text-label-lg uppercase px-space-lg py-space-md tracking-wider border border-on-primary hover:bg-secondary hover:text-on-primary hover:border-secondary transition-colors duration-150 cursor-pointer"
              >
                [ Download NOTO ]
              </button>
              <a
                className="text-center bg-transparent text-on-primary font-label-lg text-label-lg uppercase px-space-lg py-space-md tracking-wider border border-on-primary/50 hover:border-on-primary transition-colors duration-150"
                href="#showcase"
              >
                Coba Workbench Langsung →
              </a>
            </div>
            {/* Platform Badges */}
            <div className="flex flex-wrap items-center gap-space-md pt-space-sm font-label-caps text-label-caps text-inverse-primary border-t border-on-primary/20">
              <span className="flex items-center gap-1 cursor-pointer hover:text-white" onClick={onOpenDownload}>
                <span className="material-symbols-outlined text-sm">phone_iphone</span> iOS APP STORE
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 cursor-pointer hover:text-white" onClick={onOpenDownload}>
                <span className="material-symbols-outlined text-sm">android</span> ANDROID GOOGLE PLAY
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 cursor-pointer hover:text-white" onClick={onOpenDownload}>
                <span className="material-symbols-outlined text-sm">desktop_windows</span> INSTALL PWA
              </span>
            </div>
          </div>

          {/* QR Code Physical Card */}
          <div className="md:col-span-5 flex justify-center md:justify-end">
            <div className="bg-surface text-primary border border-surface p-space-lg max-w-xs w-full shadow-[8px_8px_0px_#aa361e]">
              <div className="flex justify-between items-center border-b border-primary pb-space-xs mb-space-md">
                <span className="font-label-caps text-label-caps uppercase font-bold text-primary">INSTANT SYNC</span>
                <span className="font-label-caps text-label-caps text-secondary">MOBILE LINK</span>
              </div>
              <div
                className="aspect-square bg-surface border-2 border-primary p-3 flex flex-col justify-between cursor-pointer hover:border-secondary transition-colors"
                onClick={onOpenDownload}
                title="Klik untuk membuka opsi unduh"
              >
                <div className="flex justify-between">
                  <div className="w-8 h-8 border-4 border-primary p-1">
                    <div className="w-full h-full bg-primary"></div>
                  </div>
                  <div className="w-8 h-8 border-4 border-primary p-1">
                    <div className="w-full h-full bg-primary"></div>
                  </div>
                </div>
                <div className="text-center font-display font-bold text-headline-sm tracking-widest text-primary">
                  N O T O
                </div>
                <div className="flex justify-between items-end">
                  <div className="w-8 h-8 border-4 border-primary p-1">
                    <div className="w-full h-full bg-primary"></div>
                  </div>
                  <div className="w-6 h-6 bg-secondary"></div>
                </div>
              </div>
              <p className="font-body-md text-body-md text-center mt-space-sm text-on-surface">
                Pindai untuk mengunduh langsung ke ponsel kamu.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
