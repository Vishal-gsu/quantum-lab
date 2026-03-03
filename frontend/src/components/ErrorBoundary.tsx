import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error('[QuantumLab] Uncaught render error:', error, errorInfo);
    }

    handleReload = (): void => {
        window.location.reload();
    };

    render(): ReactNode {
        if (this.state.hasError) {
            return (
                <div className="flex h-screen w-screen items-center justify-center bg-[#020617] text-white">
                    <div className="max-w-lg text-center space-y-8 p-12">
                        <div className="mx-auto w-fit p-5 rounded-3xl bg-red-500/10 border border-red-500/20">
                            <AlertCircle size={48} className="text-red-500" />
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter">
                            Something Went Wrong
                        </h1>
                        <p className="text-slate-400 text-lg leading-relaxed">
                            QuantumLab encountered an unexpected error. This has been logged.
                            Please reload the application.
                        </p>
                        {this.state.error && (
                            <pre className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left text-xs text-red-400 font-mono overflow-x-auto max-h-32">
                                {this.state.error.message}
                            </pre>
                        )}
                        <button
                            onClick={this.handleReload}
                            className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-sm uppercase tracking-widest rounded-2xl transition-colors shadow-lg shadow-blue-500/20"
                        >
                            <RefreshCw size={18} />
                            Reload Application
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
