import { PlayerStats, ItemRarity } from './index';
import { PlayerClass, WeaponType, ArmorType } from './classes';

export enum ItemTier {
  TIER_1 = 'Tier 1 (Ferro)',
  TIER_2 = 'Tier 2 (Aço)',
  TIER_3 = 'Tier 3 (Mithril)',
  TIER_4 = 'Tier 4 (Adamantina)',
  TIER_5 = 'Tier 5 (Dragônico)'
}

export enum EquipmentSlot {
  WEAPON = 'Arma',
  OFFHAND = 'Mão Secundária',
  HELMET = 'Capacete',
  CHEST = 'Peitoral',
  LEGS = 'Calças',
  BOOTS = 'Botas',
  RING1 = 'Anel 1',
  RING2 = 'Anel 2',
  NECKLACE = 'Colar',
  TRINKET = 'Amuleto'
}

export enum EquipmentRarity {
  COMMON = 'Comum',
  UNCOMMON = 'Incomum',
  RARE = 'Raro',
  EPIC = 'Épico',
  LEGENDARY = 'Lendário',
  MYTHIC = 'Mítico'
}

export enum EquipmentType {
  WEAPON = 'Arma',
  ARMOR = 'Armadura',
  ACCESSORY = 'Acessório'
}

export interface EquipmentStats {
  // Stats primários
  hp?: number;
  ene?: number;
  atq?: number;
  def?: number;
  mag?: number;
  res?: number;
  agi?: number;
  vel?: number;
  
  // Stats secundários
  crit?: number;
  crit_damage?: number;
  dodge?: number;
  range?: number;
  spell_damage?: number;
  healing?: number;
  attack_speed?: number;
  special?: number; // Efeitos especiais
  
  // Resistências elementais
  fire_res?: number;
  ice_res?: number;
  lightning_res?: number;
  earth_res?: number;
  light_res?: number;
  shadow_res?: number;
}

export interface Equipment {
  id: string;
  name: string;
  description: string;
  type: EquipmentType;
  rarity: EquipmentRarity;
  tier: ItemTier;
  requiredLevel: number;
  requiredClass?: PlayerClass;
  
  // Informações específicas
  weaponType?: WeaponType;
  armorType?: ArmorType;
  slot: EquipmentSlot;
  
  // Stats do equipamento
  baseStats: EquipmentStats;
  randomStats?: EquipmentStats; // Stats aleatórios em itens raros+
  
  // Propriedades especiais
  sockets?: number; // 1-3 soquetes para gemas
  setBonus?: string; // ID do set ao qual pertence
  
  // Valores
  value: number;
  sellPrice?: number;
  
  // Metadata
  lore?: string;
  pickupSound?: string;
  equipSound?: string;
}

export interface EquipmentSet {
  id: string;
  name: string;
  description: string;
  requiredClass?: PlayerClass;
  requiredLevel: number;
  pieces: EquipmentSetPiece[];
  bonuses: EquipmentSetBonus[];
}

export interface EquipmentSetPiece {
  equipmentId: string;
  slot: EquipmentSlot;
}

export interface EquipmentSetBonus {
  piecesRequired: number;
  bonus: EquipmentStats;
  description: string;
  specialAbility?: string;
}

export interface Gem {
  id: string;
  name: string;
  description: string;
  rarity: EquipmentRarity;
  stats: EquipmentStats;
  color: GemColor;
  requiredLevel: number;
}

export enum GemColor {
  RED = 'Vermelha', // Força/Ataque
  BLUE = 'Azul', // Magia/Intelecto
  GREEN = 'Verde', // Agilidade/Velocidade
  YELLOW = 'Amarela', // Defesa/Resistência
  PURPLE = 'Roxa', // Vida/Cura
  ORANGE = 'Laranja' // Híbrido
}

export interface SocketedEquipment {
  equipmentId: string;
  sockets: (Gem | null)[];
}

export interface PlayerEquipment {
  equippedItems: Record<EquipmentSlot, Equipment | null>;
  setBonuses: EquipmentSetBonus[];
  effectiveStats: EquipmentStats;
}

// Tiers de equipamento e seus multiplicadores
export const TIER_MULTIPLIERS: Record<ItemTier, {
  statMultiplier: number;
  valueMultiplier: number;
  requiredLevel: { min: number; max: number };
  material: string;
}> = {
  [ItemTier.TIER_1]: {
    statMultiplier: 1.0,
    valueMultiplier: 1.0,
    requiredLevel: { min: 1, max: 20 },
    material: 'Ferro'
  },
  [ItemTier.TIER_2]: {
    statMultiplier: 1.3,
    valueMultiplier: 2.5,
    requiredLevel: { min: 21, max: 40 },
    material: 'Aço'
  },
  [ItemTier.TIER_3]: {
    statMultiplier: 1.7,
    valueMultiplier: 6.0,
    requiredLevel: { min: 41, max: 60 },
    material: 'Mithril'
  },
  [ItemTier.TIER_4]: {
    statMultiplier: 2.2,
    valueMultiplier: 15.0,
    requiredLevel: { min: 61, max: 80 },
    material: 'Adamantina'
  },
  [ItemTier.TIER_5]: {
    statMultiplier: 3.0,
    valueMultiplier: 40.0,
    requiredLevel: { min: 81, max: 100 },
    material: 'Dragônico'
  }
};

// Raridades e suas propriedades
export const RARITY_PROPERTIES: Record<EquipmentRarity, {
  color: string;
  statBonus: number;
  randomStats: number;
  sockets: number;
  valueMultiplier: number;
  dropChance: number;
}> = {
  [EquipmentRarity.COMMON]: {
    color: '#FFFFFF', // Branco
    statBonus: 1.0,
    randomStats: 0,
    sockets: 0,
    valueMultiplier: 1.0,
    dropChance: 0.60
  },
  [EquipmentRarity.UNCOMMON]: {
    color: '#00FF00', // Verde
    statBonus: 1.2,
    randomStats: 1,
    sockets: 0,
    valueMultiplier: 2.0,
    dropChance: 0.25
  },
  [EquipmentRarity.RARE]: {
    color: '#0070DD', // Azul
    statBonus: 1.5,
    randomStats: 2,
    sockets: 1,
    valueMultiplier: 5.0,
    dropChance: 0.10
  },
  [EquipmentRarity.EPIC]: {
    color: '#A335EE', // Roxo
    statBonus: 2.0,
    randomStats: 3,
    sockets: 2,
    valueMultiplier: 12.0,
    dropChance: 0.04
  },
  [EquipmentRarity.LEGENDARY]: {
    color: '#FF8000', // Laranja
    statBonus: 2.5,
    randomStats: 4,
    sockets: 3,
    valueMultiplier: 30.0,
    dropChance: 0.008
  },
  [EquipmentRarity.MYTHIC]: {
    color: '#E6CC80', // Dourado
    statBonus: 3.0,
    randomStats: 5,
    sockets: 3,
    valueMultiplier: 100.0,
    dropChance: 0.002
  }
};

// Stats base por tipo de equipamento
export const BASE_EQUIPMENT_STATS: Record<EquipmentType, Partial<EquipmentStats>> = {
  [EquipmentType.WEAPON]: {
    atq: 10,
    crit: 2,
    attack_speed: 100
  },
  [EquipmentType.ARMOR]: {
    def: 8,
    hp: 15,
    res: 3
  },
  [EquipmentType.ACCESSORY]: {
    agi: 3,
    vel: 2,
    crit: 1
  }
};

// Stats base por slot de armadura
export const ARMOR_SLOT_STATS: Record<EquipmentSlot, Partial<EquipmentStats>> = {
  [EquipmentSlot.HELMET]: {
    def: 3,
    hp: 10,
    res: 2
  },
  [EquipmentSlot.CHEST]: {
    def: 6,
    hp: 25,
    res: 4
  },
  [EquipmentSlot.LEGS]: {
    def: 4,
    hp: 15,
    res: 3
  },
  [EquipmentSlot.BOOTS]: {
    def: 2,
    vel: 5,
    agi: 2
  },
  [EquipmentSlot.WEAPON]: {
    atq: 10,
    crit: 2,
    attack_speed: 100
  },
  [EquipmentSlot.OFFHAND]: {
    def: 2,
    res: 3,
    hp: 5
  },
  [EquipmentSlot.RING1]: {
    crit: 3,
    agi: 2,
    atq: 2
  },
  [EquipmentSlot.RING2]: {
    crit: 3,
    agi: 2,
    atq: 2
  },
  [EquipmentSlot.NECKLACE]: {
    hp: 8,
    ene: 5,
    res: 2
  },
  [EquipmentSlot.TRINKET]: {
    crit: 4,
    vel: 3,
    special: 1
  }
};

// Exemplos de equipamentos pré-definidos
export const PREDEFINED_EQUIPMENT: Equipment[] = [
  // Tier 1 - Ferro
  {
    id: 'iron_sword_001',
    name: 'Espada de Ferro',
    description: 'Uma espada básica de ferro, confiável e durável.',
    type: EquipmentType.WEAPON,
    rarity: EquipmentRarity.COMMON,
    tier: ItemTier.TIER_1,
    requiredLevel: 1,
    weaponType: WeaponType.GREATSWORD,
    slot: EquipmentSlot.WEAPON,
    baseStats: {
      atq: 12,
      crit: 2
    },
    value: 25,
    lore: 'Forjada nas fundições do Vale Inicial, esta espada serve aos aventureiros iniciantes.'
  },
  
  {
    id: 'iron_chestplate_001',
    name: 'Peitoral de Ferro',
    description: 'Peitoral de ferro que oferece proteção básica.',
    type: EquipmentType.ARMOR,
    rarity: EquipmentRarity.COMMON,
    tier: ItemTier.TIER_1,
    requiredLevel: 1,
    armorType: ArmorType.PLATE,
    slot: EquipmentSlot.CHEST,
    baseStats: {
      def: 8,
      hp: 20
    },
    value: 30,
    lore: 'Protege o torso contra ataques de criaturas comuns.'
  },

  // Tier 2 - Aço
  {
    id: 'steel_bow_001',
    name: 'Arco de Aço',
    description: 'Arco bem construído em aço, com excelente precisão.',
    type: EquipmentType.WEAPON,
    rarity: EquipmentRarity.UNCOMMON,
    tier: ItemTier.TIER_2,
    requiredLevel: 25,
    weaponType: WeaponType.BOW,
    slot: EquipmentSlot.WEAPON,
    baseStats: {
      atq: 18,
      crit: 4,
      range: 30
    },
    randomStats: {
      agi: 3
    },
    sockets: 1,
    value: 150,
    lore: 'Feito pelos melhores armeiros de Porto Aurora.'
  },

  // Tier 3 - Mithril
  {
    id: 'mithril_staff_001',
    name: 'Cajado de Mithril',
    description: 'Cajado mágico forjado em mithril puro, canaliza energia arcana com eficiência.',
    type: EquipmentType.WEAPON,
    rarity: EquipmentRarity.RARE,
    tier: ItemTier.TIER_3,
    requiredLevel: 45,
    weaponType: WeaponType.STAFF,
    slot: EquipmentSlot.WEAPON,
    baseStats: {
      mag: 25,
      ene: 30,
      spell_damage: 15
    },
    randomStats: {
      crit: 3,
      healing: 10
    },
    sockets: 2,
    value: 800,
    lore: 'Dizem que o mithril ressoa com as teias mágicas do mundo.'
  },

  // Tier 4 - Adamantina
  {
    id: 'adamantite_plate_001',
    name: 'Armadura de Adamantina',
    description: 'Conjunto completo de armadura de adamantina, quase indestrutível.',
    type: EquipmentType.ARMOR,
    rarity: EquipmentRarity.EPIC,
    tier: ItemTier.TIER_4,
    requiredLevel: 65,
    armorType: ArmorType.PLATE,
    slot: EquipmentSlot.CHEST,
    baseStats: {
      def: 35,
      hp: 80,
      res: 20
    },
    randomStats: {
      fire_res: 15,
      ice_res: 15,
      lightning_res: 15
    },
    sockets: 3,
    setBonus: 'adamantite_set',
    value: 3000,
    lore: 'Forjada com metal encontrado apenas nas profundezas das Montanhas Geladas.'
  },

  // Tier 5 - Dragônico
  {
    id: 'dragonic_sword_001',
    name: 'Lâmina Dragônica',
    description: 'Espada forjada com escamas de dragão antigo, emana poder elemental.',
    type: EquipmentType.WEAPON,
    rarity: EquipmentRarity.LEGENDARY,
    tier: ItemTier.TIER_5,
    requiredLevel: 85,
    weaponType: WeaponType.GREATSWORD,
    slot: EquipmentSlot.WEAPON,
    baseStats: {
      atq: 60,
      crit: 8,
      crit_damage: 25
    },
    randomStats: {
      fire_res: 20,
      attack_speed: 15
    },
    sockets: 3,
    setBonus: 'dragonic_set',
    value: 15000,
    lore: 'Temperada no fogo de dragões antigos, esta lâmina carrega a essência elemental.'
  }
];

// Exemplos de sets de equipamento
export const EQUIPMENT_SETS: EquipmentSet[] = [
  {
    id: 'iron_set',
    name: 'Conjunto do Guerreiro Iniciante',
    description: 'Set básico para guerreiros iniciantes.',
    requiredLevel: 1,
    pieces: [
      { equipmentId: 'iron_helmet_001', slot: EquipmentSlot.HELMET },
      { equipmentId: 'iron_chestplate_001', slot: EquipmentSlot.CHEST },
      { equipmentId: 'iron_leggings_001', slot: EquipmentSlot.LEGS },
      { equipmentId: 'iron_boots_001', slot: EquipmentSlot.BOOTS }
    ],
    bonuses: [
      {
        piecesRequired: 2,
        bonus: { def: 5, hp: 10 },
        description: '+5 Defesa, +10 HP'
      },
      {
        piecesRequired: 4,
        bonus: { atq: 3, def: 10, hp: 25 },
        description: '+3 Ataque, +10 Defesa, +25 HP',
        specialAbility: 'warrior_rage'
      }
    ]
  },

  {
    id: 'dragonic_set',
    name: 'Armadura do Caçador de Dragões',
    description: 'Set lendário forjado com escalas dragônicas.',
    requiredLevel: 80,
    pieces: [
      { equipmentId: 'dragonic_helmet_001', slot: EquipmentSlot.HELMET },
      { equipmentId: 'dragonic_chestplate_001', slot: EquipmentSlot.CHEST },
      { equipmentId: 'dragonic_leggings_001', slot: EquipmentSlot.LEGS },
      { equipmentId: 'dragonic_boots_001', slot: EquipmentSlot.BOOTS },
      { equipmentId: 'dragonic_gauntlets_001', slot: EquipmentSlot.WEAPON }
    ],
    bonuses: [
      {
        piecesRequired: 2,
        bonus: { def: 20, fire_res: 30 },
        description: '+20 Defesa, +30 Resistência ao Fogo'
      },
      {
        piecesRequired: 4,
        bonus: { atq: 15, def: 40, hp: 100 },
        description: '+15 Ataque, +40 Defesa, +100 HP',
        specialAbility: 'dragon_aura'
      },
      {
        piecesRequired: 5,
        bonus: { atq: 25, def: 60, hp: 200, crit_damage: 20 },
        description: '+25 Ataque, +60 Defesa, +200 HP, +20% Dano Crítico',
        specialAbility: 'dragon_fury'
      }
    ]
  }
];

// Exemplos de gemas
export const PREDEFINED_GEMS: Gem[] = [
  {
    id: 'ruby_001',
    name: 'Rubi Brilhante',
    description: 'Gema vermelha que aumenta o poder de ataque.',
    rarity: EquipmentRarity.UNCOMMON,
    stats: { atq: 5 },
    color: GemColor.RED,
    requiredLevel: 15
  },
  {
    id: 'sapphire_001',
    name: 'Safira Azul',
    description: 'Gema azul que amplifica o poder mágico.',
    rarity: EquipmentRarity.UNCOMMON,
    stats: { mag: 5, ene: 10 },
    color: GemColor.BLUE,
    requiredLevel: 15
  },
  {
    id: 'emerald_001',
    name: 'Esmeralda Verde',
    description: 'Gema verde que aumenta a agilidade.',
    rarity: EquipmentRarity.UNCOMMON,
    stats: { agi: 5, vel: 3 },
    color: GemColor.GREEN,
    requiredLevel: 15
  },
  {
    id: 'diamond_001',
    name: 'Diamante Flawless',
    description: 'Gema rara que aumenta todas as características.',
    rarity: EquipmentRarity.RARE,
    stats: { 
      atq: 3, 
      def: 3, 
      mag: 3, 
      agi: 3, 
      crit: 2 
    },
    color: GemColor.YELLOW,
    requiredLevel: 40
  }
];
