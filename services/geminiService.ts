
import { GoogleGenAI, Type } from "@google/genai";
import { ItinerarySolution, TravelPreferences, Stopover } from "../types";

// Schema definitions using the Type enum from @google/genai
const nsgaMetricSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    value: { type: Type.NUMBER },
    score: { type: Type.NUMBER, description: "Nota de 0 a 100 para este critério" }
  },
  required: ["name", "value", "score"]
};

const consideredFlightSchema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING },
    airline: { type: Type.STRING },
    flightCode: { type: Type.STRING, description: "Código único do voo (ex: LA3456, G31212). NÃO inclua datas ou horários aqui." },
    departureTime: { type: Type.STRING, description: "Apenas o horário formato HH:MM (ex: 15:30)" },
    from: { type: Type.STRING },
    to: { type: Type.STRING },
    date: { type: Type.STRING, description: "Data no padrão brasileiro DD/MM/YY." },
    price: { type: Type.NUMBER, description: "Preço convertido para REAIS (BRL)." },
    duration: { type: Type.STRING, description: "Duração legível (ex: 8h 20m)" },
    stops: { type: Type.NUMBER },
    isSelected: { type: Type.BOOLEAN },
    reasonForChoice: { type: Type.STRING }
  },
  required: ["id", "airline", "flightCode", "departureTime", "from", "to", "date", "price", "duration", "stops", "isSelected"]
};

const routeSegmentSchema = {
  type: Type.OBJECT,
  properties: {
    from: { type: Type.STRING },
    fromCode: { type: Type.STRING },
    to: { type: Type.STRING },
    toCode: { type: Type.STRING },
    date: { type: Type.STRING, description: "Data no padrão brasileiro DD/MM/YY. Respeite datas fixas informadas." },
    departureTime: { type: Type.STRING },
    flightCode: { type: Type.STRING },
    mode: { type: Type.STRING, enum: ["FLIGHT", "CAR_RENTAL"] },
    duration: { type: Type.STRING },
    costEstimate: { type: Type.NUMBER },
    stayCostEstimate: { type: Type.NUMBER },
    foodCostEstimate: { type: Type.NUMBER },
    totalCost: { type: Type.NUMBER },
    details: { type: Type.STRING },
    distanceKm: { type: Type.NUMBER }
  },
  required: ["from", "fromCode", "to", "toCode", "date", "mode", "duration", "costEstimate", "stayCostEstimate", "foodCostEstimate", "totalCost", "details", "distanceKm"]
};

const itinerarySchema = {
  type: Type.OBJECT,
  properties: {
    tripType: { type: Type.STRING, enum: ["ROUND_TRIP", "ONE_WAY"] },
    originUsed: { type: Type.STRING },
    segments: { type: Type.ARRAY, items: routeSegmentSchema },
    consideredFlights: { type: Type.ARRAY, items: consideredFlightSchema, description: "Lista massiva e exaustiva de voos analisados pelo Crawler" },
    totalTransportCost: { type: Type.NUMBER },
    totalAccommodationCost: { type: Type.NUMBER },
    totalFoodCost: { type: Type.NUMBER },
    totalCostEstimate: { type: Type.NUMBER },
    totalDistanceKm: { type: Type.NUMBER },
    reasoning: { type: Type.STRING },
    objectives: {
      type: Type.OBJECT,
      properties: {
        cost: nsgaMetricSchema,
        time: nsgaMetricSchema,
        convenience: nsgaMetricSchema
      },
      required: ["cost", "time", "convenience"]
    },
    paretoFrontExplanation: { type: Type.STRING }
  },
  required: ["tripType", "originUsed", "segments", "consideredFlights", "totalTransportCost", "totalAccommodationCost", "totalFoodCost", "totalCostEstimate", "totalDistanceKm", "reasoning", "objectives", "paretoFrontExplanation"]
};

// Auxiliar para converter YYYY-MM-DD do input date para DD/MM/YY do prompt
const formatDateToBr = (isoDate?: string) => {
  if (!isoDate) return null;
  const [y, m, d] = isoDate.split('-');
  return `${d}/${m}/${y.slice(-2)}`;
};

export const solveTravelRoute = async (prefs: TravelPreferences): Promise<ItinerarySolution> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API_KEY not found");

  const ai = new GoogleGenAI({ apiKey });
  
  const mainDestDate = formatDateToBr(prefs.mainDestination.specificDate);
  
  const stopsDesc = prefs.stops.map(s => 
    `- Parada: ${s.city}. ${s.durationDays} dias. ${s.isFixedDate ? `DATA OBRIGATÓRIA: ${formatDateToBr(s.specificDate)}` : ''}`
  ).join("\n");

  const prompt = `
    Atue como um Especialista em Inteligência de Viagens e Otimização de Rotas (Solver NSGA-II).
    
    COMANDO DE CRAWLER MASSIVO E JANELA FLEXÍVEL:
    1. EXAUSTÃO DE DADOS: Para o campo "consideredFlights", gere a MAIOR QUANTIDADE POSSÍVEL de registros (busque retornar entre 60 a 80 candidatos se possível dentro do limite de tokens).
    2. JANELA DE DATAS (+/- 1 DIA): Para cada trecho (especialmente a ida e a volta principal), realize a varredura de voos para a data solicitada (${mainDestDate || "em 2026"}), para 1 dia ANTES e para 1 dia DEPOIS. 
       - Isso permite ao solver encontrar opções mais baratas ou rápidas que o usuário pode ter perdido.
    3. DIVERSIDADE DE OPERADORES: Inclua todas as alianças (Star Alliance, SkyTeam, Oneworld) e low-costs.
    4. PREÇOS REAIS: Simule a flutuação de preços entre os dias da janela flexível (ex: voar na terça pode ser mais barato que na segunda).
    
    ENTRADA:
    - Origem: ${prefs.originCity}
    - Destino Principal: ${prefs.mainDestination.city} (${prefs.mainDestination.durationDays} dias). ${mainDestDate ? `DATA ÂNCORA: ${mainDestDate}` : ''}
    - Paradas Intermediárias: ${stopsDesc || "Nenhuma."}
    - Passageiros: ${prefs.passengers}
    
    Retorne o JSON completo. A lista de "consideredFlights" deve ser o "Big Data" da sua resposta, mostrando a análise de toda a janela de 3 dias para cada trecho crítico.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: itinerarySchema,
      temperature: 0.1,
    },
  });

  const jsonStr = response.text?.trim() || "{}";
  return JSON.parse(jsonStr) as ItinerarySolution;
};
