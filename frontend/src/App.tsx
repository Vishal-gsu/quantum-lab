import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Atom, BookOpen, Zap, Binary, 
  ChevronRight, Settings, BarChart3, 
  Activity, LayoutDashboard, Cpu as Chip,
  Terminal, Sparkles, ChevronLeft, Lock, Rocket, Image as ImageIcon,
  Wifi, WifiOff, AlertCircle
} from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area, Cell
} from 'recharts';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const SidebarItem = ({ icon: Icon, label, active, onClick, collapsed }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center px-4 py-3.5 rounded-2xl transition-all relative group mb-1 ${
      active 
        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)]' 
        : 'text-slate-400 hover:bg-white/5 hover:text-white'
    }`}
  >
    <div className="flex items-center justify-center min-w-[24px]">
      <Icon size={20} className={active ? 'animate-pulse' : ''} />
    </div>
    <motion.span 
      initial={false}
      animate={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : 'auto', marginLeft: collapsed ? 0 : 12 }}
      className="font-bold text-sm tracking-tight whitespace-nowrap overflow-hidden"
    >
      {label}
    </motion.span>
  </button>
);

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeExp, setActiveExp] = useState<string | null>(null);
  const [activeDoc, setActiveDoc] = useState<string | null>(null);
  const [docContent, setDocContent] = useState('');
  const [shots, setShots] = useState(1024);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const docFiles = [
    { id: "00_Quick_Reference_Guide.md", title: "Quick Reference", time: "5 min", level: "Beginner" },
    { id: "01_Quantum_Computing_Basics.md", title: "Quantum Basics", time: "15 min", level: "Beginner" },
    { id: "02_Quantum_Mechanics_Fundamentals.md", title: "Mechanics 101", time: "25 min", level: "Intermediate" },
    { id: "03_Quantum_Gates_and_Circuits.md", title: "Gates & Logic", time: "30 min", level: "Intermediate" },
    { id: "04_Classical_Machine_Learning_Review.md", title: "Classical ML", time: "20 min", level: "Intermediate" },
    { id: "05_Quantum_Machine_Learning_Intro.md", title: "Intro to QML", time: "40 min", level: "Advanced" }
  ];

  const experiments = [
    { id: 'qrng-1bit', name: '1-Bit QRNG', icon: Zap, color: '#facc15', status: 'Ready' },
    { id: 'coin-flip', name: 'Quantum Coin Flip', icon: Binary, color: '#3b82f6', status: 'Ready' },
    { id: 'qrng-8bit', name: '8-Bit QRNG', icon: Chip, color: '#a855f7', status: 'Ready' },
    { id: 'vqe-h2', name: 'VQE Solver', icon: Atom, color: '#22c55e', status: 'Ready' },
    { id: 'grover', name: 'Grover\'s Search', icon: Rocket, color: '#f43f5e', status: 'WIP' },
  ];

  // Health Check for Backend
  useEffect(() => {
    const checkStatus = async () => {
      try {
        await axios.get(`${API_URL}/`);
        setBackendStatus('online');
      } catch (err) {
        setBackendStatus('offline');
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 10000); // Check every 10s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeDoc) {
      fetch(`/src/assets/docs/${activeDoc}`)
        .then(res => res.text())
        .then(text => setDocContent(text))
        .catch(() => setDocContent("Failed to load document."));
    }
  }, [activeDoc]);

  const runExperiment = async (id: string) => {
    if (id === 'grover') return;
    setLoading(true);
    setResult(null);
    setErrorMsg(null);
    try {
      const endpoint = id === 'vqe-h2' ? `vqe-h2?steps=${Math.floor(Math.min(shots/20, 100)) || 15}` : `${id}?shots=${shots}`;
      const res = await axios.get(`${API_URL}/experiment/${endpoint}`, { timeout: 30000 }); // 30s timeout
      if (res.data.error) {
        setErrorMsg(res.data.error);
      } else {
        setResult(res.data);
      }
    } catch (err: any) {
      setErrorMsg(err.code === 'ECONNABORTED' ? "Simulation timed out. Try fewer shots/steps." : "Critical connection error. Check if backend is alive.");
    }
    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-[#020617] text-slate-200 overflow-hidden font-sans selection:bg-blue-500/30">
      {/* Sidebar */}
      <motion.aside 
        onMouseEnter={() => setSidebarCollapsed(false)}
        onMouseLeave={() => setSidebarCollapsed(true)}
        animate={{ width: sidebarCollapsed ? 90 : 280 }}
        className="bg-[#0f172a]/80 border-r border-white/5 flex flex-col z-50 backdrop-blur-3xl shadow-2xl"
      >
        <div className="p-8 h-24 flex items-center overflow-hidden">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-2xl flex-shrink-0 shadow-lg shadow-blue-500/20">
            <Atom className="text-white animate-spin-slow" size={24} />
          </div>
          {!sidebarCollapsed && (
            <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="ml-4 text-xl font-black tracking-tighter text-white uppercase">
              Quantum<span className="text-blue-500">Lab</span>
            </motion.h1>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-10 custom-scrollbar">
          <div className="space-y-1">
            <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} collapsed={sidebarCollapsed} onClick={() => { setActiveTab('dashboard'); setActiveExp(null); setActiveDoc(null); }} />
          </div>
          <div className="space-y-1">
            {!sidebarCollapsed && <p className="px-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 text-center">Laboratory</p>}
            {experiments.map(exp => (
              <SidebarItem key={exp.id} icon={exp.id === 'grover' ? Lock : exp.icon} label={exp.name} active={activeExp === exp.id} collapsed={sidebarCollapsed} onClick={() => { setActiveExp(exp.id); setActiveTab('experiment'); setActiveDoc(null); setResult(null); setErrorMsg(null); }} />
            ))}
          </div>
          <div className="space-y-1">
            <SidebarItem icon={BookOpen} label="Curriculum" active={activeTab === 'study'} collapsed={sidebarCollapsed} onClick={() => setActiveTab('study')} />
          </div>
        </div>

        {/* Connection Indicator & Credits */}
        <div className="p-6 border-t border-white/5 bg-black/20 space-y-4">
           <div className={`flex items-center gap-3 px-3 py-2 rounded-xl border transition-colors ${backendStatus === 'online' ? 'bg-green-500/5 border-green-500/20 text-green-500' : 'bg-red-500/5 border-red-500/20 text-red-500'}`}>
              {backendStatus === 'online' ? <Wifi size={16} /> : <WifiOff size={16} />}
              {!sidebarCollapsed && <span className="text-[10px] font-black uppercase tracking-widest">{backendStatus === 'online' ? 'Backend Live' : 'Backend Offline'}</span>}
           </div>
           
           {!sidebarCollapsed && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-2">
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mb-3">Architect</p>
                <p className="text-sm font-black text-white mb-4">Vishal Gsu</p>
                <div className="flex gap-4">
                   <a href="https://github.com/Vishal-gsu" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-colors">
                      <Rocket size={18} />
                   </a>
                   <a href="https://www.linkedin.com/in/vishal-gsu/" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-blue-400 transition-colors">
                      <LayoutDashboard size={18} />
                   </a>
                </div>
             </motion.div>
           )}
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent relative">
        <header className="h-24 border-b border-white/5 flex items-center justify-between px-12 sticky top-0 backdrop-blur-xl z-40 bg-[#020617]/60">
          <div className="flex items-center space-x-4">
            <div className={`h-2 w-2 rounded-full animate-ping ${backendStatus === 'online' ? 'bg-blue-500' : 'bg-red-500'}`} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">API Status: {backendStatus.toUpperCase()}</span>
            <ChevronRight size={14} className="text-slate-700" />
            <span className="text-white font-black text-sm uppercase tracking-widest">{activeTab}</span>
          </div>
          <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl px-5 py-2.5">
              <Settings size={16} className="text-blue-500 mr-4" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mr-4">Opt-Level 3</span>
              <input type="number" value={shots} onChange={(e) => setShots(Number(e.target.value))} className="bg-transparent text-white w-20 focus:outline-none text-sm font-black border-l border-white/10 pl-4 ml-2" />
          </div>
        </header>

        <div className="p-12 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div key="dashboard" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-12">
                {backendStatus === 'offline' && (
                  <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-3xl flex items-center gap-4 text-red-400">
                    <AlertCircle size={24} />
                    <div>
                      <p className="font-black uppercase text-xs tracking-widest">Backend Connection Failure</p>
                      <p className="text-sm opacity-70">The cloud simulator is not responding. Please verify the VITE_API_URL variable.</p>
                    </div>
                  </div>
                )}
                
                <div className="bg-[#0f172a]/40 p-16 rounded-[3rem] border border-white/5 backdrop-blur-sm relative overflow-hidden group">
                   <div className="relative z-10 space-y-6">
                      <div className="flex items-center space-x-3 text-blue-400 font-black text-xs uppercase tracking-[0.4em]">
                        <Sparkles size={16} /> <span>Simulation Intelligence v2.0</span>
                      </div>
                      <h2 className="text-6xl font-black mb-6 tracking-tighter leading-none text-white">The Future <br/>Of <span className="text-blue-500">Quantum ML</span></h2>
                      <p className="text-slate-400 max-w-xl text-xl font-medium leading-relaxed">Launch an experiment or explore our professional curriculum. Everything is live and simulated on local Aer-Backends.</p>
                   </div>
                   <Atom className="absolute right-[-40px] top-[-40px] text-white/5 rotate-12" size={450} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {experiments.map(exp => (
                    <button key={exp.id} onClick={() => { setActiveExp(exp.id); setActiveTab('experiment'); }} className="bg-white/5 p-10 rounded-[2.5rem] border border-white/5 hover:border-blue-500/40 transition-all text-left group relative overflow-hidden shadow-2xl">
                       {exp.status === 'WIP' && <span className="absolute top-6 right-6 px-3 py-1 bg-red-500/10 text-red-500 text-[10px] font-black rounded-full border border-red-500/20 uppercase tracking-widest">In Progress</span>}
                       <div className="p-4 rounded-2xl mb-8 w-fit bg-[#020617] border border-white/10 shadow-xl group-hover:scale-110 transition-transform">
                          <exp.icon style={{ color: exp.color }} size={32} />
                        </div>
                        <h3 className="font-black text-2xl mb-2 text-white">{exp.name}</h3>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 group-hover:text-blue-400 transition-colors">Enter Laboratory <ChevronRight size={14} /></p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'experiment' && activeExp && (
              <motion.div key="experiment" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-12">
                <div className="flex justify-between items-center">
                  <div className="space-y-4">
                    <button onClick={() => setActiveTab('dashboard')} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-white mb-4"><ChevronLeft size={14} /> Back to Dashboard</button>
                    <h2 className="text-5xl font-black tracking-tighter text-white">{experiments.find(e => e.id === activeExp)?.name}</h2>
                  </div>
                  {activeExp !== 'grover' && (
                    <button onClick={() => runExperiment(activeExp)} disabled={loading || backendStatus === 'offline'} className={`px-12 py-5 rounded-2xl font-black transition-all shadow-2xl flex items-center space-x-4 uppercase tracking-widest text-sm ${backendStatus === 'offline' ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-white text-black hover:bg-blue-600 hover:text-white'}`}>
                      {loading ? <Activity className="animate-spin" size={20} /> : <Zap size={20} />}
                      <span>{loading ? 'Simulating...' : (backendStatus === 'offline' ? 'Offline' : 'Run Protocol')}</span>
                    </button>
                  )}
                </div>

                {errorMsg && (
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-red-500/10 border border-red-500/20 p-8 rounded-[2.5rem] flex items-start gap-6 text-red-400">
                    <AlertCircle size={32} className="shrink-0" />
                    <div>
                      <h4 className="font-black uppercase tracking-widest text-sm mb-2 text-red-500">Execution Error</h4>
                      <p className="text-lg font-medium">{errorMsg}</p>
                      <p className="text-xs mt-4 opacity-60">Check the backend logs in Railway for trace details.</p>
                    </div>
                  </motion.div>
                )}

                {activeExp === 'grover' ? (
                  <div className="bg-slate-900 border border-white/5 rounded-[4rem] p-32 text-center space-y-8 relative overflow-hidden">
                    <Rocket size={100} className="mx-auto text-red-500 animate-pulse" />
                    <h3 className="text-4xl font-black">Feature Locked</h3>
                    <p className="text-slate-500 max-w-lg mx-auto text-xl">We are currently integrating the Oracle logic for Grover's Unstructured Search. Check back soon for the 2.0 update!</p>
                    <div className="absolute inset-0 bg-gradient-to-t from-red-500/5 to-transparent pointer-events-none" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    <div className="lg:col-span-3 space-y-12">
                       {/* Theory */}
                       {result?.theory && (
                         <div className="bg-blue-600/10 border border-blue-500/20 rounded-[3rem] p-12 flex gap-10 items-start">
                            <Sparkles className="text-blue-500 shrink-0" size={40} />
                            <div>
                               <h4 className="text-xs font-black uppercase tracking-[0.4em] text-blue-400 mb-4">Quantum Knowledge Base</h4>
                               <p className="text-slate-300 text-xl font-medium leading-relaxed italic">"{result.theory}"</p>
                            </div>
                         </div>
                       )}

                       {/* Results Visualization */}
                       <div className="bg-slate-900/50 border border-white/5 rounded-[3rem] p-14 backdrop-blur-md shadow-inner relative">
                          {loading && (
                            <div className="absolute inset-0 z-10 bg-black/40 backdrop-blur-sm rounded-[3rem] flex flex-col items-center justify-center space-y-6">
                               <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                               <p className="font-black text-xs uppercase tracking-[0.5em] animate-pulse">Computing Hilbert Space...</p>
                            </div>
                          )}
                          <h3 className="text-xs font-black uppercase tracking-[0.5em] text-slate-500 mb-12 flex items-center gap-4"><BarChart3 size={20} className="text-blue-500" /> Statistical Amplitude Distribution</h3>
                          <div className="w-full h-[400px]">
                            {result && result.chartData ? (
                              <ResponsiveContainer width="100%" height="100%">
                                {activeExp === 'vqe-h2' ? (
                                  <AreaChart data={result.chartData}>
                                    <defs><linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22c55e" stopOpacity={0.2}/><stop offset="95%" stopColor="#22c55e" stopOpacity={0}/></linearGradient></defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff03" vertical={false} />
                                    <XAxis dataKey="name" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                                    <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{ backgroundColor: '#020617', border: 'none', borderRadius: '15px' }} />
                                    <Area type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={5} fill="url(#colorVal)" dot={{ r: 6, fill: '#22c55e', strokeWidth: 2, stroke: '#020617' }} />
                                  </AreaChart>
                                ) : (
                                  <BarChart data={result.chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff03" vertical={false} />
                                    <XAxis dataKey="name" stroke="#475569" fontSize={10} hide={activeExp === 'qrng-8bit'} axisLine={false} tickLine={false} />
                                    <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{ backgroundColor: '#020617', border: 'none', borderRadius: '15px' }} />
                                    <Bar dataKey="value" radius={[12, 12, 0, 0]} barSize={activeExp === 'qrng-8bit' ? 2 : 120}>
                                      {result.chartData.map((_e: any, i: number) => <Cell key={`c-${i}`} fill={i % 2 === 0 ? '#3b82f6' : '#6366f1'} />)}
                                    </Bar>
                                  </BarChart>
                                )}
                              </ResponsiveContainer>
                            ) : (
                              <div className="h-full flex flex-col items-center justify-center space-y-8"><Activity size={80} className="text-slate-800 opacity-20" /><p className="font-black text-[10px] uppercase tracking-[0.5em] text-slate-700">Protocol Not Started</p></div>
                            )}
                          </div>
                       </div>

                       {/* Static Circuit Image Section */}
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="bg-[#020617] border border-white/5 rounded-[3rem] p-10 relative overflow-hidden group min-h-[350px]">
                            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500 mb-8 flex items-center gap-3"><ImageIcon size={18} className="text-blue-500" /> Circuit Blueprint</h3>
                            <div className="w-full h-48 bg-slate-900/50 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center p-6">
                               <Sparkles size={32} className="text-slate-700 mb-4" />
                               <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">circuit-{activeExp}.png placeholder</p>
                            </div>
                          </div>

                          <div className="bg-[#020617] border border-white/5 rounded-[3rem] p-10 relative overflow-hidden group">
                            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500 mb-8 flex items-center gap-3"><Terminal size={18} className="text-purple-500" /> Compiled ASCII Logic</h3>
                            <div className="bg-black/60 rounded-2xl p-6 border border-white/5 overflow-x-auto h-48 scrollbar-hide">
                               <pre className="text-indigo-400 font-mono text-xs leading-none whitespace-pre italic select-all">
                                  {result?.circuit || '// No Logic Compiled'}
                               </pre>
                            </div>
                          </div>
                       </div>
                    </div>

                    {/* Metadata Sidebar */}
                    <div className="space-y-10">
                       <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-10 backdrop-blur-sm">
                          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-blue-500 mb-10">System Status</h3>
                          <div className="space-y-8">
                            {[ { l: 'Simulator', v: 'Aer 0.17' }, { l: 'Architecture', v: 'Statevector' }, { l: 'Compiler', v: 'Level 3' } ].map(i => (
                              <div key={i.l} className="flex flex-col gap-2 border-b border-white/5 pb-6 last:border-0"><span className="text-[9px] text-slate-600 font-black uppercase tracking-[0.2em]">{i.l}</span><span className="text-xs font-black text-white">{i.v}</span></div>
                            ))}
                            {result?.finalEnergy && <div className="pt-6"><p className="text-[9px] font-black text-green-500 uppercase tracking-widest mb-3">Ground State Potential</p><p className="text-5xl font-black text-white tracking-tighter">{result.finalEnergy.toFixed(5)} <span className="text-xs text-slate-500 font-bold">Ha</span></p></div>}
                          </div>
                       </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'study' && (
              <motion.div key="study" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-16">
                <div className="flex justify-between items-end">
                   <h2 className="text-6xl font-black tracking-tighter text-white">Curriculum <span className="text-blue-600">Overview</span></h2>
                </div>

                {activeDoc ? (
                  <div className="bg-slate-900/50 border border-white/5 rounded-[4rem] p-24 relative backdrop-blur-3xl shadow-2xl">
                     <button onClick={() => setActiveDoc(null)} className="absolute top-12 left-12 flex items-center gap-3 text-xs font-black text-slate-500 hover:text-white transition-colors uppercase tracking-widest"><ChevronLeft size={20} /> Back to Modules</button>
                     <div className="max-w-4xl mx-auto prose prose-invert prose-indigo prose-xl 
                       prose-h1:text-7xl prose-h1:font-black prose-h1:mb-20 prose-h1:tracking-tighter
                       prose-h2:text-4xl prose-h2:font-black prose-h2:mt-24 prose-h2:border-white/5
                       prose-p:text-slate-400 prose-p:font-medium prose-p:leading-relaxed">
                        <ReactMarkdown>{docContent}</ReactMarkdown>
                     </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                     {docFiles.map(doc => (
                       <button key={doc.id} onClick={() => setActiveDoc(doc.id)} className="bg-white/5 p-12 rounded-[3.5rem] border border-white/5 hover:border-blue-500/40 hover:bg-white/[0.08] transition-all text-left group shadow-xl">
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
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default App;
