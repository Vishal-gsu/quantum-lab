import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, ChevronRight, ChevronLeft, Clock, ArrowUp, Hash, GraduationCap } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { createMarkdownComponents, extractHeadings } from '../components/MarkdownRenderer';
import { docFiles } from '../lib/constants.ts';
import type { DocFile } from '../types/index.ts';

function TableOfContents({ headings, activeId }: { headings: { id: string; text: string; level: number }[]; activeId: string }) {
  return (
    <nav className="custom-scrollbar sticky top-28 max-h-[70vh] space-y-1 overflow-y-auto pr-3">
      <p className="mb-5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
        <Hash size={12} className="text-violet-400" />
        On this page
      </p>
      {headings.map(h => (
        <a
          key={h.id}
          href={`#${h.id}`}
          className={`block border-l-2 py-1.5 text-sm transition-all ${
            activeId === h.id
              ? 'border-teal-400 font-semibold text-teal-200'
              : 'border-transparent text-slate-500 hover:border-slate-600 hover:text-slate-300'
          }`}
          style={{ paddingLeft: `${(h.level - 1) * 14 + 12}px` }}
        >
          {h.text}
        </a>
      ))}
    </nav>
  );
}

function ProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const main = document.querySelector('main');
      if (!main) return;
      const scrollTop = main.scrollTop;
      const scrollHeight = main.scrollHeight - main.clientHeight;
      setProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);
    };

    const main = document.querySelector('main');
    main?.addEventListener('scroll', handleScroll);
    return () => main?.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed left-0 right-0 top-0 z-50 h-0.5 bg-transparent">
      <motion.div
        className="h-full bg-gradient-to-r from-teal-400 via-violet-400 to-teal-300 shadow-[0_0_12px_rgba(45,212,191,0.5)]"
        style={{ width: `${progress}%` }}
        transition={{ duration: 0.12 }}
      />
    </div>
  );
}

export default function StudyView() {
  const { docId } = useParams<{ docId: string }>();
  const navigate = useNavigate();
  const [docContent, setDocContent] = useState('');
  const [activeHeadingId, setActiveHeadingId] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);

  const markdownComponents = useMemo(() => createMarkdownComponents(), [docId, docContent]);

  useEffect(() => {
    if (docId) {
      setDocContent('');
      fetch(`/docs/${docId}`)
        .then(res => res.text())
        .then(text => setDocContent(text))
        .catch(() => setDocContent('# Failed to load\n\nCould not load this document.'));
    }
  }, [docId]);

  useEffect(() => {
    if (!docId || !docContent) return;

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveHeadingId(entry.target.id);
          }
        }
      },
      { rootMargin: '-100px 0px -60% 0px', threshold: 0.1 }
    );

    const timer = setTimeout(() => {
      const headingEls = contentRef.current?.querySelectorAll('h1[id], h2[id], h3[id]');
      headingEls?.forEach(el => observer.observe(el));
    }, 300);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [docId, docContent]);

  const scrollToTop = useCallback(() => {
    document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const currentDocIndex = docFiles.findIndex((d: DocFile) => d.id === docId);
  const prevDoc = currentDocIndex > 0 ? docFiles[currentDocIndex - 1] : null;
  const nextDoc = currentDocIndex < docFiles.length - 1 ? docFiles[currentDocIndex + 1] : null;

  const headings = docContent ? extractHeadings(docContent) : [];

  if (docId) {
    return (
      <motion.div key="doc-reader" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
        <ProgressBar />

        <div className="mb-10 space-y-5">
          <button
            type="button"
            onClick={() => navigate('/study')}
            className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 transition hover:text-violet-300"
          >
            <ChevronLeft size={16} />
            All modules
          </button>
          <div className="flex flex-wrap items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-300 ring-1 ring-violet-400/30">
              <BookOpen size={28} />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-violet-300/90">Lesson</p>
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {docFiles.find((d: DocFile) => d.id === docId)?.title || 'Document'}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <Clock size={11} />
                  {docFiles.find((d: DocFile) => d.id === docId)?.time || '–'}
                </span>
                <span className="rounded-full bg-teal-500/15 px-2.5 py-0.5 text-teal-300 ring-1 ring-teal-500/25">
                  {docFiles.find((d: DocFile) => d.id === docId)?.level || '–'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid w-full grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_15.5rem] xl:gap-10 xl:items-start">
          <article
            ref={contentRef}
            className="markdown-study study-article min-w-0 w-full rounded-2xl border border-[var(--learn-border)] bg-gradient-to-b from-[#0e1525] to-[#0a101c] p-6 shadow-xl sm:p-8 lg:rounded-3xl lg:p-12 xl:p-14"
          >
            {docContent ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[[rehypeKatex, { strict: false, throwOnError: false, errorColor: '#f87171' }]]}
                components={markdownComponents}
              >
                {docContent}
              </ReactMarkdown>
            ) : (
              <div className="flex h-56 items-center justify-center">
                <div className="h-11 w-11 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
              </div>
            )}

            <div className="mt-16 grid gap-4 border-t border-white/10 pt-10 sm:grid-cols-2">
              {prevDoc ? (
                <button
                  type="button"
                  onClick={() => navigate(`/study/${prevDoc.id}`)}
                  className="rounded-2xl border border-[var(--learn-border)] bg-[var(--learn-surface)] p-6 text-left transition hover:border-teal-500/35"
                >
                  <p className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    <ChevronLeft size={12} />
                    Previous
                  </p>
                  <p className="text-base font-bold text-white">{prevDoc.title}</p>
                </button>
              ) : (
                <div />
              )}
              {nextDoc && (
                <button
                  type="button"
                  onClick={() => navigate(`/study/${nextDoc.id}`)}
                  className="rounded-2xl border border-[var(--learn-border)] bg-[var(--learn-surface)] p-6 text-right transition hover:border-violet-500/35 sm:col-start-2"
                >
                  <p className="mb-2 flex items-center justify-end gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Next
                    <ChevronRight size={12} />
                  </p>
                  <p className="text-base font-bold text-white">{nextDoc.title}</p>
                </button>
              )}
            </div>
          </article>

          {headings.length > 1 && (
            <aside className="hidden min-w-0 xl:block xl:w-full xl:max-w-[15.5rem]">
              <TableOfContents headings={headings} activeId={activeHeadingId} />
            </aside>
          )}
        </div>

        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-teal-600 text-white shadow-lg shadow-violet-900/40 transition hover:opacity-95"
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} />
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div key="study" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-12 pb-16">
      <section className="relative overflow-hidden rounded-3xl border border-[var(--learn-border)] bg-gradient-to-br from-violet-950/40 via-[#101a2e] to-[#080d18] p-8 sm:p-10">
        <div className="pointer-events-none absolute -right-16 top-0 h-48 w-48 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/25 bg-violet-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-violet-200">
              <GraduationCap size={14} />
              Curriculum
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">Your learning path</h2>
            <p className="mt-3 max-w-2xl text-base text-slate-400">
              {docFiles.length} modules — math, intuition, and code — from qubits to QML projects. Open any card to
              read in a distraction-free layout.
            </p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {docFiles.map((doc: DocFile, index: number) => (
          <motion.button
            key={doc.id}
            type="button"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            onClick={() => navigate(`/study/${doc.id}`)}
            className="group relative overflow-hidden rounded-2xl border border-[var(--learn-border)] bg-[var(--learn-surface)] p-7 text-left shadow-lg transition hover:border-violet-400/35 hover:bg-[var(--learn-surface-hover)] sm:p-8"
          >
            <span className="pointer-events-none absolute -right-2 -top-4 text-7xl font-black tabular-nums text-white/[0.04]">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="relative flex items-start justify-between gap-4">
              <div className="rounded-2xl bg-violet-500/15 p-4 text-violet-300 ring-1 ring-violet-400/25 transition group-hover:scale-105">
                <BookOpen size={26} />
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                <Clock size={11} />
                {doc.time}
              </span>
            </div>
            <h3 className="relative mt-6 text-xl font-bold leading-snug text-white sm:text-2xl">{doc.title}</h3>
            <div className="relative mt-5 flex items-center gap-3">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/5">
                <div
                  className={`h-full rounded-full ${
                    doc.level === 'Beginner'
                      ? 'w-1/4 bg-emerald-400'
                      : doc.level === 'Intermediate'
                        ? 'w-1/2 bg-amber-400'
                        : 'w-3/4 bg-violet-400'
                  }`}
                />
              </div>
              <span
                className={`text-[10px] font-bold uppercase tracking-wide ${
                  doc.level === 'Beginner'
                    ? 'text-emerald-400'
                    : doc.level === 'Intermediate'
                      ? 'text-amber-300'
                      : 'text-violet-300'
                }`}
              >
                {doc.level}
              </span>
            </div>
            <p className="relative mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-teal-300/90">
              Open module <ChevronRight size={14} className="transition group-hover:translate-x-0.5" />
            </p>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
