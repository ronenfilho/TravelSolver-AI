
import React, { useState } from 'react';
import { InputForm } from './components/InputForm';
import { ItineraryResult } from './components/ItineraryResult';
import { TravelPreferences, ItinerarySolution, LoadingState } from './types';
import { solveTravelRoute } from './services/geminiService';
import { Plane, Search, ExternalLink, Trophy, Users, Map, Heart } from 'lucide-react';

const App: React.FC = () => {
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [solution, setSolution] = useState<ItinerarySolution | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
          </nav>
        </div>
      </header>

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
