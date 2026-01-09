
import React, { useState } from 'react';
import { ItinerarySolution } from '../types';
import { Database, Download, ChevronLeft, ChevronRight, CheckCircle, XCircle, Clock, Tag, Calendar, Filter } from 'lucide-react';

interface Props {
  solution: ItinerarySolution;
}

const ITEMS_PER_PAGE = 5;

export const CrawlerDataVisualization: React.FC<Props> = ({ solution }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const flights = solution.consideredFlights || [];
  
  const totalPages = Math.ceil(flights.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedFlights = flights.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleExportCSV = () => {
    const headers = ["Empresa", "Voo", "Origem", "Destino", "Data", "Hora", "Preco_BRL", "Duracao", "Status"];
    const rows = flights.map(f => [
      f.airline,
      f.flightCode,
      f.from,
      f.to,
      f.date,
      f.departureTime,
      f.price,
      f.duration,
      f.isSelected ? "Selecionado" : "Rejeitado"
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(e => e.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `crawler_data_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-900 text-white rounded-xl shadow-xl overflow-hidden mb-6 border border-slate-700 font-mono">
      {/* Header com Ações */}
      <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/10 p-2 rounded-lg">
            <Database className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-tighter">
              DADOS BRUTOS DO CRAWLER
            </h3>
            <p className="text-[10px] text-slate-400">VARREDURA DE MERCADO ATIVA</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-[10px] font-bold rounded border border-slate-600 transition-colors"
          >
            <Download className="h-3 w-3" /> EXPORTAR CSV
          </button>
          <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-1.5 rounded border border-slate-600">
            {flights.length} REGISTROS
          </span>
        </div>
      </div>

      {/* Tabela de Dados */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[11px] border-collapse min-w-[600px]">
          <thead className="bg-slate-900 text-slate-500 border-b border-slate-800">
            <tr>
              <th className="px-6 py-3 font-bold uppercase tracking-widest">Empresa / Voo</th>
              <th className="px-6 py-3 font-bold uppercase tracking-widest">Data / Dep. Time</th>
              <th className="px-6 py-3 font-bold uppercase tracking-widest">Rota Bruta</th>
              <th className="px-6 py-3 font-bold uppercase tracking-widest">Preço Unitário</th>
              <th className="px-6 py-3 font-bold uppercase tracking-widest text-center">Status Solver</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {paginatedFlights.map((flight) => (
              <tr 
                key={flight.id} 
                className={`transition-colors ${flight.isSelected ? 'bg-emerald-950/20' : 'hover:bg-slate-800/20'}`}
              >
                {/* Coluna 1: Empresa e Voo (Um abaixo do outro) */}
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-black text-slate-100 text-[12px]">{flight.airline}</span>
                    <span className="text-emerald-400 text-[10px] flex items-center gap-1 opacity-70">
                      <Tag className="h-2.5 w-2.5" /> {flight.flightCode}
                    </span>
                  </div>
                </td>

                {/* Coluna 2: Data e Hora (Um abaixo do outro) */}
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-slate-300 font-bold flex items-center gap-1">
                       <Calendar className="h-2.5 w-2.5" /> {flight.date}
                    </span>
                    <span className="text-blue-400 text-[10px] font-bold flex items-center gap-1">
                       <Clock className="h-2.5 w-2.5" /> {flight.departureTime}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-slate-400 font-bold">
                    <span className="text-slate-200">{flight.from}</span>
                    <span className="text-slate-600">→</span>
                    <span className="text-slate-200">{flight.to}</span>
                  </div>
                  <div className="text-[9px] text-slate-600 uppercase">{flight.duration} • {flight.stops} paradas</div>
                </td>

                <td className="px-6 py-4 font-black text-emerald-400">
                  R$ {flight.price.toLocaleString()}
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    {flight.isSelected ? (
                      <div className="flex flex-col items-center gap-1 text-emerald-400">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-[8px] font-black uppercase">Selected</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-slate-600">
                        <XCircle className="h-4 w-4" />
                        <span className="text-[8px] font-black uppercase">Rejected</span>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      <div className="p-4 bg-slate-800/50 border-t border-slate-700 flex items-center justify-between">
        <div className="text-[10px] text-slate-500 font-bold uppercase">
          Página {currentPage} de {totalPages}
        </div>
        
        <div className="flex items-center gap-1">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="p-1.5 rounded hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors border border-slate-600"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          <div className="flex gap-1">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-6 h-6 text-[9px] font-bold rounded flex items-center justify-center transition-all ${
                  currentPage === i + 1 ? 'bg-emerald-600 text-white' : 'hover:bg-slate-700 text-slate-400'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="p-1.5 rounded hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors border border-slate-600"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Footer Info */}
      <div className="p-3 bg-slate-900 border-t border-slate-800">
        <div className="flex gap-2 items-center text-[9px] text-slate-600">
          <Filter className="h-3 w-3" />
          <p>
            O Solver analisou todos os candidatos acima para definir o melhor custo-benefício geográfico. 
            Candidatos rejeitados não atendiam aos pesos de conveniência ou tempo definidos.
          </p>
        </div>
      </div>
    </div>
  );
};
