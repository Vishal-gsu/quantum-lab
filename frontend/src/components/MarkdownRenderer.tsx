import { type Components } from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { isValidElement, useState, type ReactNode } from 'react';

/** Plain text from React children — headings with math / emphasis get stable slugs */
function textFromNodes(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textFromNodes).join('');
  if (isValidElement(node)) {
    const props = node.props as { children?: ReactNode };
    if (props?.children != null) return textFromNodes(props.children);
  }
  return '';
}

/** Strip common markdown / math noise before slugging (aligned with extractHeadings source lines) */
export function normalizeHeadingForSlug(raw: string): string {
  return raw
    .replace(/\*\*?/g, '')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/\$[^$]+\$/g, '')
    .replace(/⊗/g, ' ')
    .trim();
}

function slugifyHeading(text: string): string {
  const s = text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return s || 'section';
}

function baseSlugFromChildren(children: ReactNode): string {
  return slugifyHeading(normalizeHeadingForSlug(textFromNodes(children)));
}

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
    <div className="group relative my-8 overflow-hidden rounded-2xl border border-white/10 shadow-lg">
      <div className="flex items-center justify-between border-b border-white/5 bg-[#1e293b] px-5 py-2.5">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-400">{language}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 transition-colors hover:text-white"
        >
          {copied ? (
            <>
              <Check size={12} className="text-green-500" /> Copied
            </>
          ) : (
            <>
              <Copy size={12} /> Copy
            </>
          )}
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

function InlineCode({ children }: { children?: React.ReactNode }) {
  return (
    <code className="rounded-lg border border-teal-500/25 bg-teal-500/10 px-2 py-0.5 font-mono text-sm text-teal-300">
      {children}
    </code>
  );
}

// ---------------------------------------------------------------------------
// Per-document components so heading ids match TOC (duplicate titles → -1, -2, …)
// ---------------------------------------------------------------------------
export function createMarkdownComponents(): Components {
  const slugUseCounts = new Map<string, number>();

  function nextHeadingId(children: ReactNode): string {
    const base = baseSlugFromChildren(children);
    const n = slugUseCounts.get(base) ?? 0;
    slugUseCounts.set(base, n + 1);
    return n === 0 ? base : `${base}-${n}`;
  }

  return {
    code({ className, children }) {
      const isBlock = /language-/.test(className || '') || String(children).includes('\n');
      if (isBlock) {
        return <CodeBlock className={className}>{children}</CodeBlock>;
      }
      return <InlineCode>{children}</InlineCode>;
    },

    pre({ children }) {
      return <>{children}</>;
    },

    h1({ children }) {
      const id = nextHeadingId(children);
      return (
        <h1 id={id} className="mb-10 mt-16 scroll-mt-36 text-4xl font-bold tracking-tight text-white first:mt-0 sm:text-5xl">
          {children}
        </h1>
      );
    },
    h2({ children }) {
      const id = nextHeadingId(children);
      return (
        <h2
          id={id}
          className="mb-8 mt-16 scroll-mt-36 border-t border-white/10 pt-12 text-2xl font-bold tracking-tight text-white sm:text-3xl"
        >
          <span className="mr-2 text-violet-400" aria-hidden>
            #
          </span>
          {children}
        </h2>
      );
    },
    h3({ children }) {
      const id = nextHeadingId(children);
      return (
        <h3 id={id} className="mb-4 mt-12 scroll-mt-36 text-xl font-bold tracking-tight text-white sm:text-2xl">
          {children}
        </h3>
      );
    },
    h4({ children }) {
      return (
        <h4 className="mb-3 mt-10 scroll-mt-36 text-lg font-semibold tracking-tight text-slate-100">{children}</h4>
      );
    },

    p({ children }) {
      return <p className="mb-6 text-lg font-medium leading-relaxed text-slate-300">{children}</p>;
    },

    ul({ children }) {
      return <ul className="mb-8 ml-2 space-y-3">{children}</ul>;
    },
    ol({ children }) {
      return (
        <ol className="mb-8 ml-6 list-decimal space-y-3 pl-2 text-lg leading-relaxed text-slate-300 marker:font-black marker:text-teal-400">
          {children}
        </ol>
      );
    },
    li({ children, node }) {
      const parentTag = (node as { parent?: { tagName?: string } } | undefined)?.parent?.tagName;
      if (parentTag === 'ol') {
        return <li className="mb-1 pl-1">{children}</li>;
      }
      return (
        <li className="flex items-start gap-3 text-lg leading-relaxed text-slate-300">
          <span className="mt-2 shrink-0 text-xs text-teal-500">●</span>
          <span className="min-w-0 flex-1">{children}</span>
        </li>
      );
    },

    a({ href, children }) {
      const internal = href?.startsWith('#');
      if (internal) {
        return (
          <a
            href={href}
            className="font-semibold text-teal-400 underline decoration-teal-500/40 underline-offset-4 transition-colors hover:text-teal-300"
          >
            {children}
          </a>
        );
      }
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-teal-400 underline decoration-teal-500/30 underline-offset-4 transition-all hover:text-teal-300 hover:decoration-teal-400/60"
        >
          {children}
          <ExternalLink size={12} className="opacity-50" />
        </a>
      );
    },

    blockquote({ children }) {
      return (
        <div className="relative my-8 overflow-hidden rounded-2xl border-l-4 border-violet-500 bg-violet-500/5 p-8">
          <div className="absolute right-0 top-0 h-32 w-32 translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/10" />
          <div className="relative text-lg font-medium italic text-slate-300 [&>p]:mb-0">{children}</div>
        </div>
      );
    },

    table({ children }) {
      return (
        <div className="my-8 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm">{children}</table>
        </div>
      );
    },
    thead({ children }) {
      return <thead className="border-b border-white/10 bg-white/5">{children}</thead>;
    },
    th({ children }) {
      return (
        <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-[0.3em] text-teal-400">{children}</th>
      );
    },
    td({ children }) {
      return <td className="border-b border-white/5 px-6 py-4 text-slate-400">{children}</td>;
    },

    div({ className, children, ...rest }) {
      if (className === 'math math-display') {
        return (
          <div
            className={`${className} my-8 max-w-full overflow-x-auto rounded-2xl border border-teal-500/20 bg-slate-950/90 px-4 py-6 shadow-inner`}
            {...rest}
          >
            {children}
          </div>
        );
      }
      if (className === 'math math-inline') {
        return (
          <span className={`${className} mx-0.5 inline-block align-middle`} {...rest}>
            {children}
          </span>
        );
      }
      return (
        <div className={className} {...rest}>
          {children}
        </div>
      );
    },

    hr() {
      return <hr className="my-16 h-px border-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />;
    },

    strong({ children }) {
      return <strong className="font-bold text-white">{children}</strong>;
    },
    em({ children }) {
      return <em className="font-medium not-italic text-violet-300">{children}</em>;
    },

    img({ src, alt }) {
      return (
        <figure className="my-10">
          <img src={src} alt={alt} className="w-full rounded-2xl border border-white/10 shadow-2xl" />
          {alt && (
            <figcaption className="mt-4 text-center text-xs font-bold uppercase tracking-widest text-slate-500">
              {alt}
            </figcaption>
          )}
        </figure>
      );
    },
  };
}

// ---------------------------------------------------------------------------
// TOC — same duplicate-slug rules as createMarkdownComponents
// ---------------------------------------------------------------------------
export function extractHeadings(markdown: string): { id: string; text: string; level: number }[] {
  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  const headings: { id: string; text: string; level: number }[] = [];
  const slugUseCounts = new Map<string, number>();
  let match;
  while ((match = headingRegex.exec(markdown)) !== null) {
    const text = match[2].trim();
    const base = slugifyHeading(normalizeHeadingForSlug(text));
    const n = slugUseCounts.get(base) ?? 0;
    slugUseCounts.set(base, n + 1);
    const id = n === 0 ? base : `${base}-${n}`;
    headings.push({ id, text, level: match[1].length });
  }
  return headings;
}
