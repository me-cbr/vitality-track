// Complete Mock Data for VitalityCheck App
// Focused on demo users: atleta@email.com and treinador@email.com
// Follows database schema exactly

// ============================================================================
// DEMO USERS - Main focus for app demonstration
// ============================================================================

export const mockCoaches = [
  {
    id: 1,
    nome: "Dr. Carlos Oliveira",
    email: "treinador@email.com",
    cref: "012345/SP",
    especialidade: "Treinamento de Força e Condicionamento",
    bio: "Especialista em treinamento de alta performance com 15 anos de experiência.",
    telefone: "(11) 98765-4321",
    atletasAssociados: [1],
  },
]

// ============================================================================
// DEMO ATHLETE - Main focus for app demonstration
// ============================================================================

export const mockAthletes = [
  {
    id: 1,
    nome: "João Silva",
    email: "atleta@email.com",
    data_nascimento: "1997-03-15",
    peso: 75,
    altura: 1.78,
    frequencia_cardiaca_repouso: 60,
    treinador_id: 1,
    created_at: "2024-12-15T10:00:00Z",
    last_login: "2025-01-21T08:30:00Z",
    status: "ativo",
    ultimaESR: 7,
    ultimaAvaliacao: "2025-01-20",
    adherence: 85,
    notes: "Atleta dedicado, bom compromisso com treinos. Responde bem a treinos de força.",
  },
]

// ============================================================================
// TRAINING PLANS (PlanoTreinamento)
// ============================================================================

export const mockTrainingPlans = [
  {
    id: 1,
    nome: "Plano de Força - Janeiro",
    descricao:
      "Desenvolvimento de força muscular com foco em membros superiores e inferiores. Ciclo de 4 semanas com progressão gradual baseado na Metodologia de Karvonen.",
    data_inicio: "2025-01-01",
    data_fim: "2025-01-31",
    atleta_id: 1,
    treinador_id: 1,
    created_at: "2024-12-15T10:30:00Z",
    updated_at: "2025-01-15T14:00:00Z",
    status: "ativo",
    objetivo: "Aumentar força muscular em 20%",
  },
  {
    id: 2,
    nome: "Condicionamento Aeróbico - Fevereiro",
    descricao:
      "Treino de condicionamento aeróbico para melhorar capacidade cardiovascular. Foco em resistência e queima de gordura com intensidade controlada por zona cardíaca.",
    data_inicio: "2025-02-01",
    data_fim: "2025-02-28",
    atleta_id: 1,
    treinador_id: 1,
    created_at: "2024-12-10T14:15:00Z",
    updated_at: "2025-01-20T09:30:00Z",
    status: "planejado",
    objetivo: "Melhorar VO2 máx em 15%",
  },
]

// ============================================================================
// TRAINING SESSIONS (SessaoTreinamento) - Atomic Training Units
// ============================================================================

export const mockTrainingSessions = [
  // Plan 1: Força - January
  {
    id: 1,
    nome: "Treino de Força - Trem Superior",
    descricao: "Supino, rosca direta, desenvolvimento de ombro. 4 séries de 8 reps.",
    zona_alvo: 4,
    tipo: "Força",
    intensidade: "Alta",
    duracao: 60,
    data: "2025-01-20T14:00:00Z",
    plano_id: 1,
    atleta_id: 1,
    treinador_id: 1,
    status: "concluido",
    notas: "Atleta completou com folga. Pode aumentar peso na próxima.",
    created_at: "2025-01-15T10:00:00Z",
  },
  {
    id: 2,
    nome: "Cardio Aeróbico",
    descricao: "Corrida ou elíptico em zona 2. Manter conversa durante treino.",
    zona_alvo: 2,
    tipo: "Cardio",
    intensidade: "Moderada",
    duracao: 45,
    data: "2025-01-22T09:00:00Z",
    plano_id: 1,
    atleta_id: 1,
    treinador_id: 1,
    status: "agendado",
    notas: "Segunda sessão do plano. Recuperação ativa.",
    created_at: "2025-01-15T10:00:00Z",
  },
  {
    id: 3,
    nome: "Trem Inferior - Força",
    descricao: "Agachamento, levantamento terra, leg press. 4 séries de 6 reps.",
    zona_alvo: 4,
    tipo: "Força",
    intensidade: "Alta",
    duracao: 75,
    data: "2025-01-23T16:00:00Z",
    plano_id: 1,
    atleta_id: 1,
    treinador_id: 1,
    status: "agendado",
    notas: "Foco em forma. Antes de aumentar carga.",
    created_at: "2025-01-15T10:00:00Z",
  },
  {
    id: 4,
    nome: "Treino Intervalado (HIIT)",
    descricao: "30s máxima intensidade, 30s recuperação. Repetir 10 rodadas.",
    zona_alvo: 5,
    tipo: "HIIT",
    intensidade: "Muito Alta",
    duracao: 30,
    data: "2025-01-24T07:00:00Z",
    plano_id: 1,
    atleta_id: 1,
    treinador_id: 1,
    status: "agendado",
    notas: "Apenas se recuperação ESR >= 6.",
    created_at: "2025-01-15T10:00:00Z",
  },
  {
    id: 5,
    nome: "Corrida Longa",
    descricao: "Corrida contínua 10km em zona 2-3. Ritmo conversacional.",
    zona_alvo: 2,
    tipo: "Cardio",
    intensidade: "Moderada",
    duracao: 60,
    data: "2025-01-25T06:30:00Z",
    plano_id: 1,
    atleta_id: 1,
    treinador_id: 1,
    status: "agendado",
    notas: "Final de semana. Foco em distância.",
    created_at: "2025-01-15T10:00:00Z",
  },
  {
    id: 6,
    nome: "Recuperação Ativa",
    descricao: "Caminhada leve 30min em zona 1. Foco em respiração.",
    zona_alvo: 1,
    tipo: "Recuperação",
    intensidade: "Leve",
    duracao: 30,
    data: "2025-01-26T07:00:00Z",
    plano_id: 1,
    atleta_id: 1,
    treinador_id: 1,
    status: "agendado",
    notas: "Domingo - recuperação.",
    created_at: "2025-01-15T10:00:00Z",
  },

  // Plan 2: Aeróbico - Fevereiro (future sessions)
  {
    id: 7,
    nome: "Circuito Aeróbico - Estação 1",
    descricao: "Jump rope, burpees, mountain climbers. 4 rodadas de 45s cada.",
    zona_alvo: 2,
    tipo: "Cardio",
    intensidade: "Moderada",
    duracao: 50,
    data: "2025-02-03T17:00:00Z",
    plano_id: 2,
    atleta_id: 1,
    treinador_id: 1,
    status: "agendado",
    notas: "Primeira sessão da semana.",
    created_at: "2024-12-10T14:30:00Z",
  },
  {
    id: 8,
    nome: "Treino em Pista",
    descricao: "800m x 4 com recuperação 400m. Zona 3-4.",
    zona_alvo: 3,
    tipo: "Intervalado",
    intensidade: "Alta",
    duracao: 45,
    data: "2025-02-05T18:30:00Z",
    plano_id: 2,
    atleta_id: 1,
    treinador_id: 1,
    status: "agendado",
    notas: "Treino de velocidade.",
    created_at: "2024-12-10T14:30:00Z",
  },
]

// ============================================================================
// PHYSICAL ASSESSMENTS (AvaliacaoFisica)
// ============================================================================

export const mockAvaliacoesFisicas = [
  {
    id: 1,
    data: "2025-01-20T10:00:00Z",
    frequencia_cardiaca: 60,
    observacoes:
      "Atleta em boa forma, pronto para aumentar carga. Respiração controlada durante avaliação. Excelente recuperação pós-esforço. Recomenda-se intensificar próximas sessões.",
    zona_treinamento: "Zona 3-4",
    atleta_id: 1,
    treinador_id: 1,
    created_at: "2025-01-20T10:15:00Z",
    zonas_karvonen: {
      zona1: { min: 114, max: 133, label: "Recuperação (50-60% FCMax)" },
      zona2: { min: 133, max: 152, label: "Aeróbica (60-70% FCMax)" },
      zona3: { min: 152, max: 171, label: "Tempo (70-80% FCMax)" },
      zona4: { min: 171, max: 190, label: "Anaeróbica (80-90% FCMax)" },
      zona5: { min: 190, max: 209, label: "VO2 Max (90-100% FCMax)" },
    },
  },
  {
    id: 2,
    data: "2025-01-15T14:30:00Z",
    frequencia_cardiaca: 62,
    observacoes:
      "Excelente recuperação desde avaliação anterior. Atleta demonstra melhor condicionamento. FC mais baixa. Pronto para ciclo de força.",
    zona_treinamento: "Zona 2-3",
    atleta_id: 1,
    treinador_id: 1,
    created_at: "2025-01-15T14:45:00Z",
    zonas_karvonen: {
      zona1: { min: 112, max: 131, label: "Recuperação (50-60% FCMax)" },
      zona2: { min: 131, max: 150, label: "Aeróbica (60-70% FCMax)" },
      zona3: { min: 150, max: 169, label: "Tempo (70-80% FCMax)" },
      zona4: { min: 169, max: 188, label: "Anaeróbica (80-90% FCMax)" },
      zona5: { min: 188, max: 207, label: "VO2 Max (90-100% FCMax)" },
    },
  },
  {
    id: 3,
    data: "2025-01-08T09:15:00Z",
    frequencia_cardiaca: 65,
    observacoes:
      "Primeira avaliação. Atleta com boa disposição e motivação. Recomenda-se período de adaptação de 2-3 semanas. Começar com intensidade leve.",
    zona_treinamento: "Zona 2-3",
    atleta_id: 1,
    treinador_id: 1,
    created_at: "2025-01-08T09:30:00Z",
    zonas_karvonen: {
      zona1: { min: 117, max: 136, label: "Recuperação (50-60% FCMax)" },
      zona2: { min: 136, max: 155, label: "Aeróbica (60-70% FCMax)" },
      zona3: { min: 155, max: 174, label: "Tempo (70-80% FCMax)" },
      zona4: { min: 174, max: 193, label: "Anaeróbica (80-90% FCMax)" },
      zona5: { min: 193, max: 212, label: "VO2 Max (90-100% FCMax)" },
    },
  },
]

// ============================================================================
// SUBJECTIVE RECOVERY SCALE (EscalaSubjetiva) - Daily ESR Data
// ============================================================================

export const mockESRRecords = [
  {
    id: 1,
    tipo: "Recuperacao",
    valor: 7,
    data: "2025-01-21T07:30:00Z",
    atleta_id: 1,
    created_at: "2025-01-21T07:35:00Z",
  },
  {
    id: 2,
    tipo: "Recuperacao",
    valor: 8,
    data: "2025-01-20T08:00:00Z",
    atleta_id: 1,
    created_at: "2025-01-20T08:05:00Z",
  },
  {
    id: 3,
    tipo: "Recuperacao",
    valor: 4,
    data: "2025-01-19T07:15:00Z",
    atleta_id: 1,
    created_at: "2025-01-19T07:20:00Z",
  },
  {
    id: 4,
    tipo: "Recuperacao",
    valor: 9,
    data: "2025-01-18T08:30:00Z",
    atleta_id: 1,
    created_at: "2025-01-18T08:35:00Z",
  },
  {
    id: 5,
    tipo: "Recuperacao",
    valor: 6,
    data: "2025-01-17T07:45:00Z",
    atleta_id: 1,
    created_at: "2025-01-17T07:50:00Z",
  },
  {
    id: 6,
    tipo: "Recuperacao",
    valor: 8,
    data: "2025-01-16T08:00:00Z",
    atleta_id: 1,
    created_at: "2025-01-16T08:05:00Z",
  },
  {
    id: 7,
    tipo: "Recuperacao",
    valor: 10,
    data: "2025-01-15T07:30:00Z",
    atleta_id: 1,
    created_at: "2025-01-15T07:35:00Z",
  },
  {
    id: 8,
    tipo: "Recuperacao",
    valor: 7,
    data: "2025-01-14T08:15:00Z",
    atleta_id: 1,
    created_at: "2025-01-14T08:20:00Z",
  },
  {
    id: 9,
    tipo: "Recuperacao",
    valor: 5,
    data: "2025-01-13T07:00:00Z",
    atleta_id: 1,
    created_at: "2025-01-13T07:05:00Z",
  },
]

// ============================================================================
// FEEDBACK MESSAGES (Feedback)
// ============================================================================

export const mockFeedbacks = [
  {
    id: 1,
    mensagem: "Ótimo desempenho na sessão de força hoje! Sua técnica melhorou muito. Continue com essa intensidade!",
    data: "2025-01-21T15:30:00Z",
    atleta_id: 1,
    treinador_id: 1,
    lido: false,
    created_at: "2025-01-21T15:35:00Z",
    tipo_mensagem: "elogio",
  },
  {
    id: 2,
    mensagem: "Sua recuperação está excelente nos últimos dias (ESR 7-8). Vamos aumentar a carga na próxima semana.",
    data: "2025-01-20T09:00:00Z",
    atleta_id: 1,
    treinador_id: 1,
    lido: true,
    created_at: "2025-01-20T09:05:00Z",
    tipo_mensagem: "planejamento",
  },
  {
    id: 3,
    mensagem:
      "Foque em manter a respiração controlada durante os exercícios compostos. Você estava prendendo a respiração.",
    data: "2025-01-19T14:20:00Z",
    atleta_id: 1,
    treinador_id: 1,
    lido: true,
    created_at: "2025-01-19T14:25:00Z",
    tipo_mensagem: "orientacao",
  },
  {
    id: 4,
    mensagem: "Não faça a sessão de HIIT amanhã - sua ESR está em 4. Descanse mais.",
    data: "2025-01-18T18:00:00Z",
    atleta_id: 1,
    treinador_id: 1,
    lido: true,
    created_at: "2025-01-18T18:05:00Z",
    tipo_mensagem: "alerta",
  },
  {
    id: 5,
    mensagem: "Grande semana de treinos! Você completou 5/5 sessões programadas. Parabéns pela consistência!",
    data: "2025-01-17T19:00:00Z",
    atleta_id: 1,
    treinador_id: 1,
    lido: true,
    created_at: "2025-01-17T19:05:00Z",
    tipo_mensagem: "elogio",
  },
]

// ============================================================================
// ATHLETE STATISTICS & DASHBOARD DATA
// ============================================================================

export const mockAthleteStats = {
  1: {
    name: "João Silva",
    weeklySessionsCompleted: 3,
    weeklySessionsTotal: 5,
    weeklyCompletionPercentage: 60,
    totalLoad: 245,
    streak: 7,
    totalMinutes: 285,
    averageESR: 6.8,
    lastESR: 7,
    lastAssessment: "2025-01-20",
    nextSession: {
      date: "2025-01-22",
      time: "09:00",
      name: "Cardio Aeróbico",
      duration: 45,
    },
    weekProgress: [
      { day: "Seg", completed: 0, scheduled: 1 },
      { day: "Ter", completed: 1, scheduled: 1 },
      { day: "Qua", completed: 1, scheduled: 1 },
      { day: "Qui", completed: 1, scheduled: 1 },
      { day: "Sex", completed: 0, scheduled: 1 },
      { day: "Sab", completed: 0, scheduled: 0 },
      { day: "Dom", completed: 0, scheduled: 0 },
    ],
  },
}

// ============================================================================
// MOCK USERS (for authentication/login)
// ============================================================================

export const mockUsers = [
  {
    id: 1,
    nome: "João Silva",
    email: "atleta@email.com",
    senha_hash: "hashed_password_123",
    tipo_usuario: "atleta",
    atleta_id: 1,
    created_at: "2024-12-15T10:00:00Z",
  },
  {
    id: 2,
    nome: "Dr. Carlos Oliveira",
    email: "treinador@email.com",
    senha_hash: "hashed_password_456",
    tipo_usuario: "treinador",
    treinador_id: 1,
    created_at: "2024-11-01T14:00:00Z",
  },
]

// ============================================================================
// EXPORTS - All mock data for app usage
// ============================================================================

export default {
  mockCoaches,
  mockAthletes,
  mockTrainingPlans,
  mockTrainingSessions,
  mockAvaliacoesFisicas,
  mockESRRecords,
  mockFeedbacks,
  mockAthleteStats,
  mockUsers,
}
