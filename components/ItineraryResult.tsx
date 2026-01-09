
import React, { useState } from 'react';
import { ItinerarySolution, TransportMode } from '../types';
import { Plane, Car, ArrowRight, CalendarDays, ExternalLink, BedDouble, ChevronDown, ChevronUp, Info, Utensils, Database, GitGraph, Clock, Tag } from 'lucide-react';
import { SolverVisualization } from './SolverVisualization';
import { CrawlerDataVisualization } from './CrawlerDataVisualization';

interface Props {
  solution: ItinerarySolution;
}

export const ItineraryResult: React.FC<Props> = ({ solution }) => {
  const [activeTab, setActiveTab] = useState<'none' | 'solver' | 'crawler'>('none');
  
  const getFlightLink = (from: string, to: string, date: string) => {
    const cleanFrom = from.match(/[A-Z]{3}/)?.[0] || from.substring(0, 3).toUpperCase();
    const cleanTo = to.match(/[A-Z]{3}/)?.[0] || to.substring(0, 3).toUpperCase();
    return `https://www.google.com/travel/flights?q=Flights%20from%20${cleanFrom}%20to%20${cleanTo}%20on%20${date}`;
  };

  const getCarLink = (location: string, date: string) => {
    const cleanLoc = location.match(/[A-Z]{3}/)?.[0] || location.substring(0, 3).toUpperCase();
    return `https://www.kayak.com.br/cars/${cleanLoc}/${date}`;
  };

  const toggleTab = (tab: 'solver' | 'crawler') => {
    if (activeTab === tab) setActiveTab('none');
    else setActiveTab(tab);
  };

  return (
    <div className="flex-1 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Botões Discretos para Detalhes Técnicos */}
      <div className="flex justify-end gap-2">
        <button 
          onClick={() => toggleTab('crawler')}
          className={`flex items-center gap-2 text-xs font-medium transition-colors px-3 py-1.5 rounded-full shadow-sm border ${
            activeTab === 'crawler' 
              ? 'bg-emerald-600 text-white border-emerald-600' 
              : 'bg-white text-slate-500 hover:text-emerald-600 border-slate-200'
          }`}
        >
          <Database className="h-3 w-3" />
          {activeTab === 'crawler' ? 'Ocultar Crawler' : 'Ver Dados do Crawler'}
        </button>

        <button 
          onClick={() => toggleTab('solver')}
          className={`flex items-center gap-2 text-xs font-medium transition-colors px-3 py-1.5 rounded-full shadow-sm border ${
            activeTab === 'solver' 
              ? 'bg-blue-600 text-white border-blue-600' 
              : 'bg-white text-slate-500 hover:text-blue-600 border-slate-200'
          }`}
        >
          <GitGraph className="h-3 w-3" />
          {activeTab === 'solver' ? 'Ocultar Solver' : 'Ver Lógica do Solver'}
        </button>
      </div>

      {activeTab === 'solver' && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <SolverVisualization solution={solution} />
        </div>
      )}

      {activeTab === 'crawler' && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <CrawlerDataVisualization solution={solution} />
        </div>
      )}

      {/* Resumo de Custos */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col gap-6 border-b border-slate-100 pb-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                Itinerário Planejado
                <span className="text-xs font-normal px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full border border-blue-200">
                  {solution.tripType === 'ROUND_TRIP' ? 'Ciclo Completo' : 'Linear'}
                </span>
              </h3>
              <p className="text-sm text-slate-400 mt-1">Rota otimizada via algoritmos de busca multiobjetivo</p>
            </div>
            
            <div className="text-right">
              <p className="text-2xl font-bold text-emerald-600">R$ {solution.totalCostEstimate.toLocaleString()}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Total Estimado</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-lg">
             <div className="text-center border-r border-slate-200">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Transporte (Unid.)</p>
                <p className="text-sm font-semibold text-slate-700">R$ {solution.totalTransportCost.toLocaleString()}</p>
             </div>
             <div className="text-center border-r border-slate-200">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Hospedagem</p>
                <p className="text-sm font-semibold text-slate-700">R$ {solution.totalAccommodationCost.toLocaleString()}</p>
             </div>
             <div className="text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Alimentação</p>
                <p className="text-sm font-semibold text-slate-700">R$ {solution.totalFoodCost.toLocaleString()}</p>
             </div>
          </div>
        </div>

        {/* Timeline dos Trechos */}
        <div className="relative border-l-2 border-blue-100 ml-4 space-y-10 pb-4">
          {solution.segments.map((segment, index) => (
            <div key={index} className="relative pl-8 group">
              <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                segment.mode === TransportMode.FLIGHT ? 'bg-blue-500' : 'bg-orange-500'
              }`}></div>

              <div className="bg-white border border-slate-200 rounded-lg p-0 hover:border-blue-300 transition-all hover:shadow-lg overflow-hidden">
                <div className="bg-slate-50 p-3 border-b border-slate-100 flex justify-between items-center">
                   <div className="inline-flex items-center gap-2">
                      <div className="inline-flex items-center gap-1 bg-white border border-slate-200 px-2 py-0.5 rounded text-xs font-medium text-slate-600">
                        <CalendarDays className="h-3 w-3" />
                        {segment.date}
                      </div>
                      {segment.mode === TransportMode.FLIGHT ? (
                        <span className="flex items-center gap-1 text-blue-700 text-[10px] font-bold uppercase tracking-tighter">
                          <Plane className="h-3 w-3" /> Voo {segment.flightCode && <span className="ml-1 px-1 bg-blue-100 rounded text-[9px]">{segment.flightCode}</span>}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-orange-700 text-[10px] font-bold uppercase tracking-tighter">
                          <Car className="h-3 w-3" /> Carro
                        </span>
                      )}
                   </div>
                   <div className="text-[10px] text-slate-400 font-mono font-bold flex items-center gap-3">
                     {segment.departureTime && <span className="flex items-center gap-1 text-slate-600"><Clock className="h-3 w-3" /> {segment.departureTime}</span>}
                     <span>{segment.distanceKm} KM • {segment.duration}</span>
                   </div>
                </div>

                <div className="p-4 flex flex-col md:flex-row gap-6">
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-2 font-bold text-slate-800 text-lg">
                      <span className="flex items-center gap-1">
                        {segment.from} 
                        <span className="text-[10px] font-mono text-slate-400">({segment.fromCode})</span>
                      </span>
                      <ArrowRight className="h-4 w-4 text-blue-300" />
                      <span className="flex items-center gap-1">
                        {segment.to}
                        <span className="text-[10px] font-mono text-slate-400">({segment.toCode})</span>
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-xs text-slate-500 italic bg-blue-50/50 inline-block px-2 py-1 rounded">
                        {segment.details}
                      </p>
                      {segment.flightCode && (
                        <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
                          <Tag className="h-2.5 w-2.5" /> Identificador Técnico: {segment.flightCode}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 min-w-[220px] bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                    <div className="flex justify-between items-center text-xs">
                       <span className="text-slate-500">Transporte (Unid.)</span>
                       <span className="font-bold text-slate-700">R$ {segment.costEstimate.toLocaleString()}</span>
                    </div>

                    {segment.stayCostEstimate > 0 && (
                      <div className="flex justify-between items-center text-xs">
                         <span className="text-slate-500 flex items-center gap-1">
                           <BedDouble className="h-3 w-3" /> Hospedagem
                         </span>
                         <span className="font-bold text-slate-700">R$ {segment.stayCostEstimate.toLocaleString()}</span>
                      </div>
                    )}

                    {segment.foodCostEstimate > 0 && (
                      <div className="flex justify-between items-center text-xs">
                         <span className="text-slate-500 flex items-center gap-1">
                           <Utensils className="h-3 w-3" /> Alimentação
                         </span>
                         <span className="font-bold text-slate-700">R$ {segment.foodCostEstimate.toLocaleString()}</span>
                      </div>
                    )}
                    
                    <div className="pt-2 border-t border-slate-200 mt-1">
                      {segment.mode === TransportMode.FLIGHT ? (
                        <a 
                          href={getFlightLink(segment.fromCode, segment.toCode, segment.date)}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold uppercase rounded transition-all shadow-sm hover:shadow-md"
                        >
                          BUSCAR VOOS REAIS <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <a 
                          href={getCarLink(segment.fromCode, segment.date)}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-bold uppercase rounded transition-all shadow-sm hover:shadow-md"
                        >
                          Ver Aluguel <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ))}
          
          <div className="absolute -left-[9px] bottom-0 w-4 h-4 rounded-full bg-slate-800 border-2 border-white shadow-sm"></div>
          <div className="pl-8 pt-2">
            <span className="text-sm font-bold text-slate-800">
              {solution.tripType === 'ROUND_TRIP' ? 'Retorno Concluído' : 'Chegada ao Destino Final'}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
