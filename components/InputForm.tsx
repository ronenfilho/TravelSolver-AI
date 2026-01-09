
import React, { useState } from 'react';
import { TravelPreferences, Stopover, TripType, SolverWeights } from '../types';
import { Plus, Trash2, Target, Repeat, ArrowRight, Settings2, DollarSign, Clock, Heart, ChevronDown, ChevronUp } from 'lucide-react';
import { CitySearchInput } from './CitySearchInput';

interface Props {
  onSolve: (prefs: TravelPreferences) => void;
  isLoading: boolean;
}

export const InputForm: React.FC<Props> = ({ onSolve, isLoading }) => {
  const [tripType, setTripType] = useState<TripType>('ROUND_TRIP');
  const [passengers, setPassengers] = useState(1);
  const [originCity, setOriginCity] = useState('Goiânia (GYN)');
  const [originRadius, setOriginRadius] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  const [weights, setWeights] = useState<SolverWeights>({
    cost: 50,
    time: 50,
    convenience: 50
  });

  const [mainDestination, setMainDestination] = useState<Stopover>({
    city: 'Atlanta (ATL)',
    durationDays: 7,
    isFixedDate: false,
    isMainDestination: true
  });

  const [stops, setStops] = useState<Stopover[]>([]);
  const [newCity, setNewCity] = useState('');
  const [newDuration, setNewDuration] = useState(3);

  const addStop = () => {
    if (newCity.trim()) {
      setStops([...stops, { 
        city: newCity.trim(), 
        durationDays: newDuration, 
        isFixedDate: false,
        isMainDestination: false
      }]);
      setNewCity('');
    }
  };

  const removeStop = (index: number) => setStops(stops.filter((_, i) => i !== index));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSolve({ 
      tripType, originCity, originRadiusKm: originRadius, 
      passengers, mainDestination, stops, solverWeights: weights 
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl p-6 w-full lg:w-1/3 h-fit sticky top-6 overflow-y-auto max-h-[90vh] border border-slate-200">
      <h2 className="text-2xl font-bold text-slate-950 mb-6 flex items-center gap-2">
        <Target className="text-blue-700" /> Parâmetros de Viagem
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Bloco 1: Origem e Tipo (Slate/Gray) */}
        <div className="bg-slate-50 p-4 rounded-xl border-2 border-slate-200 space-y-4">
          <div className="flex bg-white rounded-lg p-1 border-2 border-slate-300 shadow-sm">
            <button type="button" onClick={() => setTripType('ROUND_TRIP')} className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-black rounded transition-all ${tripType === 'ROUND_TRIP' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}><Repeat className="h-3.5 w-3.5" /> Ida e Volta</button>
            <button type="button" onClick={() => setTripType('ONE_WAY')} className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-black rounded transition-all ${tripType === 'ONE_WAY' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}><ArrowRight className="h-3.5 w-3.5" /> Só Ida</button>
          </div>
          
          <div className="space-y-1">
            <label className="text-[11px] font-black text-slate-950 uppercase tracking-wider ml-1">Origem do Viajante</label>
            <CitySearchInput value={originCity} onChange={setOriginCity} placeholder="Ex: Goiânia" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-black text-slate-950 uppercase tracking-wider ml-1">Passageiros</label>
              <input type="number" min="1" value={passengers} onChange={(e) => setPassengers(parseInt(e.target.value))} className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg text-sm text-slate-950 font-bold focus:border-slate-600 outline-none bg-white" />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-black text-slate-950 uppercase tracking-wider ml-1">Raio Busca (km)</label>
              <input type="number" step="50" min="0" value={originRadius} onChange={(e) => setOriginRadius(parseInt(e.target.value))} className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg text-sm text-slate-950 font-bold focus:border-slate-600 outline-none bg-white" />
            </div>
          </div>
        </div>

        {/* Bloco 2: Destino Principal (Blue) */}
        <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-200 space-y-4 shadow-sm">
           <h3 className="text-xs font-black text-blue-950 uppercase tracking-widest border-b-2 border-blue-100 pb-2">Destino Principal</h3>
           <div className="space-y-1">
             <label className="text-[11px] font-black text-blue-900 uppercase ml-1">Cidade Destino</label>
             <CitySearchInput value={mainDestination.city} onChange={(val) => setMainDestination({...mainDestination, city: val})} placeholder="Ex: Atlanta" />
           </div>
           
           <div className="flex gap-4">
             <div className="flex-1 space-y-1">
               <label className="text-[11px] font-black text-blue-900 uppercase ml-1">Dias de Estadia</label>
               <input type="number" min="1" value={mainDestination.durationDays} onChange={(e) => setMainDestination({...mainDestination, durationDays: parseInt(e.target.value)})} className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg text-sm text-slate-950 font-bold bg-white focus:border-blue-700 outline-none" />
             </div>
             <div className="flex-1 space-y-1">
               <label className="text-[11px] font-black text-blue-900 uppercase ml-1">Data Específica</label>
               <input type="date" onChange={(e) => setMainDestination({...mainDestination, specificDate: e.target.value, isFixedDate: !!e.target.value})} className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg text-sm text-slate-950 font-bold bg-white focus:border-blue-700 outline-none" />
             </div>
           </div>
        </div>

        {/* Bloco 3: Paradas Adicionais (Indigo) - Padronizado e em Linha Única */}
        <div className="bg-indigo-50 p-4 rounded-xl border-2 border-indigo-200 space-y-4 shadow-sm">
           <h3 className="text-xs font-black text-indigo-950 uppercase tracking-widest border-b-2 border-indigo-100 pb-2">Paradas Adicionais</h3>
           
           {/* Lista de paradas já adicionadas */}
           {stops.length > 0 && (
             <div className="space-y-2">
               {stops.map((s, i) => (
                 <div key={i} className="flex items-center justify-between p-3 bg-white border-2 border-indigo-100 rounded-xl text-xs shadow-sm group hover:border-indigo-400 transition-colors">
                   <span className="font-bold text-slate-900 uppercase tracking-tight">{s.city} <span className="text-indigo-700 ml-2 font-black">[{s.durationDays} DIAS]</span></span>
                   <button type="button" onClick={() => removeStop(i)} className="p-1.5 hover:bg-red-100 rounded-lg transition-colors">
                     <Trash2 className="h-4 w-4 text-slate-400 hover:text-red-600" />
                   </button>
                 </div>
               ))}
             </div>
           )}
           
           {/* Novo item: Inputs na mesma linha mantendo labels superiores individuais */}
           <div className="bg-white/50 p-3 rounded-xl border-2 border-dashed border-indigo-300">
              <div className="flex gap-3 items-end">
                <div className="flex-[3] space-y-1">
                  <label className="text-[11px] font-black text-indigo-950 uppercase ml-1">Adicionar Cidade</label>
                  <CitySearchInput 
                    value={newCity} 
                    onChange={setNewCity} 
                    placeholder="Ex: Paris, Doha..." 
                  />
                </div>
                
                <div className="flex-1 space-y-1">
                  <label className="text-[11px] font-black text-indigo-950 uppercase ml-1 whitespace-nowrap">Nº Dias</label>
                  <input 
                    type="number" 
                    value={newDuration} 
                    onChange={(e) => setNewDuration(parseInt(e.target.value))} 
                    className="w-full border-2 border-indigo-300 rounded-lg text-sm py-2 px-3 text-slate-950 font-bold bg-white focus:border-indigo-700 outline-none" 
                  />
                </div>

                <button 
                  type="button" 
                  onClick={addStop} 
                  className="p-2.5 bg-indigo-700 hover:bg-indigo-900 text-white rounded-lg transition-all shadow-md active:scale-95 flex items-center justify-center min-w-[44px]"
                  title="Adicionar Parada"
                >
                  <Plus className="h-6 w-6 stroke-[3]" />
                </button>
              </div>
           </div>
        </div>

        {/* Bloco 4: Solver Settings (White/Slate) */}
        <div className="border-2 border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <button 
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className="w-full flex items-center justify-between p-4 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <h3 className="text-xs font-black text-slate-950 uppercase tracking-widest flex items-center gap-2">
              <Settings2 className="h-4 w-4 text-blue-800" /> Inteligência do Solver
            </h3>
            {showSettings ? <ChevronUp className="h-4 w-4 text-slate-800" /> : <ChevronDown className="h-4 w-4 text-slate-800" />}
          </button>
          
          {showSettings && (
            <div className="p-5 bg-white space-y-5 border-t-2 border-slate-100 animate-in fade-in slide-in-from-top-2">
              <p className="text-[10px] text-slate-700 font-bold uppercase tracking-tight leading-relaxed">Configuração de objetivos NSGA-II:</p>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-[11px] font-black text-emerald-950 mb-2">
                    <span className="flex items-center gap-1.5"><DollarSign className="h-4 w-4" /> ECONOMIA (COST)</span>
                    <span className="bg-emerald-100 px-2 py-0.5 rounded text-emerald-950">{weights.cost}%</span>
                  </div>
                  <input type="range" min="0" max="100" value={weights.cost} onChange={(e) => setWeights({...weights, cost: parseInt(e.target.value)})} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-700" />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-black text-blue-950 mb-2">
                    <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> VELOCIDADE (TIME)</span>
                    <span className="bg-blue-100 px-2 py-0.5 rounded text-blue-950">{weights.time}%</span>
                  </div>
                  <input type="range" min="0" max="100" value={weights.time} onChange={(e) => setWeights({...weights, time: parseInt(e.target.value)})} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-700" />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-black text-purple-950 mb-2">
                    <span className="flex items-center gap-1.5"><Heart className="h-4 w-4" /> CONFORTO (CONVENIENCE)</span>
                    <span className="bg-purple-100 px-2 py-0.5 rounded text-purple-950">{weights.convenience}%</span>
                  </div>
                  <input type="range" min="0" max="100" value={weights.convenience} onChange={(e) => setWeights({...weights, convenience: parseInt(e.target.value)})} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-700" />
                </div>
              </div>
            </div>
          )}
        </div>

        <button 
          type="submit" 
          disabled={isLoading} 
          className={`w-full py-5 rounded-xl text-white font-black text-sm uppercase tracking-widest shadow-xl transition-all active:scale-[0.97] ${isLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-950 hover:bg-black hover:shadow-slate-500/40'}`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-3">
              <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
              <span>Processando Otimização...</span>
            </div>
          ) : 'Executar Solver de Viagem'}
        </button>
      </form>
    </div>
  );
};
