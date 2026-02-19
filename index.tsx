import React, { Component, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Error Boundary Simples para prevenir tela branca se o React falhar
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("React Crash:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center p-6 font-sans text-slate-200">
          <div className="text-6xl mb-4">💥</div>
          <h1 className="text-2xl font-black italic uppercase text-white mb-2">Erro Interno</h1>
          <p className="text-slate-400 mb-8 max-w-md">
            Ocorreu um problema inesperado no processamento visual.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-cyan-500 hover:bg-cyan-400 text-black font-black py-3 px-8 rounded-xl uppercase tracking-widest transition-all"
          >
            Reiniciar App
          </button>
          <p className="mt-8 text-[10px] text-slate-700 font-mono">
            {this.state.error?.message}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

// O remove child garante que o Splash Screen saia do DOM assim que o React estiver pronto
// Mas o React 18+ gerencia o root innerHTML automaticamente na hidratação/renderização
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);