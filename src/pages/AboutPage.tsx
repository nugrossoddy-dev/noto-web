import React from 'react';
import { PageRoute } from '../types';

interface AboutPageProps {
  onNavigate: (page: PageRoute) => void;
  onOpenDownload: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, onOpenDownload }) => {
  return (
    <div className="bg-background text-on-background">
      {/* EDITORIAL HEADER BANNER */}
      <div className="border-b border-primary bg-surface-container-high py-space-xs px-margin text-center overflow-hidden">
        <p className="font-label-caps text-label-caps uppercase tracking-widest text-primary flex items-center justify-center gap-3">
          <span>TENTANG KAMI</span>
          <span>•</span>
          <span>FILOSOFI & MANIFESTO</span>
          <span>—</span>
          <span>NOTO STUDIO INDONESIA</span>
        </p>
      </div>

      {/* HERO OF ABOUT US */}
      <section className="border-b border-primary bg-surface py-space-xl px-margin md:px-margin-desktop">
        <div className="max-w-6xl mx-auto space-y-space-md">
          <span className="font-label-caps text-label-caps uppercase text-secondary font-bold tracking-widest block">
            [ ABOUT NOTO // EST. 2025 ]
          </span>
          <h1 className="font-display text-display-mobile md:text-display font-bold tracking-tighter uppercase text-primary leading-none">
            Why NOTO exists.
          </h1>
          <p className="font-editorial-lead text-editorial-lead text-on-surface max-w-3xl leading-relaxed">
            Karena hidup yang lebih teratur seharusnya tidak membutuhkan sistem yang semakin rumit. Kami menciptakan NOTO untuk membebaskan kreator dari ilusi kesibukan palsu.
          </p>
        </div>
      </section>

      {/* SECTION 1 — BRAND MANIFESTO WITH FIG. 02 PHOTO */}
      <section className="border-b border-primary bg-surface-container-low" id="manifesto">
        <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-primary">
          {/* Manifesto Left Column */}
          <div className="md:col-span-6 p-margin md:p-space-xl flex flex-col justify-between">
            <div className="space-y-space-md">
              <span className="font-label-caps text-label-caps uppercase text-secondary font-bold tracking-widest">
                [ 01 — MANIFESTO KEHIDUPAN ]
              </span>
              <h2 className="font-display text-headline-lg-mobile md:text-headline-lg font-bold tracking-tight uppercase text-primary leading-tight">
                Productivity is not about doing more.
              </h2>
              <p className="font-editorial-lead text-editorial-lead text-on-surface leading-relaxed">
                Produktivitas adalah tentang memberi perhatian penuh pada hal yang benar-benar penting.
              </p>
              <div className="space-y-4 pt-space-sm font-body-md text-body-md text-on-surface">
                <p>
                  Kita hidup di era di mana kita dibanjiri notifikasi dan ilusi sibuk yang menguras energi batin. Kebanyakan aplikasi modern justru memaksa kita menjadi mesin pencatat data—mengatur status, label warna-warni, dan grafik produktivitas yang hanya memuaskan ego sesaat.
                </p>
                <p>
                  NOTO mengembalikan kendali ke tangan Anda melalui lima prinsip terukur:
                </p>
                <div className="grid grid-cols-1 gap-2 pt-space-xs font-display text-label-lg">
                  <div className="border-l-2 border-primary pl-3 py-1.5 bg-surface">
                    • <strong>Better time management:</strong> Menghormati batasan jam harian secara tegas.
                  </div>
                  <div className="border-l-2 border-primary pl-3 py-1.5 bg-surface">
                    • <strong>Clearer priorities:</strong> Berani menolak hal-hal sekunder yang mengganggu.
                  </div>
                  <div className="border-l-2 border-primary pl-3 py-1.5 bg-surface">
                    • <strong>Focus habits:</strong> Kebiasaan hening yang terlatih lewat isolasi waktu.
                  </div>
                  <div className="border-l-2 border-primary pl-3 py-1.5 bg-surface">
                    • <strong>Consistent routines:</strong> Ritme tetap yang berkelanjutan tanpa kelelahan mental.
                  </div>
                  <div className="border-l-2 border-primary pl-3 py-1.5 bg-surface">
                    • <strong>Less cognitive clutter:</strong> Pikiran yang lapang dan tenang setiap malam tiba.
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-space-lg mt-space-lg border-t border-primary/20">
              <span className="font-label-caps text-label-caps text-on-surface-variant block uppercase">
                STUDIO NOTO // JAKARTA SELATAN & BANDUNG
              </span>
            </div>
          </div>

          {/* Manifesto Right Column: Image */}
          <div className="md:col-span-6 relative bg-surface overflow-hidden min-h-[420px] md:min-h-full">
            <img
              alt="Warm sunlit wooden desk with hands holding an open notebook journal beside coffee and smartphone companion"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCn3n7h3k_qGxLDofVk0qT3MCk26J28zX-KAp95-7fockdwwJEX86WQn_fFiIN0QqxcYDdlx3C75oSGO_VjxGLK7fwE3rDaJw6iX-i7TOFqWowb4rtDwKEdwromQ3-cYzaW-C4eZS-PuJ4BkHjQg7VOwMLWNwnMsXyonEwrkbIaXppj6c1GQdS_DxVbSL2QoTUFTw7PFtxb3EaMRXkO7A20Cw0lKI9DtlqCmqCHHYJ-"
            />
            <div className="absolute bottom-0 right-0 bg-surface border-t border-l border-primary p-space-md max-w-xs">
              <p className="font-label-caps text-label-caps text-primary leading-normal uppercase">
                FIG. 02 — KESEIMBANGAN ANTARA MEDIUM ANALOG & INSTRUMEN DIGITAL.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — 4 FASE PERJALANAN NOTO & CORE TENETS */}
      <section className="border-b border-primary bg-surface-container" id="values">
        <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-primary">
          {/* Story & Genesis */}
          <div className="md:col-span-7 p-margin md:p-space-xl space-y-space-lg">
            <div>
              <span className="font-label-caps text-label-caps uppercase text-secondary font-bold tracking-widest">
                [ 02 — THE GENESIS ]
              </span>
              <h2 className="font-display text-headline-lg-mobile md:text-headline-lg font-bold tracking-tight uppercase text-primary mt-1">
                Evolusi Pemikiran.
              </h2>
              <p className="font-editorial-lead text-editorial-lead text-on-surface mt-space-sm leading-relaxed">
                Dari lembar catatan kertas di kedai kopi Kebayoran hingga aplikasi pendamping presisi.
              </p>
            </div>

            {/* Milestones Matrix */}
            <div className="space-y-space-sm pt-space-sm">
              <div className="border border-primary bg-surface p-space-sm shadow-[2px_2px_0px_#000000]">
                <span className="font-label-caps text-label-caps text-secondary font-bold">
                  FASE 01 // THE PROBLEM (2023)
                </span>
                <p className="font-body-md text-body-md text-on-surface mt-1">
                  Kelelahan menggunakan puluhan aplikasi manajemen proyek SaaS yang membuat kita menghabiskan 40% waktu hanya untuk menata daftar dan merapikan folder daripada benar-benar mengeksekusi karya.
                </p>
              </div>
              <div className="border border-primary bg-surface p-space-sm shadow-[2px_2px_0px_#000000]">
                <span className="font-label-caps text-label-caps text-secondary font-bold">
                  FASE 02 // THE IDEA (2024)
                </span>
                <p className="font-body-md text-body-md text-on-surface mt-1">
                  Menggabungkan filosofi disiplin editorial buku cetak atelier dengan keringkasan teknologi peramban modern. Tanpa algoritma rekomendasi adiktif, tanpa umpan berita sosial, tanpa fitur sia-sia.
                </p>
              </div>
              <div className="border border-primary bg-surface p-space-sm shadow-[2px_2px_0px_#000000]">
                <span className="font-label-caps text-label-caps text-secondary font-bold">
                  FASE 03 // THE PRODUCT (2025)
                </span>
                <p className="font-body-md text-body-md text-on-surface mt-1">
                  NOTO resmi dirilis di Jakarta sebagai instrumen produktivitas harian yang monokrom, tegas, dan menghargai ruang bernapas kognitif pengguna melalui trio: Task, Focus, dan Micro Notes.
                </p>
              </div>
              <div className="border border-primary bg-surface p-space-sm shadow-[2px_2px_0px_#000000]">
                <span className="font-label-caps text-label-caps text-secondary font-bold">
                  FASE 04 // THE VISION (MASA DEPAN)
                </span>
                <p className="font-body-md text-body-md text-on-surface mt-1">
                  Membangun komunitas kreator dan pekerja mandiri Indonesia yang bangga akan substansi karya nyata daripada sensasi kesibukan semu.
                </p>
              </div>
            </div>
          </div>

          {/* Values Typographic List */}
          <div className="md:col-span-5 p-margin md:p-space-xl bg-surface flex flex-col justify-between">
            <div>
              <span className="font-label-caps text-label-caps uppercase text-secondary font-bold tracking-widest block mb-space-md">
                [ 03 — LIMA NILAI UTAMA ]
              </span>
              <div className="divide-y divide-primary/20 border-t border-b border-primary">
                <div className="py-space-sm">
                  <span className="font-label-caps text-label-caps text-on-surface-variant">01</span>
                  <h3 className="font-display text-headline-md font-bold text-primary tracking-tight">
                    CLARITY
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Kejelasan mendahului kecepatan kerja. Jangan mulai sebelum Anda tahu tujuan akhir hari ini.
                  </p>
                </div>
                <div className="py-space-sm">
                  <span className="font-label-caps text-label-caps text-on-surface-variant">02</span>
                  <h3 className="font-display text-headline-md font-bold text-primary tracking-tight">
                    SIMPLICITY
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Hapus setiap tombol dan elemen visual hingga tak ada lagi yang dapat dikurangi tanpa merusak fungsi.
                  </p>
                </div>
                <div className="py-space-sm">
                  <span className="font-label-caps text-label-caps text-on-surface-variant">03</span>
                  <h3 className="font-display text-headline-md font-bold text-primary tracking-tight">
                    PRODUCTIVITY EMPOWERED
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Alat yang melayani kebebasan manusia, bukan perangkat yang menuntut perhatian konstan.
                  </p>
                </div>
                <div className="py-space-sm">
                  <span className="font-label-caps text-label-caps text-on-surface-variant">04</span>
                  <h3 className="font-display text-headline-md font-bold text-primary tracking-tight">
                    RELIABILITY
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Dapat diandalkan kapan saja secara offline penuh di perangkat Anda tanpa ketergantungan server asing.
                  </p>
                </div>
                <div className="py-space-sm">
                  <span className="font-label-caps text-label-caps text-on-surface-variant">05</span>
                  <h3 className="font-display text-headline-md font-bold text-secondary tracking-tight">
                    FOCUS FIRST
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Menjaga atensi dan konsentrasi adalah tindakan sakral yang membedakan kreator unggul.
                  </p>
                </div>
              </div>
            </div>
            <div className="pt-space-lg font-label-caps text-label-caps text-on-surface-variant">
              NILAI-NILAI DASAR NOTO STUDIO INDONESIA
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — STUDIO COLOPHON */}
      <section className="border-b border-primary bg-surface py-space-xl px-margin md:px-margin-desktop">
        <div className="max-w-4xl mx-auto border border-primary p-space-lg md:p-space-xl bg-surface-container-low shadow-[6px_6px_0px_#000000]">
          <span className="font-label-caps text-label-caps text-secondary font-bold uppercase tracking-widest block mb-2">
            COLOPHON // SPESIFIKASI KARYA
          </span>
          <h2 className="font-display text-headline-lg font-bold text-primary uppercase mb-4">
            Dirancang Tanpa Kompromi di Indonesia.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-display text-sm border-t border-primary/20 pt-4">
            <div>
              <span className="font-label-caps text-label-caps text-on-surface-variant block uppercase">
                TIPOGRAFI
              </span>
              <p className="text-primary font-bold mt-1">Newsreader (Serif Editorial)</p>
              <p className="text-primary font-bold">Space Grotesk (Display Brutalis)</p>
            </div>
            <div>
              <span className="font-label-caps text-label-caps text-on-surface-variant block uppercase">
                PRIVASI & ARSITEKTUR
              </span>
              <p className="text-primary font-bold mt-1">Local-First Storage</p>
              <p className="text-primary font-bold">Zero Telemetry Trackers</p>
            </div>
            <div>
              <span className="font-label-caps text-label-caps text-on-surface-variant block uppercase">
                STUDIO KOTA
              </span>
              <p className="text-primary font-bold mt-1">Jakarta Selatan — Studio Induk</p>
              <p className="text-primary font-bold">Bandung & Dago — Riset Fokus</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — NEXT STEP CTAS */}
      <section className="bg-surface-container py-space-xl px-margin md:px-margin-desktop border-b border-primary">
        <div className="max-w-4xl mx-auto text-center space-y-space-md">
          <span className="font-label-caps text-label-caps uppercase text-secondary font-bold tracking-widest">
            LANGKAH BERIKUTNYA
          </span>
          <h2 className="font-display text-display-mobile md:text-headline-lg font-bold uppercase text-primary">
            Mulai Hari dengan Kejelasan Total.
          </h2>
          <p className="font-editorial-lead text-editorial-lead text-on-surface-variant max-w-xl mx-auto">
            Gunakan antarmuka NOTO sekarang atau telusuri artikel riset di blog jurnal kami.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-space-sm pt-space-sm">
            <button
              onClick={() => onNavigate('home')}
              className="bg-primary text-on-primary font-label-lg text-label-lg uppercase px-space-lg py-space-md tracking-wider border border-primary hover:bg-secondary hover:border-secondary transition-colors cursor-pointer"
            >
              [ Coba Workbench di Home ]
            </button>
            <button
              onClick={() => onNavigate('blog')}
              className="bg-transparent text-primary font-label-lg text-label-lg uppercase px-space-lg py-space-md tracking-wider border border-primary hover:bg-surface transition-colors cursor-pointer"
            >
              [ Baca Noto Journal ]
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
