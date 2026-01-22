# Sistema A-Z MMORPG

MMORPG baseado no universo RPG Sistema A-Z, implementado com TypeScript, Node.js e PostgreSQL.

## Visão Geral

Este projeto implementa a base técnica completa de um MMORPG seguindo estritamente as regras e mecânicas documentadas nos PDFs do Sistema A-Z:

- **Ranks_A-Z_completo.pdf**: Sistema de progressão de Ranks (A até Z)
- **Compendio_AZ_Unico.pdf**: Mecânicas core de combate e bestiário
- **codex_vantiel_x50_1.pdf**: Sistema de classes e magias
- **Quests_e_Missoes_Enciclopedia.pdf**: Sistema de quests e missões
- **Equivalencia_SS_SSS_mortal.pdf**: Escalonamento High-End Game

## Arquitetura

```
sistema-az-mmorpg/
├── src/
│   ├── engine/           # 4 sistemas core implementados
│   │   ├── CombatEngine.ts        # Sistema de combate
│   │   ├── ProgressionSystem.ts # Sistema de progressão
│   │   ├── ClassSystem.ts         # Sistema de classes
│   │   ├── EquipmentSystem.ts   # Sistema de equipamentos
│   │   ├── WorldSystem.ts         # Sistema de mundo
│   │   └── MonsterSystem.ts      # Sistema de monstros
│   ├── types/           # Tipos completos
│   │   ├── index.ts              # Tipos base
│   │   ├── classes.ts            # Classes e habilidades
│   │   ├── equipment.ts         # Equipamentos e itens
│   │   ├── monsters.ts           # Monstros e bestiário
│   │   └── world.ts              # Mundo e regiões
│   ├── database/         # Schema e configurações
│   │   └── schema.prisma      # Schema PostgreSQL
│   ├── parsers/         # Content Parser
│   │   └── ContentParser.ts   # Extração de dados dos PDFs
│   ├── utils/           # Utilitários diversos
│   ├── demo.ts           # Demonstração completa
│   └── demo-simple.ts      # Demonstração funcional
│   ├── data/            # Dados gerados
│   ├── docs/            # PDFs da documentação
│   └── tests/           # Testes automatizados
└── README.md            # Documentação atualizada
```

## Sistema de Classes (5 Classes Únicas)

### Classes Implementadas:
1. **Guerreiro** - Tank/DPS físico
   - Investida Brutal (gap closer)
   - Muralha de Aço (reduz dano em área)
   - Grito de Guerra (taunt em área)
   - Golpe Devastador (dano alto, cooldown longo)

2. **Arqueiro** - DPS ranged/Mobilidade
   - Chuva de Flechas (AoE)
   - Salto Evasivo (mobilidade)
   - Marca do Caçador (aumenta dano no alvo)
   - Tiro Perfurante (ignora parte da armadura)

3. **Mago** - DPS mágico/Controle
   - Bola de Fogo (dano em área)
   - Nevasca (slow em área + dano)
   - Relâmpago Encadeado (dano que salta entre alvos)
   - Barreira Arcana (escudo mágico)

4. **Clérigo** - Suporte/Healer
   - Luz Curativa (cura única)
   - Bênção da Luz (cura em área ao longo do tempo)
   - Punição Divina (dano + stun)
   - Ressurreição (revive aliado)

5. **Assassino** - DPS burst/Stealth
   - Golpe nas Sombras (dano crítico de stealth)
   - Evadir (fica intangível por 2s)
   - Veneno Paralisante (DoT + reduz velocidade)
   - Execução (dano massivo em alvos com HP baixo)

### Sistema de Habilidades:
- **4 habilidades ativas** por classe (total: 20 habilidades)
- **Sistema de especializações** (2 por classe)
- **Builds customizáveis** com 6 slots de habilidade
- **Sistema de talentos** com 30 pontos distribuíveis

## Sistema de Equipamentos (5 Tiers + 6 Raridades)

### Tiers de Equipamento:
- **Tier 1 (Ferro)** - Level 1-20
- **Tier 2 (Aço)** - Level 21-40
- **Tier 3 (Mithril)** - Level 41-60
- **Tier 4 (Adamantina)** - Level 61-80
- **Tier 5 (Dragônico)** - Level 81-100

### Raridades:
- **Comum → Incomum → Raro → Épico → Lendário → Mítico**
- **Stats aleatórios** em raridades Incomum+
- **Soquetes para gemas** (1-3 por item)
- **Sets de armadura** com bônus progressivos

### Sistema de 4 Slots de Armadura:
- **Capacete:** Defesa + atributo primário
- **Peitoral:** Maior defesa + HP
- **Calças:** Defesa + resistência
- **Botas:** Defesa + velocidade de movimento

## Sistema de Mundo (8 Regiões Principais)

### Regiões Implementadas:
1. **Vale Inicial** (Level 1-15) - Tutorial, cidade iniciante
2. **Floresta Sombria** (Level 16-30) - Primeira dungeon
3. **Deserto Ardente** (Level 31-45) - PvP zones
4. **Montanhas Geladas** (Level 46-60) - Fortalezas de guilda
5. **Pântano Maldito** (Level 61-75) - Bosses mundiais
6. **Ruínas Antigas** (Level 76-90) - Dungeons épicas
7. **Terras Demoníacas** (Level 91-99) - End game
8. **Cidadela Celestial** (Level 100) - Raids finais

### 5 Cidades Principais:
- **Porto Aurora:** Hub comercial, leilão
- **Fortaleza de Ferro:** Centro de guilda, forjas
- **Academia Arcana:** Treinamento de magias
- **Santuário Sagrado:** Templos, missões de clérigo
- **Covil das Sombras:** Mercado negro, missões de assassino

## Sistema de Monstros e Bestiário

### Sistema de Classificação:
- **Normal**: HP e dano padrão
- **Elite**: HP +300%, dano +50%, XP +200%
- **Campeão**: HP +800%, mecânicas especiais, XP +500%
- **Boss de Dungeon**: Mecânicas complexas
- **Boss Mundial**: Spawns fixos, loot excepcional

### Monstros Implementados:
- **Lobo Jovem** (Level 1) - HP: 80 | Dano: 5-8
- **Goblin Ladrão** (Level 4) - Rouba itens, veneno
- **Javali Selvagem** (Level 8) - Charge, HP: 280
- **Ogro Guardião** (Level 13) - HP: 1200 | Boss de caverna
- **Aranha Gigante** (Level 16) - Teia venenosa, HP: 480
- **Esqueleto Guerreiro** (Level 20) - Ressurreição
- **Espectro Vingativo** (Level 25) - Intangível 50%
- **Lich Menor** (Level 28) - Invoca adds, HP: 3500

## Sistema de Combate

### Fórmulas Oficiais:
- **Dano Base**: `$Dano = Dado + (ATQ / 5)`
- **Dados**: 1d20 (físico) e 1d12 (mágico)
- **Crítico**: 5% base + AGI/100
- **Resistências Elementares**: 6 escolas com matriz de vantagens

### Mecânicas Implementadas:
- **Sistema de críticos** com multiplicadores variáveis
- **Bloqueio e esquiva** baseados em stats
- **Resistências elementares** específicas por tipo
- **Sistema de fadiga** e regeneração
- **Efeitos de status** (veneno, queimadura, congelamento, etc.)

## Sistema de Progressão A-Z

### 26 Ranks (A-Z):
- **Requisitos duplos**: XP mínimo + PI mínimo por Rank
- **Multiplicadores**: HP, ENE, ATQ escalam por Rank
- **Sistema de PI**: Baseado em todos os stats do jogador

### Progressão:
- **Níveis 1-100**: XP exponencial com milestones
- **Tempo estimado**: 400-500 horas para nível 100
- **Sistema Ascensão**: Níveis infinitos pós-100 (+0.5% stats por nível)

## Sistema de Demonstração

### Funcionalidades Demonstradas:
- **5 classes** com habilidades únicas
- **Sistema de equipamentos** com geração procedural
- **Sistema de monstros** com dificuldade variada
- **Sistema de combate** com simulação completa
- **Sistema de progressão** com cálculo de PI
- **Sistema de mundo** com 8 regiões

### Como Executar:
```bash
# Instalar dependências
npm install

# Executar demonstração completa
npm run build && node dist/demo.js

# Ou versão simplificada (sem erres)
npx ts-node src/demo-simple.ts
```

## Como Usar o Projeto

### Setup Completo:
```bash
# 1. Instalar dependências
npm install

# 2. Configurar database
cp .env.example .env
# Editar .env com suas credenciais PostgreSQL

# 3. Gerar Prisma Client
npm run prisma:generate

# 4. Rodar migrações
npm run prisma:migrate

# 5. Iniciar servidor de desenvolvimento
npm run dev
```

### API Endpoints (Planejados):
- `GET /api/players` - Listar jogadores
```

## 🎮 API Endpoints

### Players
- `GET /api/players/:id` - Obter dados do jogador
- `POST /api/players` - Criar novo jogador
- `PUT /api/players/:id` - Atualizar jogador
- `POST /api/players/:id/levelup` - Fazer level up
- `POST /api/players/:id/rankup` - Fazer rank up

### Combat
- `POST /api/combat/simulate` - Simular combate
- `POST /api/combat/attack` - Realizar ataque
- `GET /api/combat/logs/:playerId` - Histórico de combates

### Quests
- `GET /api/quests` - Listar quests disponíveis
- `GET /api/quests/:id` - Detalhes da quest
- `POST /api/quests/:id/start` - Iniciar quest
- `POST /api/quests/:id/complete` - Completar quest

### Items
- `GET /api/items` - Listar itens
- `GET /api/items/:id` - Detalhes do item
- `POST /api/players/:playerId/inventory/add` - Adicionar item
- `PUT /api/players/:playerId/equip/:itemId` - Equipar item

## 🧪 Testes

```bash
# Rodar todos os testes
npm test

# Rodar testes com coverage
npm run test:coverage

# Rodar testes específicos
npm test -- --testNamePattern="CombatEngine"
```

## 📝 Scripts Úteis

```bash
# Desenvolvimento
npm run dev          # Servidor com hot-reload
npm run build        # Build para produção
npm start           # Servidor de produção

# Database
npm run prisma:studio    # Interface visual do DB
npm run prisma:generate  # Gerar client
npm run prisma:migrate   # Rodar migrações

# Conteúdo
npm run parse-content    # Processar PDFs
```

## 🎯 Regras de Negócio Implementadas

### Versão Mortal
- ✅ Sem quebra de realidade/cósmico
- ✅ Sistema de Fases para Chefes
- ✅ Escolas Elementares restritas
- ✅ Progressão linear A-Z
- ✅ Equivalência SS/SSS para High-End

### Balanceamento
- ✅ Fórmulas de dano padronizadas
- ✅ Sistema de resistências elementares
- ✅ Progressão baseada em mérito (XP + PI)
- ✅ Escalonamento por conteúdo (Biomas)

## 🚧 Próximos Passos

### Features Planejadas
- [ ] Sistema de Guildas
- [ ] Mercado/Auction House
- [ ] Sistema de Crafting
- [ ] Instâncias e Raids
- [ ] Sistema de Reputação
- [ ] Eventos Dinâmicos
- [ ] Sistema de Pets/Mounts

### Melhorias Técnicas
- [ ] Cache Redis
- [ ] WebSockets para tempo real
- [ ] Microserviços
- [ ] CDN para assets
- [ ] Sistema de anti-cheat

## 🤝 Contribuição

1. Fork o projeto
2. Criar branch para feature (`git checkout -b feature/NovaFeature`)
3. Commit mudanças (`git commit -m 'Add NovaFeature'`)
4. Push para branch (`git push origin feature/NovaFeature`)
5. Abrir Pull Request

## 📄 Licença

MIT License - ver arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Contato

- **Discord**: Sistema A-Z Community
- **Email**: dev@sistema-az.com
- **Documentação**: [Wiki do Projeto](https://wiki.sistema-az.com)

---

**Desenvolvido com ❤️ para a comunidade Sistema A-Z**
