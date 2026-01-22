import { Player, PlayerStats } from '../types';

// Definições locais para evitar problemas de importação
export enum MonsterType {
  BEAST = 'Besta',
  UNDEAD = 'Morto-Vivo',
  DEMON = 'Demônio',
  ELEMENTAL = 'Elemental',
  CONSTRUCT = 'Construto',
  HUMANOID = 'Humanoid',
  INSECT = 'Inseto',
  REPTILE = 'Réptil',
  AQUATIC = 'Aquático',
  PLANT = 'Planta',
  ABYSSAL = 'Abissal',
  CELESTIAL = 'Celestial',
  GIANT = 'Gigante',
  UNDEFINED = 'Aberração'
}

export enum MonsterRank {
  NORMAL = 'Normal',
  ELITE = 'Elite',
  CHAMPION = 'Campeão',
  DUNGEON_BOSS = 'Chefe de Dungeon',
  WORLD_BOSS = 'Chefe Mundial',
  RAID_BOSS = 'Chefe de Raid'
}

export interface Monster {
  id: string;
  name: string;
  description: string;
  type: MonsterType;
  rank: MonsterRank;
  level: number;
  stats: PlayerStats;
  abilities: MonsterAbility[];
  lootTable: MonsterLoot;
  spawnInfo: SpawnInfo;
  isBoss: boolean;
  isWorldBoss: boolean;
  isRaidBoss: boolean;
}

export interface MonsterAbility {
  id: string;
  name: string;
  description: string;
  type: AbilityType;
  damage?: number;
  healing?: number;
  cooldown: number;
  range: number;
  castTime: number;
}

export enum AbilityType {
  DAMAGE = 'Dano',
  HEAL = 'Cura',
  BUFF = 'Buff',
  DEBUFF = 'Debuff',
  CROWD_CONTROL = 'Controle de Massa',
  SUMMON = 'Invocação',
  TRANSFORM = 'Transformação',
  ENRAGE = 'Fúria',
  TELEPORT = 'Teleporte',
  AOE = 'Área de Efeito',
  SPECIAL = 'Especial'
}

export interface MonsterLoot {
  gold: { min: number; max: number };
  experience: number;
  items: LootEntry[];
}

export interface LootEntry {
  itemId: string;
  chance: number;
  minQuantity: number;
  maxQuantity: number;
}

export interface SpawnInfo {
  type: SpawnType;
  locations: SpawnLocation[];
  respawnTime: number;
  maxInstances: number;
}

export enum SpawnType {
  FIXED = 'Fixo',
  RANDOM = 'Aleatório',
  SCHEDULED = 'Agendado',
  TRIGGERED = 'Acionado',
  EVENT = 'Evento',
  DUNGEON = 'Dungeon',
  RAID = 'Raid'
}

export interface SpawnLocation {
  regionId: string;
  position: { x: number; y: number; z: number; mapId: string };
  radius?: number;
}

export class MonsterSystem {
  private monsters: Map<string, Monster> = new Map();

  constructor() {
    this.initializeMonsters();
  }

  private initializeMonsters(): void {
    // Monstros do Vale Inicial (Nível 1-15)
    const valeInicialMonsters: Monster[] = [
      {
        id: 'lobo_jovem_001',
        name: 'Lobo Jovem',
        description: 'Um lobo jovem caçando em matilha.',
        type: MonsterType.BEAST,
        rank: MonsterRank.NORMAL,
        level: 1,
        stats: {
          pi: 8,
          hp: 80,
          ene: 30,
          atq: 8,
          def: 4,
          mag: 2,
          res: 3,
          agi: 12,
          vel: 10,
          fat: 0
        },
        abilities: [
          {
            id: 'mordida_basica',
            name: 'Mordida Básica',
            description: 'Uma mordida simples mas eficaz.',
            type: AbilityType.DAMAGE,
            damage: 8,
            cooldown: 2,
            range: 2,
            castTime: 0.5
          }
        ],
        lootTable: {
          gold: { min: 2, max: 8 },
          experience: 15,
          items: [
            {
              itemId: 'pele_lobo',
              chance: 60,
              minQuantity: 1,
              maxQuantity: 2
            },
            {
              itemId: 'dente_lobo',
              chance: 30,
              minQuantity: 1,
              maxQuantity: 3
            }
          ]
        },
        spawnInfo: {
          type: SpawnType.RANDOM,
          respawnTime: 120,
          maxInstances: 20,
          locations: [
            {
              regionId: 'floresta_sussurros',
              position: { x: 100, y: 50, z: 0, mapId: 'vale_inicial' },
              radius: 50
            }
          ]
        },
        isBoss: false,
        isWorldBoss: false,
        isRaidBoss: false
      },

      {
        id: 'goblin_ladrao_001',
        name: 'Goblin Ladrão',
        description: 'Um goblin pequeno e astuto que rouba itens dos jogadores.',
        type: MonsterType.HUMANOID,
        rank: MonsterRank.NORMAL,
        level: 4,
        stats: {
          pi: 12,
          hp: 150,
          ene: 40,
          atq: 12,
          def: 6,
          mag: 4,
          res: 5,
          agi: 8,
          vel: 7,
          fat: 0
        },
        abilities: [
          {
            id: 'ataque_adaga',
            name: 'Ataque de Adaga',
            description: 'Ataque rápido com adaga envenenada.',
            type: AbilityType.DAMAGE,
            damage: 12,
            cooldown: 1.5,
            range: 2,
            castTime: 0.3
          },
          {
            id: 'roubar_item',
            name: 'Roubar Item',
            description: 'Tenta roubar um item aleatório do inventário.',
            type: AbilityType.SPECIAL,
            cooldown: 30,
            range: 1,
            castTime: 2
          }
        ],
        lootTable: {
          gold: { min: 5, max: 15 },
          experience: 35,
          items: [
            {
              itemId: 'moeda_cobre',
              chance: 80,
              minQuantity: 3,
              maxQuantity: 8
            },
            {
              itemId: 'pocao_veneno',
              chance: 20,
              minQuantity: 1,
              maxQuantity: 2
            }
          ]
        },
        spawnInfo: {
          type: SpawnType.RANDOM,
          respawnTime: 180,
          maxInstances: 15,
          locations: [
            {
              regionId: 'fazendas_norte',
              position: { x: 200, y: 100, z: 0, mapId: 'vale_inicial' },
              radius: 40
            }
          ]
        },
        isBoss: false,
        isWorldBoss: false,
        isRaidBoss: false
      },

      {
        id: 'ogro_guardiao_001',
        name: 'Ogro Guardião',
        description: 'Um ogro massivo que guarda a entrada da caverna.',
        type: MonsterType.GIANT,
        rank: MonsterRank.ELITE,
        level: 13,
        stats: {
          pi: 35,
          hp: 1200,
          ene: 80,
          atq: 35,
          def: 20,
          mag: 5,
          res: 15,
          agi: 6,
          vel: 5,
          fat: 0
        },
        abilities: [
          {
            id: 'golpe_massivo',
            name: 'Golpe Massivo',
            description: 'Um golpe devastador com seu porrete.',
            type: AbilityType.DAMAGE,
            damage: 60,
            cooldown: 5,
            range: 4,
            castTime: 2
          },
          {
            id: 'pisote',
            name: 'Pisote',
            description: 'Pisa no chão causando dano em área.',
            type: AbilityType.AOE,
            damage: 40,
            cooldown: 12,
            range: 0,
            castTime: 1.5
          },
          {
            id: 'berserk',
            name: 'Berserk',
            description: 'Entra em fúria aumentando seu dano.',
            type: AbilityType.ENRAGE,
            cooldown: 60,
            range: 0,
            castTime: 1
          }
        ],
        lootTable: {
          gold: { min: 50, max: 150 },
          experience: 300,
          items: [
            {
              itemId: 'martelo_ogro',
              chance: 40,
              minQuantity: 1,
              maxQuantity: 1
            },
            {
              itemId: 'armadura_ogro',
              chance: 25,
              minQuantity: 1,
              maxQuantity: 1
            },
            {
              itemId: 'cristal_energia',
              chance: 15,
              minQuantity: 1,
              maxQuantity: 2
            }
          ]
        },
        spawnInfo: {
          type: SpawnType.FIXED,
          respawnTime: 1800, // 30 minutos
          maxInstances: 1,
          locations: [
            {
              regionId: 'cavernas_goblins',
              position: { x: 400, y: 300, z: 0, mapId: 'vale_inicial' }
            }
          ]
        },
        isBoss: true,
        isWorldBoss: false,
        isRaidBoss: false
      }
    ];

    // Adicionar todos os monstros ao mapa
    valeInicialMonsters.forEach(monster => {
      this.monsters.set(monster.id, monster);
    });
  }

  public getMonster(id: string): Monster | null {
    return this.monsters.get(id) || null;
  }

  public getMonstersByLevel(minLevel: number, maxLevel: number): Monster[] {
    return Array.from(this.monsters.values()).filter(monster => 
      monster.level >= minLevel && monster.level <= maxLevel
    );
  }

  public getMonstersByType(type: MonsterType): Monster[] {
    return Array.from(this.monsters.values()).filter(monster => monster.type === type);
  }

  public getMonstersByRegion(regionId: string): Monster[] {
    return Array.from(this.monsters.values()).filter(monster => 
      monster.spawnInfo.locations.some(location => location.regionId === regionId)
    );
  }

  public getBosses(): Monster[] {
    return Array.from(this.monsters.values()).filter(monster => monster.isBoss);
  }

  public getWorldBosses(): Monster[] {
    return Array.from(this.monsters.values()).filter(monster => monster.isWorldBoss);
  }

  public getElites(): Monster[] {
    return Array.from(this.monsters.values()).filter(monster => monster.rank === MonsterRank.ELITE);
  }

  public getAllMonsters(): Monster[] {
    return Array.from(this.monsters.values());
  }

  public calculateMonsterStats(baseStats: PlayerStats, level: number, rank: MonsterRank): PlayerStats {
    const multipliers = {
      [MonsterRank.NORMAL]: { hp: 1.0, atq: 1.0, def: 1.0 },
      [MonsterRank.ELITE]: { hp: 3.0, atq: 1.5, def: 1.3 },
      [MonsterRank.CHAMPION]: { hp: 8.0, atq: 2.0, def: 1.5 },
      [MonsterRank.DUNGEON_BOSS]: { hp: 25.0, atq: 3.0, def: 2.0 },
      [MonsterRank.WORLD_BOSS]: { hp: 100.0, atq: 5.0, def: 3.0 },
      [MonsterRank.RAID_BOSS]: { hp: 500.0, atq: 8.0, def: 5.0 }
    };

    const multiplier = multipliers[rank];
    const levelMultiplier = 1 + (level - 1) * 0.1;

    return {
      pi: Math.floor(baseStats.pi * levelMultiplier),
      hp: Math.floor(baseStats.hp * multiplier.hp * levelMultiplier),
      ene: Math.floor(baseStats.ene * levelMultiplier),
      atq: Math.floor(baseStats.atq * multiplier.atq * levelMultiplier),
      def: Math.floor(baseStats.def * multiplier.def * levelMultiplier),
      mag: Math.floor(baseStats.mag * levelMultiplier),
      res: Math.floor(baseStats.res * levelMultiplier),
      agi: Math.floor(baseStats.agi * levelMultiplier),
      vel: Math.floor(baseStats.vel * levelMultiplier),
      fat: 0
    };
  }

  public simulateCombat(player: Player, monster: Monster): {
    playerDamage: number;
    monsterDamage: number;
    winner: 'player' | 'monster';
    combatLog: string[];
  } {
    const combatLog: string[] = [];
    
    // Simulação simplificada de combate
    const playerDamage = Math.floor(player.stats.atq * 0.8);
    const monsterDamage = Math.floor(monster.stats.atq * 1.2);
    
    const playerTotalDamage = playerDamage * 10; // 10 ataques do jogador
    const monsterTotalDamage = monsterDamage * 8; // 8 ataques do monstro
    
    combatLog.push(`${player.name} ataca ${monster.name}!`);
    combatLog.push(`${player.name} causa ${playerDamage} de dano`);
    combatLog.push(`${monster.name} causa ${monsterDamage} de dano`);
    
    const winner = playerTotalDamage > monster.stats.hp ? 'player' : 'monster';
    
    if (winner === 'player') {
      combatLog.push(`${monster.name} foi derrotado!`);
      combatLog.push(`Ganho de ${monster.lootTable.experience} XP`);
    } else {
      combatLog.push(`${player.name} foi derrotado!`);
    }

    return {
      playerDamage: playerTotalDamage,
      monsterDamage: monsterTotalDamage,
      winner,
      combatLog
    };
  }

  public getMonsterDifficulty(monster: Monster): {
    level: string;
    threat: string;
    recommended: string;
  } {
    const { level, rank } = monster;
    
    let difficulty = 'Fácil';
    let threat = 'Baixo';
    let recommended = 'Adequado para nível 1-5';
    
    if (level >= 50) {
      difficulty = 'Muito Difícil';
      threat = 'Extremo';
      recommended = 'Requer grupo de 5+ jogadores';
    } else if (level >= 30) {
      difficulty = 'Difícil';
      threat = 'Alto';
      recommended = 'Requer grupo de 3+ jogadores';
    } else if (level >= 15) {
      difficulty = 'Médio';
      threat = 'Moderado';
      recommended = 'Requer grupo de 2+ jogadores';
    } else if (level >= 8) {
      difficulty = 'Normal';
      threat = 'Médio';
      recommended = 'Adequado para jogadores solitários';
    }
    
    if (rank === MonsterRank.ELITE || rank === MonsterRank.CHAMPION) {
      difficulty += ' (Elite)';
      threat += ' (Perigoso)';
      recommended = 'Cuidado extra recomendado';
    }
    
    if (monster.isBoss) {
      difficulty += ' (Chefe)';
      threat += ' (Mortal)';
      recommended = 'Requer preparação e estratégia';
    }
    
    return { level: difficulty, threat, recommended };
  }
}
