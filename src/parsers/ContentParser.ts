import * as fs from 'fs';
import * as path from 'path';
import { Rank, Skill, ElementalSchool, Item, ItemType, ItemRarity, Quest, QuestCategory, NPC, NPCType, Biome, LootTable, LootEntry } from '../types';

export interface ParsedContent {
  ranks: RankData[];
  skills: Skill[];
  items: Item[];
  quests: Quest[];
  npcs: NPC[];
  biomes: Biome[];
  lootTables: LootTable[];
}

export interface RankData {
  rank: Rank;
  minXP: number;
  minPI: number;
  hpMultiplier: number;
  eneMultiplier: number;
  atqMultiplier: number;
  description: string;
}

export class ContentParser {
  private readonly outputPath: string;

  constructor(outputPath: string = 'data') {
    this.outputPath = outputPath;
    this.ensureDirectoryExists();
  }

  /**
   * Garante que o diretório de saída existe
   */
  private ensureDirectoryExists(): void {
    if (!fs.existsSync(this.outputPath)) {
      fs.mkdirSync(this.outputPath, { recursive: true });
    }
  }

  /**
   * Parse de dados de Ranks (baseado no Ranks_A-Z_completo.pdf)
   * NOTA: Esta é uma implementação simulada. Em produção, você usaria
   * bibliotecas como pdf-parse ou pdf2json para extrair dados reais dos PDFs
   */
  public async parseRanksFromPDF(pdfPath: string): Promise<RankData[]> {
    // Simulação de dados extraídos do PDF
    // Na implementação real, você faria parsing do PDF aqui
    const mockRankData: RankData[] = [
      {
        rank: Rank.A,
        minXP: 0,
        minPI: 10,
        hpMultiplier: 1.0,
        eneMultiplier: 1.0,
        atqMultiplier: 1.0,
        description: "Iniciante - Primeiros passos no mundo de Vantiel"
      },
      {
        rank: Rank.B,
        minXP: 100,
        minPI: 15,
        hpMultiplier: 1.1,
        eneMultiplier: 1.08,
        atqMultiplier: 1.12,
        description: "Aprendiz - Dominando os conceitos básicos"
      },
      {
        rank: Rank.C,
        minXP: 250,
        minPI: 22,
        hpMultiplier: 1.2,
        eneMultiplier: 1.16,
        atqMultiplier: 1.24,
        description: "Veterano - Combatente experiente"
      }
      // ... continuar com todos os ranks até Z
    ];

    // Salva dados extraídos
    this.saveJSONFile('ranks.json', mockRankData);
    return mockRankData;
  }

  /**
   * Parse de habilidades do codex (baseado no codex_vantiel_x50_1.pdf)
   */
  public async parseSkillsFromPDF(pdfPath: string): Promise<Skill[]> {
    // Simulação de habilidades extraídas do Codex
    const mockSkills: Skill[] = [
      {
        id: "fireball_001",
        name: "Bola de Fogo",
        description: "Lança uma bola de fogo que explode no impacto",
        school: ElementalSchool.PYRAXIS,
        tier: 1,
        requiredRank: Rank.A,
        costENE: 10,
        costFAT: 5,
        damage: 25,
        cooldown: 3,
        range: 15,
        areaOfEffect: false
      },
      {
        id: "earth_shield_001",
        name: "Escudo de Terra",
        description: "Cria uma barreira de terra que absorve dano",
        school: ElementalSchool.TERRANOR,
        tier: 1,
        requiredRank: Rank.A,
        costENE: 15,
        costFAT: 3,
        duration: 5,
        cooldown: 10,
        range: 0,
        areaOfEffect: false
      },
      {
        id: "healing_light_001",
        name: "Luz Curativa",
        description: "Restaura HP do alvo",
        school: ElementalSchool.LUMINIS,
        tier: 1,
        requiredRank: Rank.A,
        costENE: 12,
        costFAT: 2,
        healing: 30,
        cooldown: 4,
        range: 10,
        areaOfEffect: false
      },
      {
        id: "lightning_bolt_001",
        name: "Raio",
        description: "Dispara um raio de alta velocidade",
        school: ElementalSchool.AERIS,
        tier: 2,
        requiredRank: Rank.C,
        costENE: 20,
        costFAT: 8,
        damage: 45,
        cooldown: 5,
        range: 25,
        areaOfEffect: false
      },
      {
        id: "frost_armor_001",
        name: "Armadura de Gelo",
        description: "Aumenta defesa e pode congelar atacantes",
        school: ElementalSchool.AQUARIS,
        tier: 2,
        requiredRank: Rank.C,
        costENE: 18,
        costFAT: 6,
        duration: 8,
        cooldown: 15,
        range: 0,
        areaOfEffect: false
      },
      {
        id: "shadow_bolt_001",
        name: "Projétil Sombrio",
        description: "Dispara energia das sombras que ignora parte da defesa",
        school: ElementalSchool.UMBRIS,
        tier: 3,
        requiredRank: Rank.E,
        costENE: 25,
        costFAT: 10,
        damage: 60,
        cooldown: 6,
        range: 20,
        areaOfEffect: false
      }
    ];

    this.saveJSONFile('skills.json', mockSkills);
    return mockSkills;
  }

  /**
   * Parse de quests (baseado no Quests_e_Missoes_Enciclopedia.pdf)
   */
  public async parseQuestsFromPDF(pdfPath: string): Promise<Quest[]> {
    const mockQuests: Quest[] = [
      {
        id: "quest_001",
        title: "Primeiros Passos",
        description: "Fale com o Guarda da Vila para receber suas primeiras instruções",
        category: QuestCategory.MAIN,
        requiredRank: Rank.A,
        requiredLevel: 1,
        objectives: [
          {
            type: "TALK" as any,
            target: "guarda_vila_001",
            required: 1,
            current: 0
          }
        ],
        rewards: [
          {
            type: "XP" as any,
            value: 50
          },
          {
            type: "PI" as any,
            value: 5
          }
        ],
        repeatable: false
      },
      {
        id: "quest_002",
        title: "Limpando o Bosque",
        description: "Elimine 5 Lobos Selvagens que estão ameaçando a vila",
        category: QuestCategory.SIDE,
        requiredRank: Rank.A,
        requiredLevel: 2,
        objectives: [
          {
            type: "KILL" as any,
            target: "lobo_selvagem",
            required: 5,
            current: 0
          }
        ],
        rewards: [
          {
            type: "XP" as any,
            value: 100
          },
          {
            type: "GOLD" as any,
            value: 25
          }
        ],
        repeatable: true,
        cooldown: 3600 // 1 hora
      },
      {
        id: "quest_003",
        title: "O Tesouro Perdido",
        description: "Encontre o tesouro escondido na Caverna Antiga",
        category: QuestCategory.SIDE,
        requiredRank: Rank.C,
        requiredLevel: 10,
        objectives: [
          {
            type: "EXPLORE" as any,
            target: "caverna_antiga",
            required: 1,
            current: 0
          },
          {
            type: "COLLECT" as any,
            target: "tesouro_antigo",
            required: 1,
            current: 0
          }
        ],
        rewards: [
          {
            type: "XP" as any,
            value: 500
          },
          {
            type: "ITEM" as any,
            value: 1,
            itemId: "espada_antiga_001"
          }
        ],
        repeatable: false
      }
    ];

    this.saveJSONFile('quests.json', mockQuests);
    return mockQuests;
  }

  /**
   * Parse de NPCs e Bestiário (baseado no Compêndio)
   */
  public async parseNPCsFromPDF(pdfPath: string): Promise<NPC[]> {
    const mockNPCs: NPC[] = [
      {
        id: "guarda_vila_001",
        name: "Guarda da Vila",
        type: NPCType.GUARD,
        rank: Rank.A,
        level: 5,
        stats: {
          pi: 15,
          hp: 120,
          ene: 60,
          atq: 12,
          def: 8,
          mag: 4,
          res: 6,
          agi: 7,
          vel: 6,
          fat: 0
        },
        position: {
          x: 100,
          y: 50,
          z: 0,
          mapId: "vila_inicial"
        },
        dialogue: [],
        quests: ["quest_001"],
        lootTable: ["loot_guarda_basico"],
        aiBehavior: {
          aggression: 0,
          detectionRange: 5,
          attackRange: 2,
          patrolRoute: [],
          skills: [],
          fleeThreshold: 0.1
        }
      },
      {
        id: "lobo_selvagem",
        name: "Lobo Selvagem",
        type: NPCType.MONSTER,
        rank: Rank.A,
        level: 3,
        stats: {
          pi: 12,
          hp: 80,
          ene: 40,
          atq: 15,
          def: 5,
          mag: 2,
          res: 4,
          agi: 12,
          vel: 10,
          fat: 0
        },
        position: {
          x: 0,
          y: 0,
          z: 0,
          mapId: "bosque_vicinal"
        },
        dialogue: [],
        quests: [],
        lootTable: ["lobo_loot_basico"],
        aiBehavior: {
          aggression: 0.7,
          detectionRange: 8,
          attackRange: 3,
          patrolRoute: [],
          skills: ["mordida_001"],
          fleeThreshold: 0.3
        }
      },
      {
        id: "mago_anciao",
        name: "Mago Ancião",
        type: NPCType.TRAINER,
        rank: Rank.D,
        level: 20,
        stats: {
          pi: 35,
          hp: 200,
          ene: 150,
          atq: 8,
          def: 15,
          mag: 35,
          res: 25,
          agi: 10,
          vel: 8,
          fat: 0
        },
        position: {
          x: 200,
          y: 100,
          z: 0,
          mapId: "torre_magos"
        },
        dialogue: [],
        quests: ["quest_magia_001"],
        lootTable: [],
        aiBehavior: {
          aggression: 0,
          detectionRange: 10,
          attackRange: 15,
          patrolRoute: [],
          skills: ["fireball_001", "lightning_bolt_001"],
          fleeThreshold: 0.05
        }
      }
    ];

    this.saveJSONFile('npcs.json', mockNPCs);
    return mockNPCs;
  }

  /**
   * Parse de biomas e tabelas de loot (baseado no Compêndio)
   */
  public async parseBiomesFromPDF(pdfPath: string): Promise<Biome[]> {
    const mockBiomes: Biome[] = [
      {
        id: "vila_inicial",
        name: "Vila Inicial",
        description: "Uma pacata vila onde novos aventureiros começam sua jornada",
        recommendedRank: Rank.A,
        recommendedLevel: 1,
        npcs: ["guarda_vila_001", "ferreiro_001", "mercador_001"],
        resources: [],
        lootTable: ["vila_loot_basico"]
      },
      {
        id: "bosque_vicinal",
        name: "Bosque Vicinal",
        description: "Um bosque denso com criaturas selvagens e recursos naturais",
        recommendedRank: Rank.A,
        recommendedLevel: 2,
        npcs: ["lobo_selvagem", "urso_pardo", "coletor_ervas"],
        resources: [
          {
            id: "erva_basica_001",
            type: "HERB" as any,
            position: { x: 0, y: 0, z: 0, mapId: "bosque_vicinal" },
            respawnTime: 300,
            loot: []
          }
        ],
        lootTable: ["bosque_loot_basico"]
      },
      {
        id: "caverna_antiga",
        name: "Caverna Antiga",
        description: "Ruínas subterrâneas com tesouros e perigos antigos",
        recommendedRank: Rank.C,
        recommendedLevel: 10,
        npcs: ["goblin_caverna", "esqueleto_guardiao", "chefao_caverna"],
        resources: [
          {
            id: "mineral_ferro_001",
            type: "MINERAL" as any,
            position: { x: 0, y: 0, z: 0, mapId: "caverna_antiga" },
            respawnTime: 600,
            loot: []
          }
        ],
        lootTable: ["caverna_loot_avancado"]
      }
    ];

    this.saveJSONFile('biomes.json', mockBiomes);
    return mockBiomes;
  }

  /**
   * Parse de tabelas de loot
   */
  public async parseLootTablesFromPDF(pdfPath: string): Promise<LootTable[]> {
    const mockLootTables: LootTable[] = [
      {
        id: "lobo_loot_basico",
        name: "Loot Básico de Lobo",
        entries: [
          {
            itemId: "pele_lobo",
            chance: 0.6,
            minQuantity: 1,
            maxQuantity: 2
          },
          {
            itemId: "dente_lobo",
            chance: 0.3,
            minQuantity: 1,
            maxQuantity: 3
          },
          {
            itemId: "carne_crua",
            chance: 0.8,
            minQuantity: 1,
            maxQuantity: 2
          }
        ]
      },
      {
        id: "vila_loot_basico",
        name: "Loot Básico da Vila",
        entries: [
          {
            itemId: "pocao_vida_pequena",
            chance: 0.1,
            minQuantity: 1,
            maxQuantity: 1
          },
          {
            itemId: "pao",
            chance: 0.3,
            minQuantity: 2,
            maxQuantity: 5
          },
          {
            itemId: "moedas_bronze",
            chance: 0.5,
            minQuantity: 5,
            maxQuantity: 15
          }
        ]
      },
      {
        id: "caverna_loot_avancado",
        name: "Loot Avançado da Caverna",
        entries: [
          {
            itemId: "mineral_ferro",
            chance: 0.4,
            minQuantity: 1,
            maxQuantity: 3
          },
          {
            itemId: "cristal_magico",
            chance: 0.15,
            minQuantity: 1,
            maxQuantity: 1
          },
          {
            itemId: "pocao_mana_pequena",
            chance: 0.25,
            minQuantity: 1,
            maxQuantity: 2
          },
          {
            itemId: "fragmento_antigo",
            chance: 0.05,
            minQuantity: 1,
            maxQuantity: 1
          }
        ]
      }
    ];

    this.saveJSONFile('loot_tables.json', mockLootTables);
    return mockLootTables;
  }

  /**
   * Parse de itens baseado nas tabelas dos PDFs
   */
  public async parseItemsFromPDF(pdfPath: string): Promise<Item[]> {
    const mockItems: Item[] = [
      {
        id: "espada_ferro_001",
        name: "Espada de Ferro",
        description: "Uma espada básica de ferro, confiável e durável",
        type: ItemType.WEAPON,
        rarity: ItemRarity.COMMON,
        requiredRank: Rank.A,
        value: 25,
        stackable: false,
        maxStack: 1,
        stats: {
          hp: 0,
          ene: 0,
          atq: 8,
          def: 0,
          mag: 0,
          res: 0,
          agi: 2,
          vel: 0,
          pi: 0,
          fat: 0
        }
      },
      {
        id: "armadura_couro_001",
        name: "Armadura de Couro",
        description: "Armadura leve feita de couro resistente",
        type: ItemType.ARMOR,
        rarity: ItemRarity.COMMON,
        requiredRank: Rank.A,
        value: 30,
        stackable: false,
        maxStack: 1,
        stats: {
          hp: 20,
          ene: 0,
          atq: 0,
          def: 6,
          mag: 0,
          res: 2,
          agi: 3,
          vel: 0,
          pi: 0,
          fat: 0
        }
      },
      {
        id: "pocao_vida_pequena",
        name: "Poção de Vida Pequena",
        description: "Restora 50 HP instantaneamente",
        type: ItemType.CONSUMABLE,
        rarity: ItemRarity.COMMON,
        requiredRank: Rank.A,
        value: 10,
        stackable: true,
        maxStack: 20,
        stats: undefined
      },
      {
        id: "amuleto_sabedoria_001",
        name: "Amuleto de Sabedoria",
        description: "Um amuleto que aumenta o poder mágico",
        type: ItemType.ACCESSORY,
        rarity: ItemRarity.UNCOMMON,
        requiredRank: Rank.C,
        value: 150,
        stackable: false,
        maxStack: 1,
        stats: {
          hp: 0,
          ene: 15,
          atq: 0,
          def: 0,
          mag: 10,
          res: 5,
          agi: 0,
          vel: 0,
          pi: 0,
          fat: 0
        }
      },
      {
        id: "espada_antiga_001",
        name: "Espada Antiga",
        description: "Uma espada forjada em tempos antigos, ainda poderosa",
        type: ItemType.WEAPON,
        rarity: ItemRarity.RARE,
        requiredRank: Rank.C,
        value: 500,
        stackable: false,
        maxStack: 1,
        stats: {
          hp: 0,
          ene: 0,
          atq: 25,
          def: 5,
          mag: 0,
          res: 0,
          agi: 5,
          vel: 0,
          pi: 0,
          fat: 0
        }
      }
    ];

    this.saveJSONFile('items.json', mockItems);
    return mockItems;
  }

  /**
   * Processa todos os PDFs e gera arquivos JSON
   */
  public async processAllPDFs(pdfDirectory: string): Promise<ParsedContent> {
    const pdfFiles = {
      ranks: path.join(pdfDirectory, 'Ranks_A-Z_completo.pdf'),
      skills: path.join(pdfDirectory, 'codex_vantiel_x50_1.pdf'),
      quests: path.join(pdfDirectory, 'Quests_e_Missoes_Enciclopedia.pdf'),
      npcs: path.join(pdfDirectory, 'Compendio_AZ_Unico.pdf'),
      biomes: path.join(pdfDirectory, 'Compendio_AZ_Unico.pdf'),
      lootTables: path.join(pdfDirectory, 'Compendio_AZ_Unico.pdf'),
      items: path.join(pdfDirectory, 'Compendio_AZ_Unico.pdf')
    };

    const parsedContent: ParsedContent = {
      ranks: await this.parseRanksFromPDF(pdfFiles.ranks),
      skills: await this.parseSkillsFromPDF(pdfFiles.skills),
      quests: await this.parseQuestsFromPDF(pdfFiles.quests),
      npcs: await this.parseNPCsFromPDF(pdfFiles.npcs),
      biomes: await this.parseBiomesFromPDF(pdfFiles.biomes),
      lootTables: await this.parseLootTablesFromPDF(pdfFiles.lootTables),
      items: await this.parseItemsFromPDF(pdfFiles.items)
    };

    // Salva o conteúdo completo
    this.saveJSONFile('all_content.json', parsedContent);

    return parsedContent;
  }

  /**
   * Salva dados em arquivo JSON
   */
  private saveJSONFile(filename: string, data: any): void {
    const filePath = path.join(this.outputPath, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`Arquivo salvo: ${filePath}`);
  }

  /**
   * Carrega dados de um arquivo JSON
   */
  public loadJSONFile<T>(filename: string): T | null {
    const filePath = path.join(this.outputPath, filename);
    
    if (!fs.existsSync(filePath)) {
      console.warn(`Arquivo não encontrado: ${filePath}`);
      return null;
    }

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content) as T;
    } catch (error) {
      console.error(`Erro ao ler arquivo ${filename}:`, error);
      return null;
    }
  }

  /**
   * Gera relatório estatístico do conteúdo processado
   */
  public generateContentReport(content: ParsedContent): void {
    const report = {
      summary: {
        totalRanks: content.ranks.length,
        totalSkills: content.skills.length,
        totalItems: content.items.length,
        totalQuests: content.quests.length,
        totalNPCs: content.npcs.length,
        totalBiomes: content.biomes.length,
        totalLootTables: content.lootTables.length
      },
      breakdown: {
        skillsBySchool: this.groupSkillsBySchool(content.skills),
        itemsByType: this.groupItemsByType(content.items),
        questsByCategory: this.groupQuestsByCategory(content.quests),
        npcsByType: this.groupNPCsByType(content.npcs)
      }
    };

    this.saveJSONFile('content_report.json', report);
    console.log('Relatório de conteúdo gerado: content_report.json');
  }

  private groupSkillsBySchool(skills: Skill[]): Record<string, number> {
    return skills.reduce((acc, skill) => {
      acc[skill.school] = (acc[skill.school] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private groupItemsByType(items: Item[]): Record<string, number> {
    return items.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private groupQuestsByCategory(quests: Quest[]): Record<string, number> {
    return quests.reduce((acc, quest) => {
      acc[quest.category] = (acc[quest.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private groupNPCsByType(npcs: NPC[]): Record<string, number> {
    return npcs.reduce((acc, npc) => {
      acc[npc.type] = (acc[npc.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }
}
