export interface PublicDemandDto {
  id: string;
  protocol: string;
  trackingTokenHash: string;
  citizenName: string;
  citizenEmail: string;
  citizenPhone: string;
  municipality: string;
  neighborhood?: string;
  category:
    | 'solicitar atendimento'
    | 'apresentar demanda'
    | 'enviar sugestão'
    | 'solicitar informação'
    | 'projeto de lei'
    | 'saúde e hospitalar'
    | 'infraestrutura e rodovias'
    | 'educação'
    | 'agricultura e silvicultura'
    | 'outro assunto';
  subject: string;
  description: string;
  attachments: string[];
  assignedTo?: string;
  priority: 'baixa' | 'média' | 'alta' | 'urgente';
  status:
    | 'recebida'
    | 'em análise'
    | 'em atendimento'
    | 'encaminhada'
    | 'aguardando retorno'
    | 'respondida'
    | 'concluída'
    | 'arquivada';
  createdAt: string;
  updatedAt: string;
  messages: DemandMessageDto[];
  history: DemandHistoryDto[];
}

export interface DemandMessageDto {
  id: string;
  demandId: string;
  senderType: 'citizen' | 'cabinet';
  senderName: string;
  text: string;
  attachments?: string[];
  createdAt: string;
}

export interface DemandHistoryDto {
  id: string;
  demandId: string;
  action: string;
  previousStatus?:
    | 'recebida'
    | 'em análise'
    | 'em atendimento'
    | 'encaminhada'
    | 'aguardando retorno'
    | 'respondida'
    | 'concluída'
    | 'arquivada';
  newStatus?:
    | 'recebida'
    | 'em análise'
    | 'em atendimento'
    | 'encaminhada'
    | 'aguardando retorno'
    | 'respondida'
    | 'concluída'
    | 'arquivada';
  actorId: string;
  actorName: string;
  actorRole: string;
  note?: string;
  createdAt: string;
}