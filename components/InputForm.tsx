
import React, { useState } from 'react';
import { TravelPreferences, Stopover, TripType } from '../types';
import { Plus, Trash2, Calendar, Users, Target, ArrowRightCircle, Repeat, ArrowRight, MapPin } from 'lucide-react';
import { CitySearchInput } from './CitySearchInput';

interface Props {
  onSolve: (prefs: TravelPreferences) => void;
  isLoading: boolean;
}

export const InputForm: React.FC<Props> = ({ onSolve, isLoading }) => {
  // Configurações Gerais
  const [tripType, setTripType] = useState<TripType>('ROUND_TRIP');
  const [passengers, setPassengers] = useState(1);
  const [originCity, setOriginCity] = useState('Goiânia (GYN)');
  const [originRadius, setOriginRadius] = useState(0);

  // Destino Principal
  const [mainDestination, setMainDestination] = useState<Stopover>({
    city: '',
    durationDays: 7,
    isFixedDate: false,
    isMainDestination: true
  });

  // Lista de Paradas Intermediárias
  const [stops, setStops] = useState<Stopover[]>([]);

  // Estado para adicionar nova cidade intermediária
  const [newCity, setNewCity] = useState('');
  const [newDuration, setNewDuration] = useState(3);
  const [newDate, setNewDate] = useState('');
  const [isNewDateFixed, setIsNewDateFixed] = useState(false);

  const addStop = () => {
    if (newCity.trim()) {
      setStops([
        ...stops, 
        { 
          city: newCity.trim(), 
          durationDays: newDuration, 
          isFixedDate: isNewDateFixed,
          specificDate: isNewDateFixed ? newDate : undefined,
          isMainDestination: false
        }
      ]);
      setNewCity('');
      setNewDuration(3);
      setNewDate('');
      setIsNewDateFixed(false);
    }
  };

  const removeStop = (index: number) => {
    setStops(stops.filter((_, i) => i !== index));
  };

  const updateMainDest = (field: keyof Stopover, value: any) => {
    setMainDestination(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mainDestination.city) {
      alert("Por favor, informe o Destino Principal.");
      return;
    }

    onSolve({ 
      tripType,
      originCity, 
      originRadiusKm: originRadius, 
      passengers, 
      mainDestination,
      stops 
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full lg:w-1/3 h-fit sticky top-6 overflow-y-auto max-h-[90vh]">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Target className="text-blue-600" />
        Parâmetros da Viagem
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Seção 1: Tipo e Origem */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Origem & Tipo</h3>
          
          {/* Tipo de Viagem */}
          <div className="flex bg-white rounded-lg p-1 border border-slate-200">
            <button
              type="button"
              onClick={() => setTripType('ROUND_TRIP')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded transition-colors ${tripType === 'ROUND_TRIP' ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <Repeat className="h-3 w-3" /> Ida e Volta
            </button>
            <button
              type="button"
              onClick={() => setTripType('ONE_WAY')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded transition-colors ${tripType === 'ONE_WAY' ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <ArrowRight className="h-3 w-3" /> Só Ida
            </button>
          </div>

          <div className="flex gap-3">
             <div className="flex-1">
                <label className="block text-xs font-medium text-slate-700 mb-1">Passageiros</label>
                <div className="relative">
                  <Users className="absolute left-2 top-2 h-4 w-4 text-slate-400" />
                  <input 
                    type="number" 
                    min="1" 
                    max="10"
                    value={passengers}
                    onChange={(e) => setPassengers(parseInt(e.target.value))}
                    className="w-full pl-8 pr-2 py-1.5 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>
             </div>
             <div className="flex-[2]">
                <CitySearchInput 
                  label="Cidade Origem"
                  value={originCity}
                  onChange={setOriginCity}
                  placeholder="Ex: Goiânia"
                />
             </div>
          </div>
          
          <div>
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>Raio busca extra (aeroportos vizinhos)</span>
                <span className="font-bold">{originRadius} km</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="500" 
                step="50"
                value={originRadius}
                onChange={(e) => setOriginRadius(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
          </div>
        </div>

        {/* Seção 2: Destino Principal */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 space-y-3">
           <h3 className="text-xs font-bold text-blue-800 uppercase tracking-wider flex items-center gap-2">
             <Target className="h-3 w-3" /> Destino Principal
           </h3>
           
           <div>
             <CitySearchInput 
               value={mainDestination.city}
               onChange={(val) => updateMainDest('city', val)}
               placeholder="Para onde você vai? (ex: Atlanta)"
               className="mb-2"
               icon={<Target className="absolute left-2 top-2 h-4 w-4 text-blue-400" />}
             />
             <div className="grid grid-cols-2 gap-2">
                 <div>
                   <label className="text-[10px] text-blue-600 font-bold block mb-1">Dias de Estadia</label>
                   <input 
                     type="number" 
                     min="1"
                     value={mainDestination.durationDays}
                     onChange={(e) => updateMainDest('durationDays', parseInt(e.target.value))}
                     className="w-full px-2 py-1 border border-blue-300 rounded text-xs"
                   />
                 </div>
                 <div>
                   <label className="text-[10px] text-blue-600 font-bold block mb-1">Data de Chegada (Opcional)</label>
                   <input 
                      type="date" 
                      value={mainDestination.specificDate || ''}
                      onChange={(e) => {
                        updateMainDest('specificDate', e.target.value);
                        updateMainDest('isFixedDate', !!e.target.value);
                      }}
                      className="w-full px-2 py-1 border border-blue-300 rounded text-xs"
                    />
                 </div>
             </div>
           </div>
        </div>

        {/* Seção 3: Paradas */}
        <div className="space-y-4">
           <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
             Paradas Intermediárias (Opcional)
           </h3>

           {/* Lista de Paradas */}
           <div className="space-y-3">
             {stops.map((stop, index) => (
               <div key={index} className="p-3 rounded border bg-white border-slate-200 relative group">
                 <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-slate-700 text-sm">
                      {index + 1}. {stop.city}
                    </span>
                    <button type="button" onClick={() => removeStop(index)} className="text-slate-400 hover:text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </button>
                 </div>
                 <div className="text-xs text-slate-500">
                   Ficar {stop.durationDays} dias {stop.isFixedDate && `• Data: ${stop.specificDate}`}
                 </div>
               </div>
             ))}
             
             {stops.length === 0 && (
               <div className="text-xs text-slate-400 italic text-center py-2 border border-dashed rounded">
                 Nenhuma parada extra adicionada.
               </div>
             )}
           </div>

           {/* Adicionar Nova Parada */}
           <div className="border-t border-slate-100 pt-4">
             <div className="flex flex-col gap-2">
               <CitySearchInput 
                 placeholder="Adicionar cidade (ex: Miami)"
                 value={newCity}
                 onChange={setNewCity}
               />
               <div className="flex gap-2">
                 <input 
                   type="number"
                   placeholder="Dias" 
                   min="1"
                   value={newDuration}
                   onChange={(e) => setNewDuration(parseInt(e.target.value))}
                   className="w-20 px-3 py-2 border border-slate-300 rounded text-sm"
                 />
                 <button 
                   type="button" 
                   onClick={addStop}
                   disabled={!newCity}
                   className="flex-1 bg-slate-800 text-white p-2 rounded hover:bg-slate-900 disabled:opacity-50 text-sm flex items-center justify-center gap-2"
                 >
                   <Plus className="h-4 w-4" /> Adicionar Parada
                 </button>
               </div>
             </div>
           </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 rounded-xl text-white font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${
            isLoading 
              ? 'bg-slate-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-blue-200/50 hover:scale-[1.02]'
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processando Otimização...
            </>
          ) : (
            <>
              <ArrowRightCircle className="h-5 w-5" />
              Otimizar Rota Inteligente
            </>
          )}
        </button>
      </form>
    </div>
  );
};
