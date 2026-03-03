import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, ChevronRight, ChevronLeft, Clock, ArrowUp, Hash } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { markdownComponents, extractHeadings } from '../components/MarkdownRenderer.tsx';
import { docFiles } from '../lib/constants.ts';
import type { DocFile } from '../types/index.ts';

// ---------------------------------------------------------------------------
// Table of Contents component
// ---------------------------------------------------------------------------
function TableOfContents({ headings, activeId }: { headings: { id: string; text: string; level: number }[]; activeId: string }) {
    return (
        <nav className="sticky top-32 space-y-1 max-h-[70vh] overflow-y-auto custom-scrollbar pr-4">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 mb-6 flex items-center gap-2">
                <Hash size={12} /> On This Page
            </p>
            {headings.map(h => (
                <a
                    key={h.id}
                    href={`#${h.id}`}
                    className={`block text-sm py-1.5 transition-all border-l-2 ${activeId === h.id
                        ? 'text-blue-400 border-blue-500 font-bold'
                        : 'text-slate-500 border-transparent hover:text-slate-300 hover:border-slate-700'
                        }`}
                    style={{ paddingLeft: `${(h.level - 1) * 16 + 16}px` }}
                >
                    {h.text}
                </a>
            ))}
        </nav>
    );
}

// ---------------------------------------------------------------------------
// Reading Progress Bar
// ---------------------------------------------------------------------------
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
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-transparent">
            <motion.div
                className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 shadow-lg shadow-blue-500/20"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
            />
        </div>
    );
}

// ---------------------------------------------------------------------------
// StudyView Page
// ---------------------------------------------------------------------------
export default function StudyView() {
    const { docId } = useParams<{ docId: string }>();
    const navigate = useNavigate();
    const [docContent, setDocContent] = useState('');
    const [activeHeadingId, setActiveHeadingId] = useState('');
    const contentRef = useRef<HTMLDivElement>(null);

    // Fetch doc content
    useEffect(() => {
        if (docId) {
            setDocContent('');
            fetch(`/docs/${docId}`)
                .then(res => res.text())
                .then(text => setDocContent(text))
                .catch(() => setDocContent('# Failed to load\n\nCould not load this document.'));
        }
    }, [docId]);

    // Intersection observer for active heading tracking
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

        // Delay to let markdown render
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

    // Find prev/next modules
    const currentDocIndex = docFiles.findIndex((d: DocFile) => d.id === docId);
    const prevDoc = currentDocIndex > 0 ? docFiles[currentDocIndex - 1] : null;
    const nextDoc = currentDocIndex < docFiles.length - 1 ? docFiles[currentDocIndex + 1] : null;

    const headings = docContent ? extractHeadings(docContent) : [];

    // =========================================================================
    // Document Reader View
    // =========================================================================
    if (docId) {
        return (
            <motion.div key="doc-reader" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <ProgressBar />

                {/* Back button + title */}
                <div className="mb-12 space-y-6">
                    <button onClick={() => navigate('/study')} className="flex items-center gap-3 text-xs font-black text-slate-500 hover:text-white transition-colors uppercase tracking-widest">
                        <ChevronLeft size={16} /> Back to Modules
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-600/20 rounded-2xl text-blue-500">
                            <BookOpen size={24} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-white tracking-tight">
                                {docFiles.find((d: DocFile) => d.id === docId)?.title || 'Document'}
                            </h1>
                            <div className="flex items-center gap-4 mt-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                                    <Clock size={10} /> {docFiles.find((d: DocFile) => d.id === docId)?.time || '–'}
                                </span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">
                                    {docFiles.find((d: DocFile) => d.id === docId)?.level || '–'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content + TOC grid */}
                <div className="flex gap-12">
                    {/* Main content */}
                    <div ref={contentRef} className="flex-1 min-w-0 bg-slate-900/30 border border-white/5 rounded-[3rem] p-16 backdrop-blur-sm shadow-2xl">
                        {docContent ? (
                            <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]} components={markdownComponents}>
                                {docContent}
                            </ReactMarkdown>
                        ) : (
                            <div className="flex items-center justify-center h-64">
                                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            </div>
                        )}

                        {/* Prev / Next navigation */}
                        <div className="mt-20 pt-10 border-t border-white/5 grid grid-cols-2 gap-6">
                            {prevDoc ? (
                                <button onClick={() => navigate(`/study/${prevDoc.id}`)} className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/40 transition-all text-left group">
                                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2 flex items-center gap-2"><ChevronLeft size={12} /> Previous</p>
                                    <p className="text-lg font-black text-white group-hover:text-blue-400 transition-colors">{prevDoc.title}</p>
                                </button>
                            ) : <div />}
                            {nextDoc && (
                                <button onClick={() => navigate(`/study/${nextDoc.id}`)} className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/40 transition-all text-right group">
                                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2 flex items-center justify-end gap-2">Next <ChevronRight size={12} /></p>
                                    <p className="text-lg font-black text-white group-hover:text-blue-400 transition-colors">{nextDoc.title}</p>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* TOC Sidebar — hidden on small screens */}
                    {headings.length > 3 && (
                        <div className="hidden xl:block w-64 flex-shrink-0">
                            <TableOfContents headings={headings} activeId={activeHeadingId} />
                        </div>
                    )}
                </div>

                {/* Scroll to top */}
                <button onClick={scrollToTop} className="fixed bottom-8 right-8 p-4 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-500 transition-colors z-50">
                    <ArrowUp size={20} />
                </button>
            </motion.div>
        );
    }

    // =========================================================================
    // Module Listing View
    // =========================================================================
    return (
        <motion.div key="study" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-16">
            <div className="flex justify-between items-end">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 mb-4">Learning Path</p>
                    <h2 className="text-6xl font-black tracking-tighter text-white">Curriculum <span className="text-blue-600">Overview</span></h2>
                    <p className="text-slate-500 text-lg mt-4">{docFiles.length} modules • From quantum basics to hands-on QML</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {docFiles.map((doc: DocFile, index: number) => (
                    <button key={doc.id} onClick={() => navigate(`/study/${doc.id}`)} className="bg-white/5 p-12 rounded-[3.5rem] border border-white/5 hover:border-blue-500/40 hover:bg-white/[0.08] transition-all text-left group shadow-xl relative overflow-hidden">
                        {/* Module number badge */}
                        <div className="absolute top-8 right-8 text-[80px] font-black text-white/[0.02] leading-none select-none">
                            {String(index + 1).padStart(2, '0')}
                        </div>
                        <div className="flex justify-between items-start mb-12">
                            <div className="p-5 bg-blue-600/20 rounded-3xl text-blue-500 group-hover:scale-110 transition-transform shadow-lg"><BookOpen size={32} /></div>
                            <span className="text-[10px] font-black px-4 py-1.5 bg-white/5 rounded-full text-slate-500 uppercase tracking-widest border border-white/10 flex items-center gap-1.5">
                                <Clock size={10} />{doc.time}
                            </span>
                        </div>
                        <h3 className="text-3xl font-black text-white mb-4 tracking-tight leading-none">{doc.title}</h3>
                        <div className="flex items-center gap-3 mb-10">
                            <div className="h-1.5 flex-1 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-blue-600 w-1/3" /></div>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${doc.level === 'Beginner' ? 'text-green-500' : doc.level === 'Intermediate' ? 'text-yellow-500' : 'text-red-500'
                                }`}>{doc.level}</span>
                        </div>
                        <p className="text-xs font-black text-blue-500 uppercase tracking-[0.2em] flex items-center gap-2 group-hover:translate-x-3 transition-transform">Start Lesson <ChevronRight size={16} /></p>
                    </button>
                ))}
            </div>
        </motion.div>
    );
}
