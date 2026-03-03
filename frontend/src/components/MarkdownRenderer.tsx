import { type Components } from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { useState } from 'react';

// ---------------------------------------------------------------------------
// Code block with syntax highlighting + copy button
// ---------------------------------------------------------------------------
function CodeBlock({ className, children }: { className?: string; children?: React.ReactNode }) {
    const [copied, setCopied] = useState(false);
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : 'text';
    const code = String(children).replace(/\n$/, '');

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group my-8 rounded-2xl overflow-hidden border border-white/10 shadow-lg">
            {/* Language badge + copy button */}
            <div className="flex items-center justify-between px-5 py-2.5 bg-[#1e293b] border-b border-white/5">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">{language}</span>
                <button onClick={handleCopy} className="flex items-center gap-2 text-[10px] font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-widest">
                    {copied ? <><Check size={12} className="text-green-500" /> Copied</> : <><Copy size={12} /> Copy</>}
                </button>
            </div>
            <SyntaxHighlighter
                language={language}
                style={oneDark}
                customStyle={{
                    margin: 0,
                    padding: '1.5rem',
                    background: '#0f172a',
                    fontSize: '0.8rem',
                    lineHeight: '1.7',
                    borderRadius: 0,
                }}
                showLineNumbers
                lineNumberStyle={{ color: '#334155', fontSize: '0.7rem', minWidth: '2.5em' }}
            >
                {code}
            </SyntaxHighlighter>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Inline code
// ---------------------------------------------------------------------------
function InlineCode({ children }: { children?: React.ReactNode }) {
    return (
        <code className="px-2 py-0.5 rounded-lg bg-blue-500/10 text-blue-400 text-sm font-mono border border-blue-500/20">
            {children}
        </code>
    );
}

// ---------------------------------------------------------------------------
// Markdown component overrides for ReactMarkdown
// ---------------------------------------------------------------------------
export const markdownComponents: Components = {
    // Code blocks
    code({ className, children }) {
        const isBlock = /language-/.test(className || '') || String(children).includes('\n');
        if (isBlock) {
            return <CodeBlock className={className}>{children}</CodeBlock>;
        }
        return <InlineCode>{children}</InlineCode>;
    },

    // Wrap pre to prevent double rendering
    pre({ children }) {
        return <>{children}</>;
    },

    // Headings with anchor links
    h1({ children }) {
        const id = String(children).toLowerCase().replace(/[^\w]+/g, '-');
        return <h1 id={id} className="text-5xl font-black tracking-tighter text-white mb-10 mt-16 first:mt-0 scroll-mt-32">{children}</h1>;
    },
    h2({ children }) {
        const id = String(children).toLowerCase().replace(/[^\w]+/g, '-');
        return (
            <h2 id={id} className="text-3xl font-black tracking-tight text-white mt-20 mb-8 pt-10 border-t border-white/5 scroll-mt-32">
                <span className="text-blue-500 mr-3">#</span>{children}
            </h2>
        );
    },
    h3({ children }) {
        const id = String(children).toLowerCase().replace(/[^\w]+/g, '-');
        return <h3 id={id} className="text-2xl font-black text-white mt-14 mb-6 scroll-mt-32">{children}</h3>;
    },
    h4({ children }) {
        return <h4 className="text-lg font-black text-slate-200 mt-10 mb-4">{children}</h4>;
    },

    // Paragraphs
    p({ children }) {
        return <p className="text-slate-400 text-lg leading-relaxed mb-6 font-medium">{children}</p>;
    },

    // Lists
    ul({ children }) {
        return <ul className="space-y-3 mb-8 ml-2">{children}</ul>;
    },
    ol({ children }) {
        return <ol className="space-y-3 mb-8 ml-2 list-decimal list-inside">{children}</ol>;
    },
    li({ children }) {
        return (
            <li className="text-slate-400 text-lg leading-relaxed flex items-start gap-3">
                <span className="text-blue-500 mt-2 text-xs">●</span>
                <span className="flex-1">{children}</span>
            </li>
        );
    },

    // Links
    a({ href, children }) {
        return (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline decoration-blue-500/30 underline-offset-4 hover:decoration-blue-400/60 transition-all inline-flex items-center gap-1.5">
                {children}<ExternalLink size={12} className="opacity-50" />
            </a>
        );
    },

    // Blockquotes (styled as callout cards)
    blockquote({ children }) {
        return (
            <div className="my-8 p-8 rounded-2xl bg-blue-500/5 border-l-4 border-blue-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative text-slate-300 text-lg font-medium [&>p]:mb-0 italic">{children}</div>
            </div>
        );
    },

    // Tables
    table({ children }) {
        return (
            <div className="my-8 overflow-x-auto rounded-2xl border border-white/10">
                <table className="w-full text-sm">{children}</table>
            </div>
        );
    },
    thead({ children }) {
        return <thead className="bg-white/5 border-b border-white/10">{children}</thead>;
    },
    th({ children }) {
        return <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">{children}</th>;
    },
    td({ children }) {
        return <td className="px-6 py-4 text-slate-400 border-b border-white/5">{children}</td>;
    },

    // Horizontal rules
    hr() {
        return <hr className="my-16 border-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />;
    },

    // Strong / em
    strong({ children }) {
        return <strong className="text-white font-black">{children}</strong>;
    },
    em({ children }) {
        return <em className="text-blue-300 not-italic font-medium">{children}</em>;
    },

    // Images
    img({ src, alt }) {
        return (
            <figure className="my-10">
                <img src={src} alt={alt} className="rounded-2xl border border-white/10 shadow-2xl w-full" />
                {alt && <figcaption className="text-center text-xs text-slate-600 mt-4 font-bold uppercase tracking-widest">{alt}</figcaption>}
            </figure>
        );
    },
};

// ---------------------------------------------------------------------------
// Extract headings from markdown for TOC
// ---------------------------------------------------------------------------
export function extractHeadings(markdown: string): { id: string; text: string; level: number }[] {
    const headingRegex = /^(#{1,3})\s+(.+)$/gm;
    const headings: { id: string; text: string; level: number }[] = [];
    let match;
    while ((match = headingRegex.exec(markdown)) !== null) {
        headings.push({
            id: match[2].toLowerCase().replace(/[^\w]+/g, '-'),
            text: match[2],
            level: match[1].length,
        });
    }
    return headings;
}
