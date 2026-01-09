
import React, { useState } from 'react';
import { InputForm } from './components/InputForm';
import { ItineraryResult } from './components/ItineraryResult';
import { TravelPreferences, ItinerarySolution, LoadingState } from './types';
import { solveTravelRoute } from './services/geminiService';
import { Plane, Search, ExternalLink, Trophy, Users, Map, Heart, Info, X, BookOpen, Sigma, Brain, FunctionSquare } from 'lucide-react';

const App: React.FC = () => {
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [solution, setSolution] = useState<ItinerarySolution | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showAbout, setShowAbout] = useState(false);

  const handleSolve = async (prefs: TravelPreferences) => {
    setLoadingState('solving');
    setErrorMsg(null);
    setSolution(null);
    
    try {
      const result = await solveTravelRoute(prefs);
      setSolution(result);
      setLoadingState('success');
    } catch (err) {
      console.error(err);
      setErrorMsg("Falha ao gerar itinerário. Por favor, tente novamente ou verifique sua chave API.");
      setLoadingState('error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-lg z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
              <Plane className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">TravelSolver AI</h1>
              <p className="text-xs text-blue-200">Otimizador de Rotas Inteligente</p>
            </div>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-blue-100">
            <span className="hover:text-white cursor-pointer transition-colors">Histórico</span>
            <span className="hover:text-white cursor-pointer transition-colors">Viagens Salvas</span>
            <span className="hover:text-white cursor-pointer transition-colors">Configurações</span>
            <button 
              onClick={() => setShowAbout(true)}
              className="hover:text-white cursor-pointer transition-colors font-bold border-l border-blue-400/30 pl-6 flex items-center gap-1.5"
            >
              <Info className="h-4 w-4" /> Sobre
            </button>
          </nav>
        </div>
      </header>

      {/* Modal Sobre com Modelagem Matemática Formatada */}
      {showAbout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative border border-slate-200">
            <button 
              onClick={() => setShowAbout(false)}
              className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors z-10"
            >
              <X className="h-6 w-6 text-slate-400" />
            </button>
            
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-indigo-100 p-3 rounded-xl">
                  <BookOpen className="h-6 w-6 text-indigo-700" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                    Modelagem e Otimização Aplicada
                  </h2>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Documentação Técnica e Matemática</p>
                </div>
              </div>

              <div className="space-y-8 text-slate-600 leading-relaxed">
                
                {/* 1. Espaço de Busca */}
                <section>
                  <h3 className="text-sm font-black text-indigo-700 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Sigma className="h-4 w-4" /> 1. Espaço de Busca e Variáveis
                  </h3>
                  <p className="text-sm mb-4">
                    O problema consiste em encontrar a rota ótima <i className="font-serif">x</i> em um conjunto de soluções candidatos <b className="font-serif text-lg">S</b>. Cada solução <i className="font-serif">x</i> é uma sequência de trechos.
                  </p>
                  <div className="bg-slate-950 text-emerald-400 p-5 rounded-xl font-mono text-xs shadow-inner border border-slate-800 space-y-2">
                    <p className="text-slate-500 italic mb-2">// Variáveis de Decisão:</p>
                    <p><i className="text-white">x</i><sub className="text-emerald-500 italic">ij</sub> ∈ {"{0, 1}"} : Ativação do arco entre cidade <i className="italic">i</i> e <i className="italic">j</i></p>
                    <p><i className="text-white">d</i><sub className="text-emerald-500 italic">k</sub> : Data de partida associada ao trecho <i className="italic">k</i></p>
                    <p><i className="text-white">m</i><sub className="text-emerald-500 italic">k</sub> ∈ {"{Voo, Carro}"} : Modal de transporte</p>
                  </div>
                </section>

                {/* 2. Funções Objetivo */}
                <section>
                  <h3 className="text-sm font-black text-indigo-700 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <FunctionSquare className="h-4 w-4" /> 2. Funções Objetivo (Multiobjetivo)
                  </h3>
                  <p className="text-sm mb-4">
                    O solver minimiza o vetor de aptidão <b className="font-serif italic text-lg text-slate-800">F(x)</b> definido por:
                  </p>
                  
                  <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vetor de Objetivos</span>
                      <span className="font-serif italic font-bold text-slate-800 text-base">
                        Min F(x) = [f<sub>1</sub>(x), f<sub>2</sub>(x), f<sub>3</sub>(x)]
                      </span>
                    </div>

                    <div className="p-6 space-y-6">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="w-24 shrink-0 text-[10px] font-black text-emerald-600 uppercase">f₁: Custo</div>
                        <div className="flex-1 font-serif text-lg text-slate-900 italic bg-emerald-50/50 p-3 rounded-lg border border-emerald-100">
                          f<sub>1</sub>(x) = ∑ (P<sub>k</sub> ⋅ N) + ∑ H<sub>c</sub> + ∑ A<sub>c</sub>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="w-24 shrink-0 text-[10px] font-black text-blue-600 uppercase">f₂: Tempo</div>
                        <div className="flex-1 font-serif text-lg text-slate-900 italic bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                          f<sub>2</sub>(x) = ∑ (T<sub>voo,k</sub>) + ∑ (T<sub>escala,k</sub>)
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="w-24 shrink-0 text-[10px] font-black text-purple-600 uppercase">f₃: Conforto</div>
                        <div className="flex-1 font-serif text-lg text-slate-900 italic bg-purple-50/50 p-3 rounded-lg border border-purple-100">
                          f<sub>3</sub>(x) = Qualidade(H<sub>partida</sub>) - Penalty(N<sub>escalas</sub>)
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 3. Lógica NSGA-II */}
                <section>
                  <h3 className="text-sm font-black text-emerald-700 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Brain className="h-4 w-4" /> 3. Implementação do Solver
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <p className="font-bold text-slate-800 mb-1 italic">Dominância de Pareto:</p>
                      <p className="text-xs leading-relaxed italic">
                        Uma solução <i className="font-serif">x₁</i> domina <i className="font-serif">x₂</i> se, e somente se, <i className="font-serif">f<sub>i</sub>(x₁) ≤ f<sub>i</sub>(x₂)</i> para todos os objetivos e existe pelo menos um <i className="font-serif">j</i> tal que <i className="font-serif">f<sub>j</sub>(x₁) &lt; f<sub>j</sub>(x₂)</i>.
                      </p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <p className="font-bold text-slate-800 mb-1 italic">Crowding Distance:</p>
                      <p className="text-xs leading-relaxed italic">
                        Mecanismo de preservação de diversidade que calcula a densidade de soluções vizinhas para garantir que o sistema não converja para apenas um ponto de preço.
                      </p>
                    </div>
                  </div>
                </section>

                <div className="pt-6 border-t border-slate-100">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
                    <span>Disciplina: Modelagem e Otimização Aplicada</span>
                    <span>Status: Solver Ativo</span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => setShowAbout(false)}
                className="w-full mt-8 py-5 bg-slate-900 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-black transition-all shadow-2xl active:scale-[0.98] border-b-4 border-slate-800"
              >
                Concluir Leitura Técnica
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Input */}
          <InputForm onSolve={handleSolve} isLoading={loadingState === 'solving'} />

          {/* Right Column: Results or Placeholder */}
          {loadingState === 'idle' && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 md:p-16 bg-white rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
              
              <div className="flex gap-4 mb-8">
                <div className="p-4 bg-blue-50 rounded-2xl">
                  <Trophy className="h-8 w-8 text-blue-600" />
                </div>
                <div className="p-4 bg-emerald-50 rounded-2xl">
                  <Users className="h-8 w-8 text-emerald-600" />
                </div>
                <div className="p-4 bg-orange-50 rounded-2xl">
                  <Map className="h-8 w-8 text-orange-600" />
                </div>
              </div>

              <h3 className="text-3xl font-extrabold text-slate-800 mb-4">
                Sua próxima grande aventura começa aqui
              </h3>
              
              <div className="max-w-2xl space-y-4">
                <p className="text-lg text-slate-600 leading-relaxed">
                  Você gostaria de planejar sua viagem com a família, por exemplo para assistir à <strong>Copa do Mundo</strong> e ver a final do seu time preferido? Ou quem sabe realizar aquele <strong>tour dos sonhos</strong> por várias cidades? 
                </p>
                <p className="text-slate-500">
                  Você está no sistema certo! Nosso <span className="text-blue-600 font-semibold italic">Travel Solver</span> utiliza algoritmos de otimização multiobjetivo para processar milhões de combinações de rotas, voos e estadias, encontrando o equilíbrio perfeito entre custo, tempo e conforto para você e sua família.
                </p>
              </div>

              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full text-slate-600 text-sm border border-slate-100">
                  <Heart className="h-4 w-4 text-red-500" /> Experiências Personalizadas
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full text-slate-600 text-sm border border-slate-100">
                   ⚡ Solver NSGA-II de Alta Performance
                </div>
              </div>
            </div>
          )}

          {loadingState === 'error' && (
             <div className="flex-1 bg-red-50 border border-red-200 rounded-xl p-6 flex items-center justify-center text-red-700">
               <p>{errorMsg}</p>
             </div>
          )}

          {loadingState === 'success' && solution && (
            <ItineraryResult solution={solution} />
          )}

        </div>
      </main>

      {/* Footer / Integrations */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm mb-4">
            Os itinerários gerados são estimativas. Sempre verifique os preços reais nas plataformas de reserva.
          </p>
          <div className="flex justify-center gap-6">
             <a href="https://www.skyscanner.com.br/" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-slate-400 hover:text-blue-600 transition-colors text-sm">
                Skyscanner <ExternalLink className="h-3 w-3" />
             </a>
             <a href="https://www.google.com/travel/flights" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-slate-400 hover:text-blue-600 transition-colors text-sm">
                Google Flights <ExternalLink className="h-3 w-3" />
             </a>
             <a href="https://www.kayak.com.br/" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-slate-400 hover:text-orange-600 transition-colors text-sm">
                Kayak <ExternalLink className="h-3 w-3" />
             </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
