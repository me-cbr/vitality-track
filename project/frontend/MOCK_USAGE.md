# Script de Alternância de Mocks

## Como usar

### Ativar mocks (padrão para demo/vídeo):
```bash
node toggle-mocks.js true
```

### Desativar mocks (usar backend real):
```bash
node toggle-mocks.js false
```

### Verificar status atual:
```bash
cat src/config/mockData.js | grep "USE_MOCKS"
```

## Credenciais de Login Mock

### Treinador (Coach):
- **Email**: carlos.mendes@example.com
- **Senha**: demo1234

### Atletas:
- **Email**: joao.silva@example.com | **Senha**: demo1234
- **Email**: maria.santos@example.com | **Senha**: demo1234
- **Email**: pedro.oliveira@example.com | **Senha**: demo1234
- **Email**: ana.costa@example.com | **Senha**: demo1234

## Dados Mockados Disponíveis

- ✅ 5 atletas com métricas completas
- ✅ 10 sessões de treino (próximas e recentes)
- ✅ 5 planos de treinamento
- ✅ 5 avaliações físicas
- ✅ 5 registros ESR
- ✅ 5 feedbacks/mensagens
- ✅ 5 notificações para o treinador
- ✅ 5 mensagens inbox

## Telas com Dados Mock

### Treinador:
- Dashboard (métricas, atletas, alertas)
- Lista de atletas
- Detalhes do atleta
- Feedbacks
- Notificações

### Atleta:
- Home (ESR, próximo treino, estatísticas)
- Histórico (ESR, sessões, avaliações)
- Lista de sessões
- Detalhes da sessão
- Perfil

## Troubleshooting

### Não aparece dados no dashboard do treinador:
1. Verifique se está logado com email do treinador: `carlos.mendes@example.com`
2. Confirme que `USE_MOCKS = true` em `src/config/mockData.js`
3. Limpe o cache do Expo: `npm start -- --clear`
4. No app, pressione 'd' para abrir dev menu → Clear AsyncStorage
5. Faça logout/login novamente

### ESR não aparece:
- Os dados de ESR estão em `mockData.subjectiveScales` com `athlete_id` correspondente

### Sessões não aparecem:
- Verifique as datas em `mockData.trainingSessions` (devem ser futuras ou recentes)
