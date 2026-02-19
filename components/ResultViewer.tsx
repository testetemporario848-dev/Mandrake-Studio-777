import React from 'react';

interface ResultViewerProps {
  originalImage: string;
  resultImage: string | null;
  loading: boolean;
  onReset: () => void;
  onDownload: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const ResultViewer: React.FC<ResultViewerProps> = ({ 
  originalImage, 
  resultImage, 
  loading,
  onReset,
  onDownload,
  onUndo,
  onRedo,
  canUndo,
  canRedo
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto mt-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Original Image */}
        <div className="relative group rounded-2xl overflow-hidden border border-white/5 bg-slate-900 shadow-2xl">
          <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full z-10 border border-white/10">
            Original
          </div>
          <div className="aspect-[3/4]">
            <img 
              src={originalImage} 
              alt="Original" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Result Image */}
        <div className="relative group rounded-2xl overflow-hidden border-2 border-cyan-500/20 bg-slate-900 shadow-[0_0_50px_rgba(34,211,238,0.1)]">
          <div className="absolute top-4 left-4 bg-cyan-500 text-black text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full z-10 shadow-lg">
            Mandrake AI Edit
          </div>
          
          <div className={`aspect-[3/4] relative ${loading ? 'bg-slate-900' : ''}`}>
             {loading ? (
               <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-xl z-20">
                 <div className="relative w-24 h-24 mb-6">
                    <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-t-cyan-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                       <span className="text-cyan-500 text-2xl animate-pulse">🕶️</span>
                    </div>
                 </div>
                 <h3 className="text-white font-black text-xl tracking-tighter italic uppercase">Lapidando o Kit</h3>
                 <p className="text-slate-500 text-xs mt-2 uppercase tracking-widest animate-pulse">Aguarde a transformação...</p>
               </div>
             ) : null}

             {resultImage ? (
               <img 
                 src={resultImage} 
                 alt="Generated" 
                 className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-700"
               />
             ) : (
               <div className="w-full h-full flex items-center justify-center text-slate-800">
                  <span className="text-6xl font-black italic opacity-10">MANDRAKE</span>
               </div>
             )}
          </div>
        </div>
      </div>

      {!loading && (
        <div className="flex flex-col gap-4 mt-12 pb-20">
          
          {/* Main Actions */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            
            {/* Undo/Redo Buttons */}
            <div className="flex gap-2">
              <button
                onClick={onUndo}
                disabled={!canUndo}
                title="Desfazer"
                className="w-14 h-14 rounded-xl flex items-center justify-center border border-white/10 bg-slate-900 text-white hover:bg-slate-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
              >
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
              </button>
              <button
                onClick={onRedo}
                disabled={!canRedo}
                title="Refazer"
                className="w-14 h-14 rounded-xl flex items-center justify-center border border-white/10 bg-slate-900 text-white hover:bg-slate-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
              >
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"/></svg>
              </button>
            </div>

            {resultImage && (
              <>
                <button 
                  onClick={onReset}
                  className="px-8 py-4 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-slate-900 transition-all font-bold uppercase tracking-widest text-xs flex-1 sm:flex-none"
                >
                  Nova Foto
                </button>
                <button 
                  onClick={onDownload}
                  className="px-8 py-4 rounded-xl bg-cyan-500 text-black hover:bg-cyan-400 transition-all font-black uppercase tracking-widest text-xs shadow-lg shadow-cyan-500/20 flex-1 sm:flex-none"
                >
                  Baixar Resultado
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};