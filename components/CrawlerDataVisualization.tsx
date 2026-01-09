
import React from 'react';
import { ItinerarySolution } from '../types';
import { Database, Search, CheckCircle, XCircle, Clock, Tag } from 'lucide-react';

interface Props {
  solution: ItinerarySolution;
}

export const CrawlerDataVisualization: React.FC<Props> = ({ solution }) => {
  return (
    <div className="bg-slate-900 text-white rounded-xl shadow-xl overflow-hidden mb-6 border border-slate-700 font-mono">
      <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex items-center justify-between">
        <h3 className="text-sm font-bold flex items-center gap-2 text-emerald-400">
          <Database className="h-4 w-4" />
          RAW CRAWLER DATA: FLIGHT CANDIDATES
        </h3>
        <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-1 rounded">
          {solution.consideredFlights.length} ENTRIES FOUND
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-[11px] border-collapse">
          <thead className="bg-slate-800/50 text-slate-400 border-b border-slate-700">
            <tr>
              <th className="px-6 py-3 font-bold uppercase">Airline</th>
              <th className="px-6 py-3 font-bold uppercase">Flight Code</th>
              <th className="px-6 py-3 font-bold uppercase">Route</th>
              <th className="px-6 py-3 font-bold uppercase">Departure</th>
              <th className="px-6 py-3 font-bold uppercase">Price (BRL)</th>
              <th className="px-6 py-3 font-bold uppercase">Duration</th>
              <th className="px-6 py-3 font-bold uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {solution.consideredFlights.map((flight) => (
              <tr 
                key={flight.id} 
                className={`transition-colors ${flight.isSelected ? 'bg-emerald-950/30' : 'hover:bg-slate-800/30'}`}
              >
                <td className="px-6 py-4 font-semibold text-slate-200">{flight.airline}</td>
                <td className="px-6 py-4 text-emerald-300 flex items-center gap-1">
                  <Tag className="h-3 w-3" /> {flight.flightCode}
                </td>
                <td className="px-6 py-4 text-slate-400">
                  {flight.from} <span className="mx-1 text-slate-600">→</span> {flight.to}
                </td>
                <td className="px-6 py-4 text-blue-300 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {flight.departureTime}
                </td>
                <td className="px-6 py-4 font-bold text-slate-200">
                  R$ {flight.price.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-slate-400">{flight.duration}</td>
                <td className="px-6 py-4">
                  {flight.isSelected ? (
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <CheckCircle className="h-3.5 w-3.5" />
                      <span className="text-[10px] font-bold">SELECTED</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <XCircle className="h-3.5 w-3.5" />
                      <span className="text-[10px]">SUBOPTIMAL</span>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-slate-900 border-t border-slate-800">
        <div className="flex gap-2 items-start text-[10px] text-slate-500">
          <Search className="h-3 w-3 mt-0.5" />
          <p>
            Análise técnica de {solution.consideredFlights.length} voos capturados. 
            O algoritmo selecionou as opções que minimizam o custo por KM mantendo uma janela de partida conveniente ({solution.objectives.convenience.score}% score).
          </p>
        </div>
      </div>
    </div>
  );
};
