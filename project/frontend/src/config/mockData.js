// Mock data used for demo/video recordings.
// Set `USE_MOCKS = true` to force services to return these values.
export const USE_MOCKS = true

export const mockData = {
  users: [
    { id: 1, username: "joaosilva", first_name: "João", last_name: "Silva", email: "joao.silva@example.com", password: "demo1234", type: "athlete" },
    { id: 2, username: "maria.santos", first_name: "Maria", last_name: "Santos", email: "maria.santos@example.com", password: "demo1234", type: "athlete" },
    { id: 3, username: "pedro.oliveira", first_name: "Pedro", last_name: "Oliveira", email: "pedro.oliveira@example.com", password: "demo1234", type: "athlete" },
    { id: 4, username: "ana.costa", first_name: "Ana", last_name: "Costa", email: "ana.costa@example.com", password: "demo1234", type: "athlete" },
    { id: 5, username: "treinador1", first_name: "Carlos", last_name: "Mendes", email: "carlos.mendes@example.com", password: "demo1234", type: "coach" },
  ],

  athletes: [
    { id: 101, user: { id: 1, first_name: "João", last_name: "Silva", email: "joao.silva@example.com" }, birth_date: "1992-04-12", weight: 74, height: 1.78, resting_heart_rate: 58, ultimaESR: 7, status: "ativo", adherence: 85 },
    { id: 102, user: { id: 2, first_name: "Maria", last_name: "Santos", email: "maria.santos@example.com" }, birth_date: "1995-09-30", weight: 62, height: 1.65, resting_heart_rate: 64, ultimaESR: 5, status: "ativo", adherence: 72 },
    { id: 103, user: { id: 3, first_name: "Pedro", last_name: "Oliveira", email: "pedro.oliveira@example.com" }, birth_date: "1988-01-20", weight: 81, height: 1.82, resting_heart_rate: 60, ultimaESR: 8, status: "ativo", adherence: 90 },
    { id: 104, user: { id: 4, first_name: "Ana", last_name: "Costa", email: "ana.costa@example.com" }, birth_date: "2000-07-05", weight: 58, height: 1.6, resting_heart_rate: 66, ultimaESR: 3, status: "ativo", adherence: 65 },
    { id: 105, user: { id: 6, first_name: "Lucas", last_name: "Almeida", email: "lucas.almeida@example.com" }, birth_date: "1990-11-11", weight: 69, height: 1.75, resting_heart_rate: 61, ultimaESR: 6, status: "ativo", adherence: 78 },
  ],

  coaches: [
    {
      id: 201,
      user: { id: 5, first_name: "Carlos", last_name: "Mendes", email: "carlos.mendes@example.com" },
      cref: "012345-G/SP",
      specialty: "Treinamento Funcional",
      team_size: 5,
      team_athletes: [101, 102, 103, 104, 105],
      dashboard: {
        total_athletes: 5,
        total_plans: 5,
        upcoming_sessions: [401, 402, 403],
        alerts: 2,
      },
    },
  ],

  notifications: [
    { id: 901, coach_id: 201, type: "alert", title: "Atleta com ESR baixo", body: "João Silva registrou ESR 3", created_at: "2025-12-02T08:00:00" },
    { id: 902, coach_id: 201, type: "info", title: "Novo plano criado", body: "Plano Força - Novembro para João Silva", created_at: "2025-11-30T09:10:00" },
    { id: 903, coach_id: 201, type: "reminder", title: "Revisar treino", body: "Reveja o plano de Maria Santos", created_at: "2025-12-01T10:00:00" },
    { id: 904, coach_id: 201, type: "info", title: "Mensagem recebida", body: "Pedro Oliveira enviou uma dúvida", created_at: "2025-12-01T11:00:00" },
    { id: 905, coach_id: 201, type: "alert", title: "Sessão próxima", body: "Sessão de João Silva em 2 horas", created_at: "2025-12-02T08:30:00" },
  ],

  trainingPlans: [
    { id: 301, name: "Plano Força - Novembro", athlete_id: 101, coach_id: 201, objective: "Aumentar força máxima", start_date: "2025-11-01", end_date: "2025-12-01" },
    { id: 302, name: "Condicionamento Aeróbico", athlete_id: 102, coach_id: 201, objective: "Melhorar resistência", start_date: "2025-10-01", end_date: "2025-12-31" },
    { id: 303, name: "Treino HIIT", athlete_id: 103, coach_id: 201, objective: "Perda de gordura", start_date: "2025-09-15", end_date: "2025-10-15" },
    { id: 304, name: "Força Trem Inferior", athlete_id: 104, coach_id: 201, objective: "Hipertrofia pernas", start_date: "2025-11-05", end_date: "2025-12-05" },
    { id: 305, name: "Recuperação Ativa", athlete_id: 105, coach_id: 201, objective: "Recuperação pós-competição", start_date: "2025-12-01", end_date: "2026-01-01" },
  ],

  trainingSessions: [
    { id: 401, training_plan: 301, athlete_id: 101, target_zone: "Zona 4 - Anaeróbica", training_type: "Força", intensity: "Alta", duration: 60, date: "2025-12-11T10:00:00", exercises: [{ nome: "Agachamento", duracao: 20 }, { nome: "Leg Press", duracao: 20 }] },
    { id: 402, training_plan: 302, athlete_id: 102, target_zone: "Zona 2 - Aeróbica", training_type: "Cardio", intensity: "Moderada", duration: 45, date: "2025-12-12T07:00:00", exercises: [{ nome: "Corrida", duracao: 45 }] },
    { id: 403, training_plan: 303, athlete_id: 103, target_zone: "Zona 5 - Máxima", training_type: "HIIT", intensity: "Muito Alta", duration: 30, date: "2025-12-13T18:30:00", exercises: [{ nome: "Sprints", duracao: 15 }] },
    { id: 404, training_plan: 304, athlete_id: 104, target_zone: "Zona 3 - Moderada", training_type: "Força", intensity: "Alta", duration: 50, date: "2025-12-14T16:00:00", exercises: [{ nome: "Peso Morto", duracao: 25 }] },
    { id: 405, training_plan: 305, athlete_id: 105, target_zone: "Zona 1 - Recuperação", training_type: "Recuperação", intensity: "Leve", duration: 30, date: "2025-12-15T09:00:00", exercises: [{ nome: "Caminhada", duracao: 30 }] },
    { id: 406, training_plan: 301, athlete_id: 101, target_zone: "Zona 3 - Moderada", training_type: "Força", intensity: "Moderada", duration: 55, date: "2025-12-10T14:00:00", exercises: [{ nome: "Supino", duracao: 25 }] },
    { id: 407, training_plan: 302, athlete_id: 102, target_zone: "Zona 2 - Aeróbica", training_type: "Cardio", intensity: "Moderada", duration: 40, date: "2025-12-11T07:30:00", exercises: [{ nome: "Bicicleta", duracao: 40 }] },
    { id: 408, training_plan: 303, athlete_id: 103, target_zone: "Zona 4 - Anaeróbica", training_type: "HIIT", intensity: "Alta", duration: 35, date: "2025-12-12T19:00:00", exercises: [{ nome: "Burpees", duracao: 20 }] },
    { id: 409, training_plan: 304, athlete_id: 104, target_zone: "Zona 3 - Moderada", training_type: "Força", intensity: "Alta", duration: 45, date: "2025-12-13T15:00:00", exercises: [{ nome: "Agachamento Frontal", duracao: 20 }] },
    { id: 410, training_plan: 305, athlete_id: 105, target_zone: "Zona 2 - Aeróbica", training_type: "Recuperação", intensity: "Leve", duration: 25, date: "2025-12-14T10:00:00", exercises: [{ nome: "Alongamento", duracao: 25 }] },
  ],

  assessments: [
    { id: 501, athlete_id: 101, data: "2025-11-20", frequencia_cardiaca: 60, zona_treinamento: "Zona 3", observacoes: "Bom condicionamento" },
    { id: 502, athlete_id: 102, data: "2025-11-22", frequencia_cardiaca: 66, zona_treinamento: "Zona 2", observacoes: "Atenção ao aquecimento" },
    { id: 503, athlete_id: 103, data: "2025-11-18", frequencia_cardiaca: 58, zona_treinamento: "Zona 4", observacoes: "Capacidade de sprint boa" },
    { id: 504, athlete_id: 104, data: "2025-11-25", frequencia_cardiaca: 64, zona_treinamento: "Zona 3", observacoes: "Força em crescimento" },
    { id: 505, athlete_id: 105, data: "2025-11-30", frequencia_cardiaca: 62, zona_treinamento: "Zona 1", observacoes: "Recuperação adequada" },
  ],

  subjectiveScales: [
    { id: 601, athlete_id: 101, value: 7, observacoes: "Sentiu-se bem após treino", created_at: "2025-12-01T08:00:00" },
    { id: 602, athlete_id: 102, value: 5, observacoes: "Sono reduzido", created_at: "2025-12-02T09:00:00" },
    { id: 603, athlete_id: 103, value: 8, observacoes: "Boa recuperação", created_at: "2025-12-03T07:30:00" },
    { id: 604, athlete_id: 104, value: 4, observacoes: "Leve fadiga", created_at: "2025-12-04T10:15:00" },
    { id: 605, athlete_id: 105, value: 6, observacoes: "Recuperando bem", created_at: "2025-12-05T11:20:00" },
  ],

  feedbacks: [
    { id: 701, athlete_id: 101, coach_id: 201, tipo_mensagem: "elogio", mensagem: "Excelente evolução na força", created_at: "2025-12-01T12:00:00" },
    { id: 702, athlete_id: 102, coach_id: 201, tipo_mensagem: "orientacao", mensagem: "Aumentar ingestão de carboidratos antes do treino", created_at: "2025-12-02T12:15:00" },
    { id: 703, athlete_id: 103, coach_id: 201, tipo_mensagem: "alerta", mensagem: "Cuidado com sobrecarga", created_at: "2025-12-03T12:30:00" },
    { id: 704, athlete_id: 104, coach_id: 201, tipo_mensagem: "elogio", mensagem: "Boa técnica nos levantamento", created_at: "2025-12-04T12:45:00" },
    { id: 705, athlete_id: 105, coach_id: 201, tipo_mensagem: "orientacao", mensagem: "Controle o volume semanal", created_at: "2025-12-05T13:00:00" },
  ],

  messages: [
    { id: 801, from_user: 5, to_user: 1, subject: "Bem-vindo ao time", body: "Bem-vindo! Vamos começar com uma avaliação.", created_at: "2025-11-30T09:00:00" },
    { id: 802, from_user: 5, to_user: 2, subject: "Plano atualizado", body: "Atualizei seu plano de treino.", created_at: "2025-11-30T09:05:00" },
    { id: 803, from_user: 1, to_user: 5, subject: "Dúvida treino", body: "Posso subir a carga?", created_at: "2025-12-01T10:00:00" },
    { id: 804, from_user: 3, to_user: 5, subject: "Recuperação", body: "Senti dor no joelho após corrida.", created_at: "2025-12-02T11:00:00" },
    { id: 805, from_user: 2, to_user: 5, subject: "Feriado treino", body: "Treinar no feriado?", created_at: "2025-12-03T14:00:00" },
  ],
}

export default mockData
