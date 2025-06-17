import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';

export interface DeepSeekRequest {
  symptoms: string;
  petInfo: {
    species: string;
    breed?: string;
    age?: number;
    weight?: number;
    gender: string;
  };
  duration?: string;
  severity?: 'mild' | 'moderate' | 'severe';
  additionalInfo?: string;
}

export interface DeepSeekResponse {
  possibleConditions: Array<{
    name: string;
    probability: number;
    description: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
  }>;
  recommendations: string[];
  urgencyLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  confidence: number;
  disclaimer: string;
}

@Injectable()
export class DeepSeekService {
  private readonly logger = new Logger(DeepSeekService.name);
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('DEEPSEEK_API_KEY');
    this.baseUrl = this.configService.get<string>('DEEPSEEK_BASE_URL', 'https://api.deepseek.com/v1');
    
    if (!this.apiKey) {
      this.logger.warn('DeepSeek API key not configured. AI diagnosis will not be available.');
    }
  }

  async generatePreDiagnosis(request: DeepSeekRequest): Promise<DeepSeekResponse> {
    if (!this.apiKey) {
      throw new BadRequestException('Servicio de IA no disponible. Configure DEEPSEEK_API_KEY.');
    }

    try {
      this.logger.log(`Generating pre-diagnosis for ${request.petInfo.species} with symptoms: ${request.symptoms.substring(0, 100)}...`);

      const prompt = this.buildVeterinaryPrompt(request);
      
      const response: AxiosResponse = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: this.getSystemPrompt()
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.1, // Baja temperatura para respuestas más consistentes
          max_tokens: 1500,
          response_format: { type: 'json_object' }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000, // 30 segundos timeout
        }
      );

      const aiResponse = response.data.choices[0].message.content;
      const parsedResponse = JSON.parse(aiResponse);

      return this.formatResponse(parsedResponse);

    } catch (error) {
      this.logger.error(`Error generating pre-diagnosis: ${error.message}`, error.stack);
      
      if (error.response?.status === 401) {
        throw new BadRequestException('API key de DeepSeek inválida');
      } else if (error.response?.status === 429) {
        throw new BadRequestException('Límite de API alcanzado. Intente más tarde.');
      } else if (error.code === 'ECONNABORTED') {
        throw new BadRequestException('Timeout en la consulta de IA. Intente nuevamente.');
      }
      
      throw new BadRequestException('Error al generar prediagnóstico. Intente más tarde.');
    }
  }

  private getSystemPrompt(): string {
    return `Eres un asistente veterinario especializado en prediagnósticos. Tu función es analizar síntomas y proporcionar posibles condiciones y recomendaciones.

IMPORTANTE:
- Siempre incluye un disclaimer sobre consulta profesional
- Clasifica la urgencia apropiadamente
- Proporciona información educativa, no diagnósticos definitivos
- Responde SOLO en formato JSON válido
- Considera la especie, raza, edad y peso del animal

Formato de respuesta requerido:
{
  "possibleConditions": [
    {
      "name": "Nombre de la condición",
      "probability": 0.8,
      "description": "Descripción breve de la condición",
      "severity": "MEDIUM"
    }
  ],
  "recommendations": [
    "Recomendación específica 1",
    "Recomendación específica 2"
  ],
  "urgencyLevel": "MEDIUM",
  "confidence": 0.75,
  "disclaimer": "Este es un prediagnóstico automático. Consulte siempre con un veterinario profesional."
}`;
  }

  private buildVeterinaryPrompt(request: DeepSeekRequest): string {
    const { symptoms, petInfo, duration, severity, additionalInfo } = request;
    
    return `
Analiza los siguientes síntomas en una mascota y genera un prediagnóstico:

**Información de la mascota:**
- Especie: ${petInfo.species}
- Raza: ${petInfo.breed || 'No especificada'}
- Edad: ${petInfo.age ? `${petInfo.age} años` : 'No especificada'}
- Peso: ${petInfo.weight ? `${petInfo.weight} kg` : 'No especificado'}
- Género: ${petInfo.gender}

**Síntomas reportados:**
${symptoms}

**Duración de los síntomas:** ${duration || 'No especificada'}
**Severidad percibida:** ${severity || 'No especificada'}
**Información adicional:** ${additionalInfo || 'Ninguna'}

Proporciona un análisis que incluya:
1. Posibles condiciones (máximo 5, ordenadas por probabilidad)
2. Recomendaciones específicas para el cuidado inmediato
3. Nivel de urgencia para buscar atención veterinaria
4. Nivel de confianza en el análisis (0.0 a 1.0)

Considera factores específicos de la especie y raza si son relevantes.
`;
  }

  private formatResponse(aiResponse: any): DeepSeekResponse {
    // Validar y formatear la respuesta de la IA
    const formatted: DeepSeekResponse = {
      possibleConditions: aiResponse.possibleConditions?.map((condition: any) => ({
        name: condition.name || 'Condición desconocida',
        probability: Math.max(0, Math.min(1, condition.probability || 0.5)),
        description: condition.description || 'Sin descripción disponible',
        severity: ['LOW', 'MEDIUM', 'HIGH'].includes(condition.severity) 
          ? condition.severity 
          : 'MEDIUM'
      })) || [],
      recommendations: Array.isArray(aiResponse.recommendations) 
        ? aiResponse.recommendations.filter(r => typeof r === 'string') 
        : ['Consulte con un veterinario profesional'],
      urgencyLevel: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'].includes(aiResponse.urgencyLevel)
        ? aiResponse.urgencyLevel
        : 'MEDIUM',
      confidence: Math.max(0, Math.min(1, aiResponse.confidence || 0.7)),
      disclaimer: aiResponse.disclaimer || 'Este es un prediagnóstico automático. Siempre consulte con un veterinario profesional para un diagnóstico definitivo.'
    };

    // Asegurar que hay al menos una condición
    if (formatted.possibleConditions.length === 0) {
      formatted.possibleConditions.push({
        name: 'Consulta veterinaria recomendada',
        probability: 0.8,
        description: 'Los síntomas requieren evaluación profesional',
        severity: 'MEDIUM'
      });
    }

    // Asegurar que hay al menos una recomendación
    if (formatted.recommendations.length === 0) {
      formatted.recommendations.push('Consulte con un veterinario profesional para evaluación completa');
    }

    return formatted;
  }

  async healthCheck(): Promise<boolean> {
    if (!this.apiKey) {
      return false;
    }

    try {
      const response = await axios.get(`${this.baseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
        timeout: 5000,
      });

      return response.status === 200;
    } catch (error) {
      this.logger.error(`DeepSeek health check failed: ${error.message}`);
      return false;
    }
  }
} 