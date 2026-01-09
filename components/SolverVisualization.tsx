import React from 'react';
import { ItinerarySolution } from '../types';
import { GitGraph, Target, TrendingDown, Scale } from 'lucide-react';

interface Props {
  solution: ItinerarySolution;
}

export const SolverVisualization: React.FC<Props> = ({ solution }) => {
  return (
    <div className="bg-slate-900 text-white rounded-xl shadow-xl overflow-hidden mb-6 border border-slate-700">
      <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex items-center justify-between">
        <h3 className="font-mono text-sm font-bold flex items-center gap-2 text-blue-400">
          <GitGraph className="h-4 w-4" />
          SOLVER LOGIC: NSGA-II SIMULATION
        </h3>
        <span className="text-xs bg-blue-900 text-blue-200 px-2 py-1 rounded font-mono">
          PARETO OPTIMAL
        </span>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Lado Esquerdo: Métricas de Fitness */}
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Target className="h-4 w-4" /> Funções de Aptidão (Fitness)
          </h4>
          
          <div className="space-y-4">
            {/* Custo */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-300">Minimizar Custo</span>
                <span className="text-emerald-400 font-mono">Score: {solution.objectives.cost.score}/100</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-1000" 
                  style={{ width: `${solution.objectives.cost.score}%` }}
                ></div>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-mono">Valor Real: R$ {solution.totalCostEstimate.toLocaleString()}</p>
            </div>

            {/* Tempo */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-300">Minimizar Tempo</span>
                <span className="text-blue-400 font-mono">Score: {solution.objectives.time.score}/100</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-1000" 
                  style={{ width: `${solution.objectives.time.score}%` }}
                ></div>
              </div>
            </div>

            {/* Conveniência */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-300">Maximizar Conveniência</span>
                <span className="text-purple-400 font-mono">Score: {solution.objectives.convenience.score}/100</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-500 transition-all duration-1000" 
                  style={{ width: `${solution.objectives.convenience.score}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Lado Direito: Fronteira de Pareto */}
        <div className="border-l border-slate-700 pl-0 md:pl-8">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Scale className="h-4 w-4" /> Análise da Fronteira de Pareto
          </h4>
          
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 mb-4">
            <p className="text-sm text-slate-300 leading-relaxed font-mono">
              {">"} {solution.paretoFrontExplanation}
            </p>
          </div>

          <div className="flex items-start gap-3">
            <TrendingDown className="h-5 w-5 text-yellow-500 mt-1" />
            <div>
              <p className="text-sm text-slate-200 font-semibold">Solução de Compromisso</p>
              <p className="text-xs text-slate-500">
                O algoritmo selecionou esta rota pois ela domina as outras opções no equilíbrio entre custo e tempo, considerando o raio de busca da origem.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
