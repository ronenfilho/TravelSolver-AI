
import React, { useState } from 'react';
import { InputForm } from './components/InputForm';
import { ItineraryResult } from './components/ItineraryResult';
import { TravelPreferences, ItinerarySolution, LoadingState } from './types';
import { solveTravelRoute } from './services/geminiService';
import { 
  Plane, ExternalLink, Trophy, Users, Map, Heart, Info, X, 
  BookOpen, Sigma, Brain, FunctionSquare, Database, Cpu, Globe, Target, Search, ShieldCheck,
  // Fix: Added missing icons for documentation tabs
  Calendar, ArrowRight
} from 'lucide-react';

type AboutTab = 'modeling' | 'crawler' | 'optimization';

const App: React.FC = () => {
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [solution, setSolution] = useState<ItinerarySolution | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showAbout, setShowAbout] = useState(false);
  const [activeTab, setActiveTab] = useState<AboutTab>('modeling');

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
              onClick={() => { setShowAbout(true); setActiveTab('modeling'); }}
              className="hover:text-white cursor-pointer transition-colors font-bold border-l border-blue-400/30 pl-6 flex items-center gap-1.5"
            >
              <span className="flex items-center gap-1.5">
                <Info className="h-4 w-4" /> Sobre o Projeto
              </span>
            </button>
          </nav>
        </div>
      </header>

      {/* Modal Sobre com Abas */}
      {showAbout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col relative border border-slate-200 overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-600 p-2 rounded-lg">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Documentação do Sistema</h2>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">TravelSolver Engine v2.5</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAbout(false)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X className="h-6 w-6 text-slate-400" />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex bg-slate-100 p-1 mx-6 mt-6 rounded-xl border border-slate-200">
              <button 
                onClick={() => setActiveTab('modeling')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-[11px] font-black uppercase tracking-wider rounded-lg transition-all ${activeTab === 'modeling' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:bg-white/50'}`}
              >
                <Sigma className="h-4 w-4" /> Modelagem
              </button>
              <button 
                onClick={() => setActiveTab('crawler')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-[11px] font-black uppercase tracking-wider rounded-lg transition-all ${activeTab === 'crawler' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:bg-white/50'}`}
              >
                <Database className="h-4 w-4" /> Crawler
              </button>
              <button 
                onClick={() => setActiveTab('optimization')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-[11px] font-black uppercase tracking-wider rounded-lg transition-all ${activeTab === 'optimization' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:bg-white/50'}`}
              >
                <Cpu className="h-4 w-4" /> Otimização
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-8 pt-6">
              
              {/* ABA 1: MODELAGEM MATEMÁTICA */}
              {activeTab === 'modeling' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <section>
                    <h3 className="text-sm font-black text-indigo-700 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Sigma className="h-4 w-4" /> 1. Espaço de Busca e Variáveis
                    </h3>
                    <p className="text-sm text-slate-600 mb-4">
                      O problema consiste em encontrar a rota ótima <i className="font-serif">x</i> em um conjunto de soluções candidatos <b className="font-serif text-lg">S</b>. Cada solução <i className="font-serif">x</i> é uma sequência de trechos.
                    </p>
                    <div className="bg-slate-950 text-emerald-400 p-5 rounded-xl font-mono text-xs shadow-inner border border-slate-800 space-y-2">
                      <p className="text-slate-500 italic mb-2">// Variáveis de Decisão:</p>
                      <p><i className="text-white">x</i><sub className="text-emerald-500 italic">ij</sub> ∈ {"{0, 1}"} : Ativação do arco entre cidade <i className="italic">i</i> e <i className="italic">j</i></p>
                      <p><i className="text-white">d</i><sub className="text-emerald-500 italic">k</sub> : Data de partida associada ao trecho <i className="italic">k</i></p>
                      <p><i className="text-white">m</i><sub className="text-emerald-500 italic">k</sub> ∈ {"{Voo, Carro}"} : Modal de transporte</p>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-sm font-black text-indigo-700 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <FunctionSquare className="h-4 w-4" /> 2. Funções Objetivo (Multiobjetivo)
                    </h3>
                    <p className="text-sm text-slate-600 mb-4">
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
                </div>
              )}

              {/* ABA 2: IMPLEMENTAÇÃO DO CRAWLER */}
              {activeTab === 'crawler' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <section>
                    <h3 className="text-sm font-black text-emerald-700 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Globe className="h-4 w-4" /> Engenharia de Coleta Ativa (Crawler)
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-6">
                      Diferente de sistemas convencionais baseados em cache estático, nosso sistema utiliza agentes de IA especializados que <strong>realizam uma varredura exaustiva</strong> e em tempo real no ecossistema global de viagens.
                    </p>
                    
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex gap-3">
                          <Search className="h-5 w-5 text-emerald-600 shrink-0" />
                          <div>
                            <span className="block font-black text-[10px] text-emerald-800 uppercase mb-1">Busca Agentica Multidimensional</span>
                            <p className="text-[11px] text-emerald-700 leading-tight">Agentes autônomos consultam simultaneamente GDS (Global Distribution Systems) e inventários de alianças aéreas para consolidar opções reais de mercado.</p>
                          </div>
                        </div>
                        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex gap-3">
                          <Calendar className="h-5 w-5 text-emerald-600 shrink-0" />
                          <div>
                            <span className="block font-black text-[10px] text-emerald-800 uppercase mb-1">Exploração Temporal Dinâmica</span>
                            <p className="text-[11px] text-emerald-700 leading-tight">O crawler executa varreduras em janelas de <strong>+/- 1 dia</strong> para cada trecho, identificando flutuações de tarifa e maximizando a economia para o usuário.</p>
                          </div>
                        </div>
                        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex gap-3">
                          <Database className="h-5 w-5 text-emerald-600 shrink-0" />
                          <div>
                            <span className="block font-black text-[10px] text-emerald-800 uppercase mb-1">Extração e Normalização (Big Data)</span>
                            <p className="text-[11px] text-emerald-700 leading-tight">Processamos e estruturamos entre <strong>60 a 80 candidatos por consulta</strong>, transformando dados brutos em registros JSON padronizados para o solver.</p>
                          </div>
                        </div>
                        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex gap-3">
                          <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
                          <div>
                            <span className="block font-black text-[10px] text-emerald-800 uppercase mb-1">Validação de Integridade</span>
                            <p className="text-[11px] text-emerald-700 leading-tight">Cada item coletado passa por um filtro de consistência, garantindo que horários de conexão e custos de permanência sejam logicamente viáveis.</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 bg-slate-50 border-2 border-slate-200 rounded-2xl">
                        <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest mb-4">Fluxo de Operação do Agente:</h4>
                        <div className="flex flex-col md:flex-row items-center gap-4 text-center">
                          <div className="flex-1 p-3 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600">
                            1. Requisição Agentica de Mercado
                          </div>
                          <ArrowRight className="h-4 w-4 text-slate-300 hidden md:block" />
                          <div className="flex-1 p-3 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600">
                            2. Varredura Temporal Exaustiva
                          </div>
                          <ArrowRight className="h-4 w-4 text-slate-300 hidden md:block" />
                          <div className="flex-1 p-3 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600">
                            3. Síntese de Big Data Estruturado
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              )}

              {/* ABA 3: MODELO DE OTIMIZAÇÃO TÉCNICA */}
              {activeTab === 'optimization' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <section>
                    <h3 className="text-sm font-black text-blue-700 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Cpu className="h-4 w-4" /> Engenharia do Solver NSGA-II
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-6">
                      O coração do sistema utiliza o <strong>Non-dominated Sorting Genetic Algorithm II</strong> para resolver o conflito entre <i>Preço Baixo</i> vs <i>Tempo de Viagem</i>.
                    </p>

                    <div className="space-y-4">
                      <div className="flex gap-4 items-start p-4 bg-slate-50 border border-slate-200 rounded-xl">
                        <div className="bg-blue-100 p-2 rounded-lg text-blue-700">
                          <Brain className="h-4 w-4" />
                        </div>
                        <div>
                          <span className="block font-bold text-slate-900 text-xs uppercase">Heurística de Dominância</span>
                          <p className="text-[11px] text-slate-500">O algoritmo descarta automaticamente rotas que são piores em todos os critérios simultaneamente, focando apenas na "Fronteira de Pareto".</p>
                        </div>
                      </div>

                      <div className="flex gap-4 items-start p-4 bg-slate-50 border border-slate-200 rounded-xl">
                        <div className="bg-purple-100 p-2 rounded-lg text-purple-700">
                          <Users className="h-4 w-4" />
                        </div>
                        <div>
                          <span className="block font-bold text-slate-900 text-xs uppercase">Crowding Distance (Diversidade)</span>
                          <p className="text-[11px] text-slate-500">Garante que o resultado não seja apenas "o mais barato", mas ofereça uma gama de opções que cubram todo o espectro de conveniência do viajante.</p>
                        </div>
                      </div>

                      <div className="flex gap-4 items-start p-4 bg-slate-50 border border-slate-200 rounded-xl">
                        <div className="bg-emerald-100 p-2 rounded-lg text-emerald-700">
                          <Target className="h-4 w-4" />
                        </div>
                        <div>
                          <span className="block font-bold text-slate-900 text-xs uppercase">Cálculo de Fitness Combinado</span>
                          <p className="text-[11px] text-slate-500">Cada rota candidata recebe uma nota composta, ponderada pelos "pesos" definidos pelo usuário no formulário lateral.</p>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
              <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                Status: Algoritmo de Otimização Operacional
              </div>
              <button 
                onClick={() => setShowAbout(false)}
                className="px-8 py-3 bg-slate-900 text-white font-black uppercase tracking-widest rounded-xl hover:bg-black transition-all shadow-xl active:scale-[0.98]"
              >
                Sair da Documentação
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
