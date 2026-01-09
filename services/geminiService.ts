
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ItinerarySolution, TravelPreferences } from "../types";

const nsgaMetricSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    value: { type: Type.NUMBER },
    score: { type: Type.NUMBER, description: "Nota de 0 a 100 para este critério" }
  },
  required: ["name", "value", "score"]
};

const consideredFlightSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING },
    airline: { type: Type.STRING },
    flightCode: { type: Type.STRING, description: "Código do voo (ex: LA 3456, G3 1212)" },
    departureTime: { type: Type.STRING, description: "Hora de partida formato 24h (ex: 15:30)" },
    from: { type: Type.STRING },
    to: { type: Type.STRING },
    date: { type: Type.STRING },
    price: { type: Type.NUMBER },
    duration: { type: Type.STRING },
    stops: { type: Type.NUMBER },
    isSelected: { type: Type.BOOLEAN },
    reasonForChoice: { type: Type.STRING }
  },
  required: ["id", "airline", "flightCode", "departureTime", "from", "to", "date", "price", "duration", "stops", "isSelected"]
};

const routeSegmentSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    from: { type: Type.STRING },
    fromCode: { type: Type.STRING, description: "APENAS o código IATA de 3 letras (ex: GYN)" },
    to: { type: Type.STRING },
    toCode: { type: Type.STRING, description: "APENAS o código IATA de 3 letras (ex: ATL)" },
    date: { type: Type.STRING, description: "Data no formato YYYY-MM-DD da viagem/voo" },
    departureTime: { type: Type.STRING, description: "Hora de partida (ex: 21:15)" },
    flightCode: { type: Type.STRING, description: "Código do voo se aplicável" },
    mode: { type: Type.STRING, enum: ["FLIGHT", "CAR_RENTAL"] },
    duration: { type: Type.STRING },
    costEstimate: { type: Type.NUMBER, description: "Custo UNITÁRIO do transporte por pessoa para este TRECHO específico." },
    stayCostEstimate: { type: Type.NUMBER, description: "Custo TOTAL estimado de hospedagem na cidade de destino ('to') para o numero de dias e passageiros definidos." },
    foodCostEstimate: { type: Type.NUMBER, description: "Custo TOTAL estimado de alimentação na cidade de destino ('to') para todos os dias e passageiros." },
    totalCost: { type: Type.NUMBER, description: "(CostEstimate * Passageiros) + StayCostEstimate + FoodCostEstimate" },
    details: { type: Type.STRING },
    distanceKm: { type: Type.NUMBER }
  },
  required: ["from", "fromCode", "to", "toCode", "date", "mode", "duration", "costEstimate", "stayCostEstimate", "foodCostEstimate", "totalCost", "details", "distanceKm"]
};

const itinerarySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    tripType: { type: Type.STRING, enum: ["ROUND_TRIP", "ONE_WAY"] },
    originUsed: { type: Type.STRING, description: "Cidade de origem final escolhida (ex: GYN)" },
    segments: { type: Type.ARRAY, items: routeSegmentSchema },
    consideredFlights: { type: Type.ARRAY, items: consideredFlightSchema, description: "Lista de 5-10 voos que o crawler simulou ter encontrado para análise." },
    totalTransportCost: { type: Type.NUMBER, description: "Soma de todos os costEstimate * passageiros" },
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

export const solveTravelRoute = async (prefs: TravelPreferences): Promise<ItinerarySolution> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API_KEY not found in environment");

  const ai = new GoogleGenAI({ apiKey });

  const mainDest = prefs.mainDestination;
  const today = new Date().toISOString().split('T')[0];
  
  const stopsDesc = prefs.stops.map(s => 
    `- Parada: ${s.city}. Ficar ${s.durationDays} dias. ${s.isFixedDate ? `OBRIGATÓRIO EM: ${s.specificDate}` : ''}`
  ).join("\n");

  const dateInstruction = mainDest.isFixedDate && mainDest.specificDate
    ? `A CHEGADA ao Destino Principal (${mainDest.city}) DEVE ocorrer no dia ${mainDest.specificDate}. O segmento que leva a ${mainDest.city} deve ter esta data. Calcule os segmentos de retorno ou paradas subsequentes somando os dias de estadia (${mainDest.durationDays} dias).`
    : `A viagem deve começar em uma data futura (hoje é ${today}).`;

  const returnInstruction = prefs.tripType === 'ROUND_TRIP' 
    ? `A viagem é de IDA E VOLTA. O último segmento DEVE retornar para a origem (${prefs.originCity}).` 
    : "A viagem é SÓ IDA. Termine no último destino.";

  const prompt = `
    Atue como um Especialista em Logística e Algoritmos de Otimização de Rotas (TSP Solver).
    
    DATA DE HOJE: ${today}.
    
    ENTRADA:
    - Tipo: ${prefs.tripType}
    - Passageiros: ${prefs.passengers}
    - Origem: ${prefs.originCity}
    - DESTINO PRINCIPAL: ${mainDest.city} (Estadia: ${mainDest.durationDays} dias). ${dateInstruction}
    - PARADAS ADICIONAIS:
    ${stopsDesc}
    
    REGRAS CRÍTICAS DE NEGÓCIO:
    1. CRONOGRAMA LÓGICO: A data de cada segmento deve ser calculada somando os dias de estadia na cidade anterior.
    2. CÓDIGOS IATA: Extraia APENAS as 3 letras entre parênteses para 'fromCode' e 'toCode'.
    3. CRAWLER DATA: Gere uma lista de 5 a 10 voos plausíveis (Candidatos) que o sistema considerou. Para cada voo, crie um código de voo (ex: G3 1234, AD 4500, LA 3210) e um horário de partida realista (HH:MM).
    4. PREÇOS: Em Reais (R$).
    5. ${returnInstruction}

    OBJETIVO: Encontrar a fronteira de Pareto entre menor custo e menor tempo total.
    SAÍDA: JSON estrito conforme o esquema fornecido.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: itinerarySchema,
        temperature: 0.1,
      },
    });

    const text = response.text;
    if (!text) throw new Error("Falha na resposta do modelo");

    return JSON.parse(text) as ItinerarySolution;
  } catch (error) {
    console.error("Solver Error:", error);
    throw error;
  }
};
