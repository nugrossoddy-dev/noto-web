import React, { useState } from 'react';
import { Article, PageRoute } from '../types';
import { ARTICLES } from '../data/articles';

interface BlogPageProps {
  onNavigate: (page: PageRoute) => void;
  onOpenDownload: () => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onNavigate, onOpenDownload }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['ALL', 'ANALYSIS', 'FRAMEWORK', 'PRACTICE', 'ROUTINES'];

  const filteredArticles = ARTICLES.filter((art) => {
    const matchesCategory = selectedCategory === 'ALL' || art.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.snippet.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-background text-on-background">
      {/* EDITORIAL BANNER */}
      <div className="border-b border-primary bg-surface-container-high py-space-xs px-margin text-center overflow-hidden">
        <p className="font-label-caps text-label-caps uppercase tracking-widest text-primary flex items-center justify-center gap-3">
          <span>NOTO JOURNAL</span>
          <span>•</span>
          <span>DISPATCHES ON ATTENTION</span>
          <span>—</span>
          <span>EDISI CETAK & DIGITAL</span>
        </p>
      </div>

      {/* ARTICLE READER VIEW (WHEN AN ARTICLE IS ACTIVELY OPEN) */}
      {activeArticle ? (
        <article className="border-b border-primary bg-surface py-space-xl px-margin md:px-margin-desktop">
          <div className="max-w-3xl mx-auto">
            {/* Top Navigation Back */}
            <div className="flex justify-between items-center border-b border-primary pb-space-sm mb-space-lg">
              <button
                onClick={() => setActiveArticle(null)}
                className="font-label-lg font-bold text-primary hover:text-secondary inline-flex items-center gap-2 cursor-pointer uppercase"
              >
                ← Kembali ke Semua Artikel
              </button>
              <div className="font-label-caps text-label-caps text-secondary font-bold">
                {activeArticle.category} • {activeArticle.readTime}
              </div>
            </div>

            {/* Article Header */}
            <div className="space-y-space-sm mb-space-lg">
              <span className="font-label-caps text-label-caps text-on-surface-variant block">
                {activeArticle.edition} • {activeArticle.date}
              </span>
              <h1 className="font-display text-headline-lg-mobile md:text-headline-lg font-bold text-primary tracking-tight leading-tight">
                {activeArticle.title}
              </h1>
              <div className="font-label-caps text-label-caps text-primary border-l-2 border-secondary pl-3 py-1 font-bold">
                Oleh {activeArticle.author}
              </div>
            </div>

            {/* Article Body */}
            <div className="space-y-6 font-body-lg text-body-lg text-on-surface leading-relaxed border-t border-b border-primary/20 py-space-lg">
              {activeArticle.fullText.map((paragraph, idx) => (
                <p key={idx} className="first-of-type:text-editorial-lead first-of-type:font-normal first-of-type:text-primary">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Article Footer & Actions */}
            <div className="mt-space-lg pt-space-sm flex flex-col sm:flex-row justify-between items-center gap-space-sm">
              <div className="font-label-caps text-label-caps text-on-surface-variant">
                STUDIO NOTO JOURNAL // ARSIP ATENSI & PSIKOLOGI KERJA
              </div>
              <div className="flex items-center gap-space-sm">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Tautan artikel telah disalin ke papan klip.');
                  }}
                  className="border border-primary px-3 py-1.5 font-label-caps text-label-caps uppercase hover:bg-surface-container cursor-pointer"
                >
                  Salin Tautan
                </button>
                <button
                  onClick={() => setActiveArticle(null)}
                  className="bg-primary text-on-primary px-4 py-1.5 font-label-caps text-label-caps uppercase hover:bg-secondary cursor-pointer"
                >
                  Tutup Bacaan
                </button>
              </div>
            </div>
          </div>
        </article>
      ) : (
        /* MAIN BLOG LIST VIEW */
        <>
          {/* BLOG HEADER */}
          <section className="border-b border-primary bg-surface py-space-xl px-margin md:px-margin-desktop">
            <div className="max-w-6xl mx-auto space-y-space-md">
              <span className="font-label-caps text-label-caps uppercase text-secondary font-bold tracking-widest block">
                [ 06 — NOTO JOURNAL ]
              </span>
              <h1 className="font-display text-display-mobile md:text-display font-bold tracking-tighter uppercase text-primary leading-none">
                Dispatches on Attention.
              </h1>
              <p className="font-editorial-lead text-editorial-lead text-on-surface max-w-2xl leading-relaxed">
                Tulisan, esai kritis, dan kerangka praktis tentang manajemen fokus, ritme monotasking, dan psikologi kerja mendalam.
              </p>

              {/* FILTER & SEARCH BAR */}
              <div className="pt-space-md border-t border-primary/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-space-md">
                {/* Category Pills/Tabs */}
                <div className="flex flex-wrap items-center gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`font-label-caps text-label-caps px-3 py-1.5 uppercase transition-colors cursor-pointer border ${
                        selectedCategory === cat
                          ? 'bg-primary text-on-primary border-primary font-bold'
                          : 'bg-surface text-primary border-primary hover:bg-surface-container'
                      }`}
                    >
                      {cat === 'ALL' ? 'Semua Topik' : cat}
                    </button>
                  ))}
                </div>

                {/* Search Input */}
                <div className="w-full md:w-64 border border-primary bg-surface flex items-center px-2 py-1">
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant mr-1">
                    search
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari artikel..."
                    className="w-full bg-transparent font-display text-xs text-primary outline-none"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-xs text-on-surface-variant hover:text-primary cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* FEATURED SPOTLIGHT ARTICLE */}
          {filteredArticles.length > 0 && selectedCategory === 'ALL' && !searchQuery && (
            <section className="border-b border-primary bg-surface-container-low py-space-lg px-margin md:px-margin-desktop">
              <div className="max-w-6xl mx-auto">
                <div className="border border-primary bg-surface p-space-lg md:p-space-xl grid grid-cols-1 md:grid-cols-12 gap-space-lg shadow-[6px_6px_0px_#000000]">
                  <div className="md:col-span-8 space-y-space-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2 font-label-caps text-label-caps">
                        <span className="bg-secondary text-on-primary px-2 py-0.5 font-bold uppercase">
                          FEATURED ESSAY
                        </span>
                        <span className="text-secondary font-bold">
                          {filteredArticles[0].category} • {filteredArticles[0].readTime}
                        </span>
                      </div>
                      <h2 className="font-display text-headline-lg font-bold text-primary hover:text-secondary transition-colors cursor-pointer"
                          onClick={() => setActiveArticle(filteredArticles[0])}>
                        {filteredArticles[0].title}
                      </h2>
                      <p className="font-editorial-lead text-editorial-lead text-on-surface-variant mt-2 leading-relaxed">
                        {filteredArticles[0].snippet}
                      </p>
                    </div>

                    <div className="pt-space-md border-t border-primary/20 flex items-center justify-between font-label-caps text-label-caps">
                      <span>{filteredArticles[0].edition}</span>
                      <button
                        onClick={() => setActiveArticle(filteredArticles[0])}
                        className="bg-primary text-on-primary px-4 py-2 uppercase hover:bg-secondary transition-colors font-bold cursor-pointer"
                      >
                        Baca Esai Lengkap →
                      </button>
                    </div>
                  </div>

                  <div className="md:col-span-4 border-t md:border-t-0 md:border-l border-primary/20 pt-space-sm md:pt-0 md:pl-space-lg flex flex-col justify-between">
                    <div>
                      <span className="font-label-caps text-label-caps text-on-surface-variant block uppercase font-bold mb-2">
                        CATATAN EDITOR
                      </span>
                      <p className="font-body-md text-body-md text-on-surface leading-relaxed italic">
                        "Daftar yang terlalu panjang bukan pertanda produktivitas, melainkan simptom dari ketidakmampuan berkata tidak pada hal yang sekunder."
                      </p>
                    </div>
                    <div className="pt-4 font-label-caps text-label-caps text-secondary font-bold">
                      {filteredArticles[0].author}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ALL ARTICLES LIST MATRIX */}
          <section className="border-b border-primary bg-surface py-space-xl px-margin md:px-margin-desktop">
            <div className="max-w-6xl mx-auto">
              <div className="flex justify-between items-center border-b border-primary pb-space-sm mb-space-lg">
                <span className="font-label-caps text-label-caps uppercase text-secondary font-bold tracking-widest">
                  ARSIP TERBITAN // {filteredArticles.length} ARTIKEL DITEMUKAN
                </span>
                <span className="font-label-caps text-label-caps text-on-surface-variant">
                  KATEGORI: {selectedCategory}
                </span>
              </div>

              {filteredArticles.length === 0 ? (
                <div className="p-space-xl text-center border border-dashed border-primary">
                  <p className="font-display text-headline-sm font-bold text-primary">
                    Tidak ada artikel yang cocok dengan pencarian Anda.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory('ALL');
                      setSearchQuery('');
                    }}
                    className="mt-3 font-label-caps text-label-caps text-secondary underline cursor-pointer"
                  >
                    Reset Filter Pencarian
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-primary border-t border-b border-primary">
                  {filteredArticles.map((article) => (
                    <article
                      key={article.id}
                      onClick={() => setActiveArticle(article)}
                      className="py-space-md group hover:bg-surface-container transition-colors duration-150 grid grid-cols-1 md:grid-cols-12 gap-space-sm items-baseline cursor-pointer"
                    >
                      <div className="md:col-span-3 font-label-caps text-label-caps text-secondary font-bold">
                        {article.category} • {article.readTime}
                      </div>
                      <div className="md:col-span-6">
                        <h3 className="font-display text-headline-sm md:text-headline-md font-bold text-primary group-hover:text-secondary transition-colors">
                          {article.title}
                        </h3>
                        <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                          {article.snippet}
                        </p>
                        <span className="font-label-caps text-label-caps text-on-surface-variant block mt-2">
                          Penulis: {article.author}
                        </span>
                      </div>
                      <div className="md:col-span-3 md:text-right font-label-caps text-label-caps text-on-surface-variant flex md:justify-end items-center gap-2">
                        <span>{article.edition}</span>
                        <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                          arrow_forward
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* DISPATCH SUBSCRIPTION BOX */}
          <section className="bg-surface-container-high py-space-xl px-margin md:px-margin-desktop border-b border-primary">
            <div className="max-w-2xl mx-auto text-center space-y-space-md">
              <span className="font-label-caps text-label-caps uppercase text-secondary font-bold tracking-widest">
                LANGGANAN EDISI CETAK DIGITAL
              </span>
              <h2 className="font-display text-headline-lg font-bold text-primary uppercase">
                Terima Dispatches Setiap Minggu.
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Satu email reflektif setiap Minggu malam untuk mempersiapkan fokus dan pikiran Anda menghadapi Senin pagi.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert('Terima kasih. Anda telah terdaftar untuk menerima jurnal mingguan NOTO.');
                }}
                className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2"
              >
                <input
                  type="email"
                  required
                  placeholder="Masukkan alamat email Anda..."
                  className="flex-1 bg-surface border border-primary px-3 py-2 text-sm font-display text-primary outline-none"
                />
                <button
                  type="submit"
                  className="bg-primary text-on-primary px-5 py-2 font-label-caps text-label-caps uppercase tracking-wider hover:bg-secondary transition-colors cursor-pointer"
                >
                  Langganan
                </button>
              </form>
            </div>
          </section>
        </>
      )}
    </div>
  );
};
