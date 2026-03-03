import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, ChevronRight, ChevronLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { docFiles } from '../lib/constants';

export default function StudyView() {
    const { docId } = useParams<{ docId: string }>();
    const navigate = useNavigate();
    const [docContent, setDocContent] = useState('');

    useEffect(() => {
        if (docId) {
            fetch(`/docs/${docId}`)
                .then(res => res.text())
                .then(text => setDocContent(text))
                .catch(() => setDocContent('Failed to load document.'));
        }
    }, [docId]);

    // Document reader view
    if (docId) {
        return (
            <motion.div key="doc-reader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-16">
                <div className="bg-slate-900/50 border border-white/5 rounded-[4rem] p-24 relative backdrop-blur-3xl shadow-2xl">
                    <button onClick={() => navigate('/study')} className="absolute top-12 left-12 flex items-center gap-3 text-xs font-black text-slate-500 hover:text-white transition-colors uppercase tracking-widest"><ChevronLeft size={20} /> Back to Modules</button>
                    <div className="max-w-4xl mx-auto prose prose-invert prose-indigo prose-xl
            prose-h1:text-7xl prose-h1:font-black prose-h1:mb-20 prose-h1:tracking-tighter
            prose-h2:text-4xl prose-h2:font-black prose-h2:mt-24 prose-h2:border-white/5
            prose-p:text-slate-400 prose-p:font-medium prose-p:leading-relaxed">
                        <ReactMarkdown>{docContent}</ReactMarkdown>
                    </div>
                </div>
            </motion.div>
        );
    }

    // Module listing view
    return (
        <motion.div key="study" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-16">
            <div className="flex justify-between items-end">
                <h2 className="text-6xl font-black tracking-tighter text-white">Curriculum <span className="text-blue-600">Overview</span></h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {docFiles.map(doc => (
                    <button key={doc.id} onClick={() => navigate(`/study/${doc.id}`)} className="bg-white/5 p-12 rounded-[3.5rem] border border-white/5 hover:border-blue-500/40 hover:bg-white/[0.08] transition-all text-left group shadow-xl">
                        <div className="flex justify-between items-start mb-12">
                            <div className="p-5 bg-blue-600/20 rounded-3xl text-blue-500 group-hover:scale-110 transition-transform shadow-lg"><BookOpen size={32} /></div>
                            <span className="text-[10px] font-black px-4 py-1.5 bg-white/5 rounded-full text-slate-500 uppercase tracking-widest border border-white/10">{doc.time}</span>
                        </div>
                        <h3 className="text-3xl font-black text-white mb-4 tracking-tight leading-none">{doc.title}</h3>
                        <div className="flex items-center gap-3 mb-10">
                            <div className="h-1.5 flex-1 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-blue-600 w-1/3" /></div>
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{doc.level}</span>
                        </div>
                        <p className="text-xs font-black text-blue-500 uppercase tracking-[0.2em] flex items-center gap-2 group-hover:translate-x-3 transition-transform">Start Lesson <ChevronRight size={16} /></p>
                    </button>
                ))}
            </div>
        </motion.div>
    );
}
