
// Modelos de Domínio para o Travel Solver

export enum TransportMode {
  FLIGHT = 'FLIGHT',
  CAR_RENTAL = 'CAR_RENTAL'
}

export type TripType = 'ROUND_TRIP' | 'ONE_WAY';

export interface SolverWeights {
  cost: number;
  time: number;
  convenience: number;
}

export interface Stopover {
  city: string;
  durationDays: number;
  isFixedDate: boolean;
  specificDate?: string;
  isMainDestination?: boolean; // Identifica se é o destino principal
}

export interface TravelPreferences {
  tripType: TripType;
  originCity: string;
  originRadiusKm: number; // Raio de busca para aeroportos alternativos
  mainDestination: Stopover; // Destino principal separado
  passengers: number;
  stops: Stopover[]; // Paradas intermediárias
  solverWeights: SolverWeights; // Pesos para o algoritmo
}

export interface RouteSegment {
  from: string;
  fromCode: string; // IATA code (ex: GYN)
  to: string;
  toCode: string; // IATA code (ex: ATL)
  date: string; // DD/MM/YY da viagem deste trecho
  departureTime?: string; // Hora de partida (ex: 14:35)
  flightCode?: string; // Código do voo (ex: G3 1234)
  mode: TransportMode;
  duration: string;
  costEstimate: number; // Custo UNITÁRIO do transporte
  stayCostEstimate: number; // Custo TOTAL de hospedagem nesta cidade
  foodCostEstimate: number; // Custo TOTAL de alimentação nesta cidade
  totalCost: number; // (Transporte * Passageiros) + Hospedagem + Alimentação
  details: string; // Nome da cia aérea ou locadora
  distanceKm: number;
}

export interface ConsideredFlight {
  id: string;
  airline: string;
  flightCode: string; // Código do voo (ex: AD 4567)
  departureTime: string; // Hora de partida (ex: 08:20)
  from: string;
  to: string;
  date: string; // DD/MM/YY
  price: number;
  duration: string;
  stops: number;
  isSelected: boolean;
  reasonForChoice?: string;
}

export interface NsgaMetric {
  name: string;
  value: number;
  score: number; // 0 a 100 (qualidade da solução neste objetivo)
}

export interface ItinerarySolution {
  tripType: TripType;
  originUsed: string; // A origem escolhida pelo AI dentro do raio
  segments: RouteSegment[];
  consideredFlights: ConsideredFlight[]; // Voos "vistos" pelo crawler
  totalTransportCost: number; // Custo total apenas de deslocamento
  totalAccommodationCost: number; // Custo total de hotéis/airbnb
  totalFoodCost: number; // Custo total de alimentação
  totalCostEstimate: number; // Soma total
  totalDistanceKm: number;
  reasoning: string; // Explicação da IA
  
  // Dados para visualização do NSGA
  objectives: {
    cost: NsgaMetric;
    time: NsgaMetric;
    convenience: NsgaMetric;
  };
  paretoFrontExplanation: string; // Explicação sobre trade-offs
}

export type LoadingState = 'idle' | 'solving' | 'success' | 'error';
