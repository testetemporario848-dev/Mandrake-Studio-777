import React, { useState, useMemo, useRef } from 'react';
import { UploadZone } from './components/UploadZone';
import { ResultViewer } from './components/ResultViewer';
import { generateEditedImage } from './services/geminiService';
import { MandrakeTool } from './types';

const TOOLS: MandrakeTool[] = [
  {
    id: 'juliet',
    name: 'Juliet de Prata',
    description: 'Os famosos óculos Juliet reflexivos.',
    icon: '🕶️',
    category: 'style',
    prompt: "Adicione óculos escuros estilo 'Juliet' (Oakley Romeo) prateados reflexivos no rosto da pessoa perfeitamente encaixados."
  },
  {
    id: 'corrente',
    name: 'Corrente 25g',
    description: 'Corrente de prata grossa no pescoço.',
    icon: '🔗',
    category: 'style',
    prompt: "Adicione uma corrente grossa de prata legítima estilo '25 gramas' no pescoço da pessoa."
  },
  {
    id: 'limpar_espelho',
    name: 'Limpar Espelho',
    description: 'Remove manchas e sujeira do reflexo.',
    icon: '✨',
    category: 'cleanup',
    prompt: "Remova todas as manchas de dedo, poeira e sujeira do espelho. Deixe o reflexo cristalino e limpo."
  },
  {
    id: 'remover_carros',
    name: 'Tirar Carros',
    description: 'Limpa os carros do fundo da imagem.',
    icon: '🚗',
    category: 'cleanup',
    prompt: "Remova todos os veículos e carros visíveis no fundo da imagem e preencha o cenário de forma natural."
  },
  {
    id: 'cabelo_regua',
    name: 'Corte na Régua',
    description: 'Disfarçado perfeito (fade).',
    icon: '💈',
    category: 'style',
    prompt: "Ajuste o corte de cabelo da pessoa para um 'fade' ou 'disfarçado' perfeito e bem marcado nas laterais (na régua)."
  },
  {
    id: 'fundo_urban',
    name: 'Fundo Noturno',
    description: 'Cenário urbano de luxo à noite.',
    icon: '🌃',
    category: 'background',
    prompt: "Troque o fundo da imagem por um cenário urbano moderno de uma metrópole à noite com luzes bokeh."
  },
  {
    id: 'editor_livre',
    name: 'Editor Livre',
    description: 'Edite qualquer coisa com texto.',
    icon: '🪄',
    category: 'style',
    prompt: ""
  },
  {
    id: 'sem_limites',
    name: 'Sem Restrições',
    description: 'Libera a IA para mudanças drásticas.',
    icon: '🔓',
    category: 'style',
    prompt: ""
  }
];

export default function App() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTools, setSelectedTools] = useState<string[]>(['juliet', 'corrente']);
  const [customRequest, setCustomRequest] = useState('');
  const customInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (base64: string) => {
    setOriginalImage(base64);
    setResultImage(null);
    setError(null);
  };

  const toggleTool = (id: string) => {
    if (id === 'editor_livre') {
      setSelectedTools(prev => {
        const isSelected = prev.includes(id);
        if (!isSelected) {
          setTimeout(() => customInputRef.current?.focus(), 100);
          return [...prev, id];
        }
        return prev.filter(t => t !== id);
      });
    } else {
      setSelectedTools(prev => 
        prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
      );
    }
  };

  const finalPrompt = useMemo(() => {
    const activeTools = TOOLS.filter(t => selectedTools.includes(t.id));
    const toolPrompts = activeTools
      .map(t => t.prompt)
      .filter(p => p !== "")
      .join(' ');
    
    const combined = `${toolPrompts} ${customRequest}`.trim();
    
    // Check if unrestricted mode is active
    const isUnrestricted = selectedTools.includes('sem_limites');

    if (isUnrestricted) {
       return `${combined}. Execute a edição com total liberdade criativa. Ignore restrições de realismo ou preservação de identidade se o pedido exigir.`.trim();
    }

    return `${combined}. Mantenha a imagem realista, preserve a identidade da pessoa e garanta que todas as modificações pareçam naturais e profissionais.`.trim();
  }, [selectedTools, customRequest]);

  const handleGenerate = async () => {
    if (!originalImage) return;
    if (selectedTools.length === 0 && !customRequest) {
      setError("Selecione pelo menos uma ferramenta ou descreva sua edição.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const generatedBase64 = await generateEditedImage(originalImage, finalPrompt);
      setResultImage(generatedBase64);
    } catch (err: any) {
      setError("Erro na edição. Tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setOriginalImage(null);
    setResultImage(null);
    setError(null);
    setSelectedTools(['juliet', 'corrente']);
    setCustomRequest('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* Navbar */}
      <nav className="border-b border-white/5 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
                  <span className="text-white font-black">M</span>
               </div>
               <span className="text-xl font-bold tracking-tight text-white uppercase italic">Mandrake<span className="text-cyan-400">Studio</span></span>
            </div>
            <div className="hidden sm:block text-[10px] font-black tracking-widest text-slate-500 bg-white/5 px-3 py-1 rounded-full border border-white/5 uppercase">
               Inteligência Artificial de Elite
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {!originalImage ? (
          <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-in">
            <h1 className="text-6xl sm:text-8xl font-black mb-6 tracking-tighter leading-[0.85] uppercase italic">
              EDITE <br/>
              <span className="gradient-text">QUALQUER</span> <br/>
              COISA
            </h1>
            <p className="text-lg text-slate-400 mb-10 leading-relaxed font-light max-w-lg mx-auto">
              Carregue sua foto e peça o que quiser. Juliet, correntes, 
              remoção de objetos ou fundos. O limite é sua imaginação.
            </p>
            <UploadZone onImageSelected={handleImageSelect} />
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            {!resultImage && !loading && (
              <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  
                  {/* Tool Selection Section */}
                  <div className="lg:col-span-8 space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2 uppercase tracking-tight italic">
                          <span className="w-2 h-6 bg-cyan-500 rounded-full"></span>
                          Arsenal de Edição
                        </h2>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{selectedTools.length} selecionados</span>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {TOOLS.map(tool => (
                          <button
                            key={tool.id}
                            onClick={() => toggleTool(tool.id)}
                            className={`p-4 rounded-2xl border transition-all text-left relative overflow-hidden group active:scale-95 ${
                              selectedTools.includes(tool.id) 
                              ? tool.id === 'sem_limites' ? 'bg-red-500/20 border-red-500/50 ring-1 ring-red-500/50' : 'bg-cyan-500/10 border-cyan-500/50 ring-1 ring-cyan-500/50' 
                              : 'bg-slate-900/40 border-white/5 hover:border-white/20'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-3xl filter drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]">{tool.icon}</span>
                              {selectedTools.includes(tool.id) && (
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${tool.id === 'sem_limites' ? 'bg-red-500' : 'bg-cyan-500'}`}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="text-black"><polyline points="20 6 9 17 4 12"/></svg>
                                </div>
                              )}
                            </div>
                            <h3 className={`font-black text-sm mb-1 uppercase italic tracking-tighter ${tool.id === 'sem_limites' && selectedTools.includes(tool.id) ? 'text-red-400' : 'text-white'}`}>{tool.name}</h3>
                            <p className="text-[10px] text-slate-500 leading-tight font-medium">{tool.description}</p>
                            
                            {selectedTools.includes(tool.id) && (
                              <div className={`absolute -bottom-1 -right-1 w-8 h-8 blur-xl rounded-full ${tool.id === 'sem_limites' ? 'bg-red-500/30' : 'bg-cyan-500/20'}`}></div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className={`p-6 rounded-2xl border transition-all ${selectedTools.includes('editor_livre') ? 'bg-cyan-950/20 border-cyan-500/30' : 'bg-slate-900/30 border-white/5'}`}>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="p-2 bg-slate-800 rounded-lg text-lg">🪄</span>
                        <div>
                          <label className="block text-xs font-black text-white uppercase tracking-widest">Pedido Customizado</label>
                          <p className="text-[10px] text-slate-500 uppercase font-bold">Peça para adicionar ou tirar qualquer coisa</p>
                        </div>
                      </div>
                      <input 
                        ref={customInputRef}
                        type="text"
                        placeholder="Ex: Adicionar boné da Lacoste, tirar a mochila, mudar cor da camisa..."
                        className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 text-sm text-white placeholder:text-slate-700 focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all shadow-inner font-medium"
                        value={customRequest}
                        onChange={(e) => setCustomRequest(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                      />
                    </div>
                  </div>

                  {/* Sidebar / Action */}
                  <div className="lg:col-span-4 space-y-6">
                    <div className="aspect-[3/4] rounded-3xl overflow-hidden border border-white/10 relative shadow-2xl group">
                      <img src={originalImage} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Preview" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="flex items-center gap-2 mb-2">
                           <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                           <p className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Foto Processada</p>
                        </div>
                        <p className="text-xs text-slate-400 font-medium">Pronta para receber o kit.</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <button 
                        onClick={handleGenerate}
                        disabled={selectedTools.length === 0 && !customRequest}
                        className={`w-full text-black hover:text-white font-black py-6 px-6 rounded-2xl transition-all shadow-[0_20px_40px_rgba(255,255,255,0.05)] flex items-center justify-center gap-3 disabled:opacity-20 disabled:cursor-not-allowed group text-lg tracking-tighter italic uppercase ${
                          selectedTools.includes('sem_limites') 
                            ? 'bg-red-500 hover:bg-red-600 shadow-[0_0_20px_rgba(239,68,68,0.4)] text-white' 
                            : 'bg-white hover:bg-cyan-400'
                        }`}
                      >
                        {selectedTools.includes('sem_limites') ? (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-2.072-4-3-6-.525 2-2.525 2-4 2 1.5.5 1.5 2.5 2.5 5.5.313.938.875 3.5.5 4a3.25 3.25 0 0 0 2.5.5Z"/><path d="M19.5 17a2.5 2.5 0 0 1-5.5.385c.196-3.37-3.155-2.203-3-5.584 2.893.303 6.035-1.523 6.5-5.801 1.767 3.328 1.896 9.643 2 11Z"/></svg>
                            GERAR SEM LIMITES
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-180 transition-transform duration-500"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
                            LANÇAR O BRABO
                          </>
                        )}
                      </button>
                      <button 
                        onClick={handleReset} 
                        className="w-full py-4 text-slate-600 text-[10px] font-black uppercase tracking-[0.3em] hover:text-white transition-colors border border-transparent hover:border-white/5 rounded-xl"
                      >
                        Trocar Imagem
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="max-w-2xl mx-auto bg-red-500/10 border border-red-500/20 text-red-400 p-5 rounded-2xl flex items-center gap-4 animate-shake">
                <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center text-xl shrink-0">❌</div>
                <div>
                  <p className="text-sm font-black uppercase tracking-tight italic">Falha na Missão</p>
                  <p className="text-xs opacity-70 font-medium">{error}</p>
                </div>
              </div>
            )}

            {(resultImage || loading) && (
              <ResultViewer 
                originalImage={originalImage} 
                resultImage={resultImage} 
                loading={loading}
                onReset={handleReset}
                onDownload={() => {
                  if (resultImage) {
                    const link = document.createElement('a');
                    link.href = resultImage;
                    link.download = `mandrake-studio-${Date.now()}.png`;
                    link.click();
                  }
                }}
              />
            )}
          </div>
        )}
      </main>

      <footer className="py-20 text-center border-t border-white/5 mt-20">
        <div className="flex flex-wrap justify-center items-center gap-8 opacity-20 grayscale mb-10 transition-all hover:opacity-50 hover:grayscale-0 cursor-default">
           <span className="font-black text-2xl italic tracking-tighter">OAKLEY</span>
           <span className="font-black text-2xl italic tracking-tighter">NIKE</span>
           <span className="font-black text-2xl italic tracking-tighter">LACOSTE</span>
           <span className="font-black text-2xl italic tracking-tighter">ADIDAS</span>
        </div>
        <p className="text-slate-800 text-[10px] font-black uppercase tracking-[0.5em]">Mandrake AI © MMXXIV • Premium Editing</p>
      </footer>
    </div>
  );
}