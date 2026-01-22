import { 
  Monster, 
  MonsterType, 
  MonsterRank, 
  MonsterBehavior, 
  SpawnType,
  MonsterAbility,
  AbilityType,
  StatusEffectType,
  ElementalSchool,
  PlayerStats,
  MonsterSize,
  SpawnInfo,
  SpawnLocation,
  MonsterLoot,
  LootEntry,
  MaterialEntry,
  SpecialLootEntry,
  ElementalResistances,
  ElementalVulnerabilities,
  BossMechanic,
  BossPhase,
  AbilityChange,
  VisualChange,
  BossMechanicType,
  AbilityChangeType,
  VisualChangeType,
  BossMechanicPriority,
  SpecialLootType
} from '../types/monsters';

import { Rank, Position } from '../types';
import { ItemTier, EquipmentRarity } from '../types/equipment';

// MONSTROS DO VALE INICIAL (Nível 1-15)

export const VALE_INICIAL_MONSTERS: Monster[] = [
  {
    id: 'lobo_jovem_001',
    name: 'Lobo Jovem',
    description: 'Um lobo jovem caçando em matilha.',
    type: MonsterType.BEAST,
    rank: MonsterRank.NORMAL,
    level: 1,
    requiredRank: Rank.A,
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
    behavior: MonsterBehavior.AGGRESSIVE,
    aggression: 70,
    detectionRange: 15,
    attackRange: 3,
    fleeThreshold: 0.3,
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
      },
      {
        id: 'uivar_atemorizante',
        name: 'Uivar Atemorizante',
        description: 'Uiva que reduz o ataque dos inimigos próximos.',
        type: AbilityType.DEBUFF,
        cooldown: 15,
        range: 10,
        castTime: 1,
        effects: [
          {
            id: 'medo',
            name: 'Medo',
            type: StatusEffectType.FEAR,
            duration: 5,
            value: -5,
            stackable: false,
            dispellable: true
          }
        ]
      }
    ],
    resistances: {},
    vulnerabilities: {
      [ElementalSchool.PYRAXIS]: 1.5
    },
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
      ],
      materials: [
        {
          materialId: 'couro_leve',
          chance: 50,
          minQuantity: 1,
          maxQuantity: 2,
          skillRequired: 'skinning',
          skillLevel: 1
        }
      ]
    },
    model: 'wolf_young',
    size: MonsterSize.SMALL,
    sounds: ['wolf_growl', 'wolf_howl'],
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
    requiredRank: Rank.A,
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
    behavior: MonsterBehavior.AGGRESSIVE,
    aggression: 60,
    detectionRange: 12,
    attackRange: 2,
    fleeThreshold: 0.4,
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
    abilities: [
      {
        id: 'ataque_adaga',
        name: 'Ataque de Adaga',
        description: 'Ataque rápido com adaga envenenada.',
        type: AbilityType.DAMAGE,
        damage: 12,
        cooldown: 1.5,
        range: 2,
        castTime: 0.3,
        effects: [
          {
            id: 'veneno_fraco',
            name: 'Veneno Fraco',
            type: StatusEffectType.POISON,
            duration: 8,
            value: 3,
            stackable: true,
            maxStacks: 3,
            dispellable: true
          }
        ]
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
    resistances: {},
    vulnerabilities: {
      [ElementalSchool.LUMINIS]: 1.3
    },
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
          itemId: 'poco_veneno',
          chance: 20,
          minQuantity: 1,
          maxQuantity: 2
        }
      ],
      materials: [
        {
          materialId: 'tecido_grosto',
          chance: 30,
          minQuantity: 1,
          maxQuantity: 2,
          skillRequired: 'tailoring',
          skillLevel: 5
        }
      ]
    },
    model: 'goblin_thief',
    size: MonsterSize.SMALL,
    sounds: ['goblin_laugh', 'goblin_attack'],
    isBoss: false,
    isWorldBoss: false,
    isRaidBoss: false
  },

  {
    id: 'javali_selvagem_001',
    name: 'Javali Selvagem',
    description: 'Um javali agressivo que carrega contra inimigos.',
    type: MonsterType.BEAST,
    rank: MonsterRank.NORMAL,
    level: 8,
    requiredRank: Rank.A,
    stats: {
      pi: 18,
      hp: 280,
      ene: 50,
      atq: 18,
      def: 8,
      mag: 3,
      res: 6,
      agi: 10,
      vel: 12,
      fat: 0
    },
    behavior: MonsterBehavior.AGGRESSIVE,
    aggression: 85,
    detectionRange: 20,
    attackRange: 3,
    fleeThreshold: 0.2,
    spawnInfo: {
      type: SpawnType.RANDOM,
      respawnTime: 240,
      maxInstances: 10,
      locations: [
        {
          regionId: 'floresta_sussurros',
          position: { x: 300, y: 200, z: 0, mapId: 'vale_inicial' },
          radius: 60
        }
      ]
    },
    abilities: [
      {
        id: 'carga_selvagem',
        name: 'Carga Selvagem',
        description: 'Carrega violentamente contra o alvo.',
        type: AbilityType.DAMAGE,
        damage: 25,
        cooldown: 8,
        range: 15,
        castTime: 1,
        effects: [
          {
            id: 'knockdown',
            name: 'Derrubado',
            type: StatusEffectType.STUNNED,
            duration: 2,
            value: 0,
            stackable: false,
            dispellable: true
          }
        ]
      },
      {
        id: 'bramido',
        name: 'Bramido',
        description: 'Liberta um bramido que assusta inimigos próximos.',
        type: AbilityType.CROWD_CONTROL,
        cooldown: 20,
        range: 12,
        castTime: 1.5
      }
    ],
    resistances: {},
    vulnerabilities: {
      [ElementalSchool.AQUARIS]: 1.2
    },
    lootTable: {
      gold: { min: 10, max: 25 },
      experience: 60,
      items: [
        {
          itemId: 'presa_javali',
          chance: 70,
          minQuantity: 1,
          maxQuantity: 2
        },
        {
          itemId: 'carne_crus',
          chance: 90,
          minQuantity: 2,
          maxQuantity: 4
        }
      ],
      materials: [
        {
          materialId: 'couro_medio',
          chance: 60,
          minQuantity: 1,
          maxQuantity: 3,
          skillRequired: 'skinning',
          skillLevel: 10
        }
      ]
    },
    model: 'boar_wild',
    size: MonsterSize.MEDIUM,
    sounds: ['boar_charge', 'boar_attack'],
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
    requiredRank: Rank.B,
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
    behavior: MonsterBehavior.TERRITORIAL,
    aggression: 90,
    detectionRange: 25,
    attackRange: 4,
    fleeThreshold: 0.1,
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
    abilities: [
      {
        id: 'golpe_massivo',
        name: 'Golpe Massivo',
        description: 'Um golpe devastador com seu porrete.',
        type: AbilityType.DAMAGE,
        damage: 60,
        cooldown: 5,
        range: 4,
        castTime: 2,
        effects: [
          {
            id: 'stun_heavy',
            name: 'Atordoado Pesado',
            type: StatusEffectType.STUNNED,
            duration: 3,
            value: 0,
            stackable: false,
            dispellable: true
          }
        ]
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
        castTime: 1,
        effects: [
          {
            id: 'berserk_buff',
            name: 'Berserk',
            type: StatusEffectType.BLEED,
            duration: 15,
            value: 50,
            stackable: false,
            dispellable: false
          }
        ]
      }
    ],
    resistances: {
      [ElementalSchool.PYRAXIS]: 0.7,
      [ElementalSchool.TERRANOR]: 0.8
    },
    vulnerabilities: {
      [ElementalSchool.LUMINIS]: 1.3,
      [ElementalSchool.UMBRIS]: 1.2
    },
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
      ],
      materials: [
        {
          materialId: 'mineral_ferro',
          chance: 50,
          minQuantity: 3,
          maxQuantity: 8,
          skillRequired: 'mining',
          skillLevel: 15
        }
      ],
      specialLoot: [
        {
          type: SpecialLootType.MOUNT,
          mountId: 'javali_guerra',
          chance: 5,
          description: 'Montaria Javali de Guerra rara'
        }
      ]
    },
    model: 'ogro_guardian',
    size: MonsterSize.LARGE,
    sounds: ['ogro_roar', 'ogro_attack', 'ogro_footstep'],
    isBoss: true,
    isWorldBoss: false,
    isRaidBoss: false,
    questRelated: 'ogro_guardiao'
  }
];

// MONSTROS DA FLORESTA SOMBRIA (Nível 16-30)

export const FLORESTA_SOMBRIA_MONSTERS: Monster[] = [
  {
    id: 'aranha_gigante_001',
    name: 'Aranha Gigante',
    description: 'Uma aranha monstruosa que tece teias venenosas.',
    type: MonsterType.INSECT,
    rank: MonsterRank.NORMAL,
    level: 16,
    requiredRank: Rank.C,
    stats: {
      pi: 28,
      hp: 480,
      ene: 60,
      atq: 25,
      def: 12,
      mag: 8,
      res: 10,
      agi: 15,
      vel: 8,
      fat: 0
    },
    behavior: MonsterBehavior.AMBUSH,
    aggression: 75,
    detectionRange: 18,
    attackRange: 5,
    fleeThreshold: 0.3,
    spawnInfo: {
      type: SpawnType.RANDOM,
      respawnTime: 300,
      maxInstances: 12,
      locations: [
        {
          regionId: 'floresta_sombria',
          position: { x: 100, y: 100, z: 0, mapId: 'floresta_sombria' },
          radius: 80
        }
      ]
    },
    abilities: [
      {
        id: 'teia_venenosa',
        name: 'Teia Venenosa',
        description: 'Cria uma teia que prende e envenena inimigos.',
        type: AbilityType.CROWD_CONTROL,
        cooldown: 20,
        range: 15,
        castTime: 2,
        effects: [
          {
            id: 'root_poison',
            name: 'Enraizado e Envenenado',
            type: StatusEffectType.ROOT,
            duration: 8,
            value: 0,
            stackable: false,
            dispellable: true
          },
          {
            id: 'poison_web',
            name: 'Veneno de Teia',
            type: StatusEffectType.POISON,
            duration: 12,
            value: 8,
            stackable: true,
            maxStacks: 5,
            dispellable: true
          }
        ]
      },
      {
        id: 'mordida_venenosa',
        name: 'Mordida Venenosa',
        description: 'Uma mordida que aplica veneno potente.',
        type: AbilityType.DAMAGE,
        damage: 30,
        cooldown: 3,
        range: 3,
        castTime: 1,
        effects: [
          {
            id: 'strong_poison',
            name: 'Veneno Forte',
            type: StatusEffectType.POISON,
            duration: 15,
            value: 12,
            stackable: true,
            maxStacks: 3,
            dispellable: true
          }
        ]
      }
    ],
    resistances: {
      [ElementalSchool.UMBRIS]: 0.8
    },
    vulnerabilities: {
      [ElementalSchool.PYRAXIS]: 1.3
    },
    lootTable: {
      gold: { min: 20, max: 50 },
      experience: 120,
      items: [
        {
          itemId: 'seda_aranha',
          chance: 60,
          minQuantity: 2,
          maxQuantity: 5
        },
        {
          itemId: 'veneno_aranha',
          chance: 40,
          minQuantity: 1,
          maxQuantity: 3
        }
      ],
      materials: [
        {
          materialId: 'seda_magica',
          chance: 30,
          minQuantity: 1,
          maxQuantity: 2,
          skillRequired: 'tailoring',
          skillLevel: 20
        }
      ]
    },
    model: 'spider_giant',
    size: MonsterSize.LARGE,
    sounds: ['spider_hiss', 'spider_skitter'],
    isBoss: false,
    isWorldBoss: false,
    isRaidBoss: false
  },

  {
    id: 'esqueleto_guerreiro_001',
    name: 'Esqueleto Guerreiro',
    description: 'Os restos animados de um guerreiro antigo.',
    type: MonsterType.UNDEAD,
    rank: MonsterRank.NORMAL,
    level: 20,
    requiredRank: Rank.C,
    stats: {
      pi: 32,
      hp: 650,
      ene: 50,
      atq: 28,
      def: 15,
      mag: 10,
      res: 20,
      agi: 8,
      vel: 7,
      fat: 0
    },
    behavior: MonsterBehavior.GUARDIAN,
    aggression: 80,
    detectionRange: 15,
    attackRange: 3,
    fleeThreshold: 0,
    spawnInfo: {
      type: SpawnType.RANDOM,
      respawnTime: 240,
      maxInstances: 15,
      locations: [
        {
          regionId: 'tumulos_antigos',
          position: { x: 200, y: 150, z: 0, mapId: 'floresta_sombria' },
          radius: 60
        }
      ]
    },
    abilities: [
      {
        id: 'ataque_espada',
        name: 'Ataque de Espada',
        description: 'Ataque com espada enferrujada.',
        type: AbilityType.DAMAGE,
        damage: 35,
        cooldown: 2.5,
        range: 3,
        castTime: 1
      },
      {
        id: 'ressurreicao_aliado',
        name: 'Ressurreição de Aliado',
        description: 'Ressuscita um esqueleto aliado caído.',
        type: AbilityType.SUMMON,
        cooldown: 45,
        range: 10,
        castTime: 3
      },
      {
        id: 'grito_morte',
        name: 'Grito da Morte',
        description: 'Um grito que causa medo em inimigos.',
        type: AbilityType.CROWD_CONTROL,
        cooldown: 30,
        range: 12,
        castTime: 1.5,
        effects: [
          {
            id: 'fear_undead',
            name: 'Medo Morto-Vivo',
            type: StatusEffectType.FEAR,
            duration: 6,
            value: 0,
            stackable: false,
            dispellable: true
          }
        ]
      }
    ],
    resistances: {
      [ElementalSchool.UMBRIS]: 0.5,
      [ElementalSchool.PYRAXIS]: 0.8
    },
    vulnerabilities: {
      [ElementalSchool.LUMINIS]: 2.0,
      [ElementalSchool.AQUARIS]: 1.3
    },
    lootTable: {
      gold: { min: 30, max: 80 },
      experience: 180,
      items: [
        {
          itemId: 'ossos_esqueleto',
          chance: 70,
          minQuantity: 3,
          maxQuantity: 6
        },
        {
          itemId: 'espada_enferrujada',
          chance: 25,
          minQuantity: 1,
          maxQuantity: 1
        }
      ],
      materials: [
        {
          materialId: 'fragmento_ossos',
          chance: 50,
          minQuantity: 2,
          maxQuantity: 5,
          skillRequired: 'archaeology',
          skillLevel: 25
        }
      ]
    },
    model: 'skeleton_warrior',
    size: MonsterSize.MEDIUM,
    sounds: ['skeleton_rattle', 'sword_clang'],
    isBoss: false,
    isWorldBoss: false,
    isRaidBoss: false
  },

  {
    id: 'espectro_vingativo_001',
    name: 'Espectro Vingativo',
    description: 'Um espírito torturado que busca vingança.',
    type: MonsterType.UNDEAD,
    rank: MonsterRank.NORMAL,
    level: 25,
    requiredRank: Rank.D,
    stats: {
      pi: 38,
      hp: 820,
      ene: 70,
      atq: 32,
      def: 10,
      mag: 25,
      res: 25,
      agi: 12,
      vel: 10,
      fat: 0
    },
    behavior: MonsterBehavior.AGGRESSIVE,
    aggression: 85,
    detectionRange: 20,
    attackRange: 8,
    fleeThreshold: 0,
    spawnInfo: {
      type: SpawnType.RANDOM,
      respawnTime: 360,
      maxInstances: 8,
      locations: [
        {
          regionId: 'santuario_elfico_corrompido',
          position: { x: 300, y: 200, z: 0, mapId: 'floresta_sombria' },
          radius: 50
        }
      ]
    },
    abilities: [
      {
        id: 'ataque_fantasma',
        name: 'Ataque Fantasma',
        description: 'Ataque que passa através da armadura.',
        type: AbilityType.DAMAGE,
        damage: 40,
        cooldown: 3,
        range: 5,
        castTime: 1.5
      },
      {
        id: 'intangibilidade',
        name: 'Intangibilidade',
        description: 'Fica intangível por 5 segundos, não podendo atacar nem ser atacado.',
        type: AbilityType.SPECIAL,
        cooldown: 20,
        range: 0,
        castTime: 1,
        effects: [
          {
            id: 'intangible',
            name: 'Intangível',
            type: StatusEffectType.STUNNED,
            duration: 5,
            value: 0,
            stackable: false,
            dispellable: false
          }
        ]
      },
      {
        id: 'drenar_vida',
        name: 'Drenar Vida',
        description: 'Drena vida do alvo e restaura a si mesmo.',
        type: AbilityType.DAMAGE,
        damage: 25,
        cooldown: 8,
        range: 10,
        castTime: 2,
        effects: [
          {
            id: 'life_drain',
            name: 'Dreno de Vida',
            type: StatusEffectType.BLEED,
            duration: 10,
            value: 15,
            stackable: true,
            maxStacks: 3,
            dispellable: true
          }
        ]
      }
    ],
    resistances: {
      [ElementalSchool.UMBRIS]: 0.3,
      [ElementalSchool.AERIS]: 0.7
    },
    vulnerabilities: {
      [ElementalSchool.LUMINIS]: 2.5
    },
    lootTable: {
      gold: { min: 40, max: 100 },
      experience: 250,
      items: [
        {
          itemId: 'essencia_espectral',
          chance: 50,
          minQuantity: 1,
          maxQuantity: 3
        },
        {
          itemId: 'capa_sombras',
          chance: 15,
          minQuantity: 1,
          maxQuantity: 1
        }
      ],
      materials: [
        {
          materialId: 'po_ectoplasma',
          chance: 40,
          minQuantity: 1,
          maxQuantity: 2,
          skillRequired: 'alchemy',
          skillLevel: 30
        }
      ]
    },
    model: 'spectre_revenant',
    size: MonsterSize.MEDIUM,
    sounds: ['ghost_wail', 'ethereal_whisper'],
    isBoss: false,
    isWorldBoss: false,
    isRaidBoss: false
  },

  {
    id: 'lich_menor_001',
    name: 'Lich Menor',
    description: 'Um necromante poderoso que se tornou imortal.',
    type: MonsterType.UNDEAD,
    rank: MonsterRank.ELITE,
    level: 28,
    requiredRank: Rank.D,
    stats: {
      pi: 45,
      hp: 3500,
      ene: 120,
      atq: 40,
      def: 25,
      mag: 50,
      res: 40,
      agi: 10,
      vel: 8,
      fat: 0
    },
    behavior: MonsterBehavior.GUARDIAN,
    aggression: 95,
    detectionRange: 30,
    attackRange: 15,
    fleeThreshold: 0,
    spawnInfo: {
      type: SpawnType.FIXED,
      respawnTime: 7200, // 2 horas
      maxInstances: 1,
      locations: [
        {
          regionId: 'torre_necromante',
          position: { x: 400, y: 300, z: 0, mapId: 'floresta_sombria' }
        }
      ]
    },
    abilities: [
      {
        id: 'raio_morte',
        name: 'Raio da Morte',
        description: 'Um raio de energia negra que causa dano massivo.',
        type: AbilityType.DAMAGE,
        damage: 80,
        cooldown: 8,
        range: 20,
        castTime: 3,
        school: ElementalSchool.UMBRIS
      },
      {
        id: 'invocar_exercito',
        name: 'Invocar Exército',
        description: 'Invoca múltiplos esqueletos para lutar.',
        type: AbilityType.SUMMON,
        cooldown: 45,
        range: 15,
        castTime: 5
      },
      {
        id: 'barreira_ossos',
        name: 'Barreira de Ossos',
        description: 'Cria uma barreira de ossos que bloqueia ataques.',
        type: AbilityType.BUFF,
        cooldown: 30,
        range: 0,
        castTime: 2,
        effects: [
          {
            id: 'bone_shield',
            name: 'Barreira de Ossos',
            type: StatusEffectType.HASTE,
            duration: 20,
            value: 50,
            stackable: false,
            dispellable: true
          }
        ]
      },
      {
        id: 'explosao_morte',
        name: 'Explosão da Morte',
        description: 'Causa uma explosão quando morre.',
        type: AbilityType.SPECIAL,
        cooldown: 300,
        range: 10,
        castTime: 0
      }
    ],
    resistances: {
      [ElementalSchool.UMBRIS]: 0.2,
      [ElementalSchool.PYRAXIS]: 0.7,
      [ElementalSchool.AQUARIS]: 0.8
    },
    vulnerabilities: {
      [ElementalSchool.LUMINIS]: 3.0
    },
    lootTable: {
      gold: { min: 100, max: 300 },
      experience: 800,
      items: [
        {
          itemId: 'cajado_lich',
          chance: 30,
          minQuantity: 1,
          maxQuantity: 1
        },
        {
          itemId: 'livro_necromancia',
          chance: 20,
          minQuantity: 1,
          maxQuantity: 2
        },
        {
          itemId: 'amuleto_alma',
          chance: 10,
          minQuantity: 1,
          maxQuantity: 1
        }
      ],
      materials: [
        {
          materialId: 'essencia_morte',
          chance: 60,
          minQuantity: 2,
          maxQuantity: 5,
          skillRequired: 'alchemy',
          skillLevel: 40
        }
      ],
      specialLoot: [
        {
          type: SpecialLootType.RECIPE,
          itemId: 'receita_lich_transform',
          chance: 5,
          description: 'Receita rara de transformação Lich'
        }
      ]
    },
    model: 'lich_minor',
    size: MonsterSize.LARGE,
    sounds: ['lich_laugh', 'dark_energy_crackle'],
    isBoss: true,
    isWorldBoss: false,
    isRaidBoss: false,
    questRelated: 'lich_menor'
  }
];

// Exportar todos os monstros
export const ALL_MONSTERS = [
  ...VALE_INICIAL_MONSTERS,
  ...FLORESTA_SOMBRIA_MONSTERS
];

// Funções utilitárias
export function getMonstersByLevel(minLevel: number, maxLevel: number): Monster[] {
  return ALL_MONSTERS.filter(monster => 
    monster.level >= minLevel && monster.level <= maxLevel
  );
}

export function getMonstersByType(type: MonsterType): Monster[] {
  return ALL_MONSTERS.filter(monster => monster.type === type);
}

export function getMonstersByRegion(regionId: string): Monster[] {
  return ALL_MONSTERS.filter(monster => 
    monster.spawnInfo.locations.some(location => location.regionId === regionId)
  );
}

export function getBosses(): Monster[] {
  return ALL_MONSTERS.filter(monster => monster.isBoss);
}

export function getWorldBosses(): Monster[] {
  return ALL_MONSTERS.filter(monster => monster.isWorldBoss);
}

export function getElites(): Monster[] {
  return ALL_MONSTERS.filter(monster => monster.rank === MonsterRank.ELITE);
}
