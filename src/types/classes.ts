import { ElementalSchool, Skill, PlayerStats } from './index';

export enum PlayerClass {
  WARRIOR = 'Guerreiro',
  ARCHER = 'Arqueiro',
  MAGE = 'Mago',
  CLERIC = 'Clérigo',
  ASSASSIN = 'Assassino'
}

export enum WeaponType {
  // Guerreiro
  GREATSWORD = 'Espada Grande',
  BATTLEAXE = 'Machado de Batalha',
  WARHAMMER = 'Martelo de Guerra',
  
  // Arqueiro
  BOW = 'Arco',
  CROSSBOW = 'Besta',
  DAGGER = 'Adaga',
  
  // Mago
  STAFF = 'Cajado',
  ORB = 'Orbe',
  WAND = 'Varinha',
  
  // Clérigo
  MACE = 'Maça',
  SHIELD = 'Escudo',
  HOLY_SYMBOL = 'Símbolo Sagrado',
  
  // Assassino
  DUAL_DAGGERS = 'Adagas Duplas',
  CLAWS = 'Garras',
  SHURIKENS = 'Shurikens'
}

export enum ArmorType {
  PLATE = 'Placa Pesada',
  LEATHER_MEDIUM = 'Couro Médio',
  CLOTH = 'Tecido Leve',
  CHAIN_MAIL = 'Malha Média-Pesada',
  LEATHER_LIGHT = 'Couro Leve'
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

export enum ItemTier {
  TIER_1 = 'Tier 1 (Ferro)',
  TIER_2 = 'Tier 2 (Aço)',
  TIER_3 = 'Tier 3 (Mithril)',
  TIER_4 = 'Tier 4 (Adamantina)',
  TIER_5 = 'Tier 5 (Dragônico)'
}

export interface ClassStats {
  primaryAttribute: keyof PlayerStats;
  secondaryAttributes: (keyof PlayerStats)[];
  weaponTypes: WeaponType[];
  armorType: ArmorType;
  baseStats: Partial<PlayerStats>;
}

export interface ClassSkill {
  id: string;
  name: string;
  description: string;
  class: PlayerClass;
  requiredLevel: number;
  skillType: SkillType;
  damage?: number;
  healing?: number;
  duration?: number;
  cooldown: number;
  range: number;
  costENE: number;
  costFAT: number;
  castTime?: number;
  areaOfEffect?: boolean;
  school?: ElementalSchool;
}

export enum SkillType {
  DAMAGE = 'Dano',
  HEAL = 'Cura',
  BUFF = 'Buff',
  DEBUFF = 'Debuff',
  CROWD_CONTROL = 'Controle de Massa',
  MOBILITY = 'Mobilidade',
  TANK = 'Tanque',
  STEALTH = 'Furtividade'
}

export interface Talent {
  id: string;
  name: string;
  description: string;
  class: PlayerClass;
  tier: number; // 1-3
  maxPoints: number;
  currentPoints: number;
  effect: TalentEffect;
}

export interface TalentEffect {
  type: TalentEffectType;
  value: number;
  target?: string; // ID da habilidade afetada
}

export enum TalentEffectType {
  INCREASE_DAMAGE = 'Aumentar Dano',
  REDUCE_COOLDOWN = 'Reduzir Cooldown',
  INCREASE_HEALING = 'Aumentar Cura',
  INCREASE_CRIT_CHANCE = 'Aumentar Chance Crítico',
  REDUCE_COST = 'Reduzir Custo',
  ADD_EFFECT = 'Adicionar Efeito',
  MODIFY_RANGE = 'Modificar Alcance'
}

export interface PlayerBuild {
  class: PlayerClass;
  equippedSkills: string[]; // 6 habilidades equipadas
  talents: Talent[];
  specialization?: Specialization; // Opcional
}

export interface Specialization {
  id: string;
  name: string;
  class: PlayerClass;
  description: string;
  bonuses: SpecializationBonus[];
}

export interface SpecializationBonus {
  stat: keyof PlayerStats;
  value: number;
  type: 'flat' | 'percentage';
}

// Definições das classes
export const CLASS_DEFINITIONS: Record<PlayerClass, ClassStats> = {
  [PlayerClass.WARRIOR]: {
    primaryAttribute: 'def',
    secondaryAttributes: ['hp', 'atq', 'res'],
    weaponTypes: [WeaponType.GREATSWORD, WeaponType.BATTLEAXE, WeaponType.WARHAMMER],
    armorType: ArmorType.PLATE,
    baseStats: {
      hp: 120,
      def: 15,
      res: 8,
      atq: 12,
      agi: 5,
      vel: 4,
      mag: 2,
      ene: 40,
      fat: 0,
      pi: 0
    }
  },
  
  [PlayerClass.ARCHER]: {
    primaryAttribute: 'agi',
    secondaryAttributes: ['atq', 'vel', 'hp'],
    weaponTypes: [WeaponType.BOW, WeaponType.CROSSBOW, WeaponType.DAGGER],
    armorType: ArmorType.LEATHER_MEDIUM,
    baseStats: {
      hp: 90,
      agi: 15,
      vel: 12,
      atq: 10,
      def: 6,
      res: 5,
      mag: 3,
      ene: 50,
      fat: 0,
      pi: 0
    }
  },
  
  [PlayerClass.MAGE]: {
    primaryAttribute: 'mag',
    secondaryAttributes: ['ene', 'res', 'agi'],
    weaponTypes: [WeaponType.STAFF, WeaponType.ORB, WeaponType.WAND],
    armorType: ArmorType.CLOTH,
    baseStats: {
      hp: 70,
      mag: 15,
      ene: 80,
      res: 10,
      agi: 8,
      def: 4,
      atq: 5,
      vel: 7,
      fat: 0,
      pi: 0
    }
  },
  
  [PlayerClass.CLERIC]: {
    primaryAttribute: 'mag',
    secondaryAttributes: ['hp', 'res', 'def'],
    weaponTypes: [WeaponType.MACE, WeaponType.SHIELD, WeaponType.HOLY_SYMBOL],
    armorType: ArmorType.CHAIN_MAIL,
    baseStats: {
      hp: 100,
      mag: 12,
      res: 12,
      def: 10,
      ene: 60,
      atq: 6,
      agi: 6,
      vel: 5,
      fat: 0,
      pi: 0
    }
  },
  
  [PlayerClass.ASSASSIN]: {
    primaryAttribute: 'agi',
    secondaryAttributes: ['atq', 'vel', 'hp'],
    weaponTypes: [WeaponType.DUAL_DAGGERS, WeaponType.CLAWS, WeaponType.SHURIKENS],
    armorType: ArmorType.LEATHER_LIGHT,
    baseStats: {
      hp: 85,
      agi: 18,
      vel: 15,
      atq: 12,
      def: 5,
      res: 4,
      mag: 2,
      ene: 45,
      fat: 0,
      pi: 0
    }
  }
};

// Habilidades específicas de cada classe
export const CLASS_SKILLS: ClassSkill[] = [
  // Guerreiro
  {
    id: 'warrior_brutal_charge',
    name: 'Investida Brutal',
    description: 'Avança rapidamente e causa dano aos inimigos no caminho',
    class: PlayerClass.WARRIOR,
    requiredLevel: 1,
    skillType: SkillType.DAMAGE,
    damage: 25,
    cooldown: 8,
    range: 15,
    costENE: 15,
    costFAT: 5,
    castTime: 0.5,
    areaOfEffect: false
  },
  {
    id: 'warrior_steel_wall',
    name: 'Muralha de Aço',
    description: 'Reduz dano recebido em área por 8 segundos',
    class: PlayerClass.WARRIOR,
    requiredLevel: 5,
    skillType: SkillType.TANK,
    duration: 8,
    cooldown: 20,
    range: 0,
    costENE: 20,
    costFAT: 10,
    areaOfEffect: true
  },
  {
    id: 'warrior_war_cry',
    name: 'Grito de Guerra',
    description: 'Provoca todos os inimigos em área, forçando-os a atacá-lo',
    class: PlayerClass.WARRIOR,
    requiredLevel: 10,
    skillType: SkillType.CROWD_CONTROL,
    duration: 3,
    cooldown: 15,
    range: 10,
    costENE: 10,
    costFAT: 8,
    areaOfEffect: true
  },
  {
    id: 'warrior_devastating_blow',
    name: 'Golpe Devastador',
    description: 'Ataque poderoso com alto dano e cooldown longo',
    class: PlayerClass.WARRIOR,
    requiredLevel: 15,
    skillType: SkillType.DAMAGE,
    damage: 60,
    cooldown: 30,
    range: 3,
    costENE: 30,
    costFAT: 15,
    castTime: 1.5,
    areaOfEffect: false
  },

  // Arqueiro
  {
    id: 'archer_arrow_rain',
    name: 'Chuva de Flechas',
    description: 'Dispara flechas em área causando dano a múltiplos alvos',
    class: PlayerClass.ARCHER,
    requiredLevel: 1,
    skillType: SkillType.DAMAGE,
    damage: 20,
    cooldown: 12,
    range: 25,
    costENE: 18,
    costFAT: 6,
    castTime: 1,
    areaOfEffect: true
  },
  {
    id: 'archer_evasive_jump',
    name: 'Salto Evasivo',
    description: 'Salta para trás rapidamente, evitando ataques',
    class: PlayerClass.ARCHER,
    requiredLevel: 5,
    skillType: SkillType.MOBILITY,
    cooldown: 10,
    range: 15,
    costENE: 12,
    costFAT: 4,
    areaOfEffect: false
  },
  {
    id: 'archer_hunters_mark',
    name: 'Marca do Caçador',
    description: 'Marca um alvo, aumentando todo dano recebido por ele',
    class: PlayerClass.ARCHER,
    requiredLevel: 10,
    skillType: SkillType.DEBUFF,
    duration: 10,
    cooldown: 20,
    range: 30,
    costENE: 15,
    costFAT: 5,
    areaOfEffect: false
  },
  {
    id: 'archer_piercing_shot',
    name: 'Tiro Perfurante',
    description: 'Tiro que ignora parte da armadura do alvo',
    class: PlayerClass.ARCHER,
    requiredLevel: 15,
    skillType: SkillType.DAMAGE,
    damage: 45,
    cooldown: 15,
    range: 35,
    costENE: 25,
    costFAT: 8,
    castTime: 1.5,
    areaOfEffect: false
  },

  // Mago
  {
    id: 'mage_fireball',
    name: 'Bola de Fogo',
    description: 'Lança uma bola de fogo que explode no impacto',
    class: PlayerClass.MAGE,
    requiredLevel: 1,
    skillType: SkillType.DAMAGE,
    damage: 30,
    cooldown: 4,
    range: 20,
    costENE: 20,
    costFAT: 5,
    castTime: 1.5,
    areaOfEffect: true,
    school: ElementalSchool.PYRAXIS
  },
  {
    id: 'mage_blizzard',
    name: 'Nevasca',
    description: 'Cria uma nevasca que causa dano e reduz velocidade',
    class: PlayerClass.MAGE,
    requiredLevel: 8,
    skillType: SkillType.DEBUFF,
    damage: 15,
    duration: 6,
    cooldown: 25,
    range: 15,
    costENE: 35,
    costFAT: 12,
    castTime: 2,
    areaOfEffect: true,
    school: ElementalSchool.AQUARIS
  },
  {
    id: 'mage_chain_lightning',
    name: 'Relâmpago Encadeado',
    description: 'Relâmpago que salta entre múltiplos alvos',
    class: PlayerClass.MAGE,
    requiredLevel: 12,
    skillType: SkillType.DAMAGE,
    damage: 25,
    cooldown: 18,
    range: 25,
    costENE: 30,
    costFAT: 10,
    castTime: 1,
    areaOfEffect: true,
    school: ElementalSchool.AERIS
  },
  {
    id: 'mage_arcane_barrier',
    name: 'Barreira Arcana',
    description: 'Cria um escudo mágico que absorve dano',
    class: PlayerClass.MAGE,
    requiredLevel: 6,
    skillType: SkillType.BUFF,
    duration: 10,
    cooldown: 30,
    range: 0,
    costENE: 25,
    costFAT: 8,
    areaOfEffect: false
  },

  // Clérigo
  {
    id: 'cleric_healing_light',
    name: 'Luz Curativa',
    description: 'Restaura HP de um aliado',
    class: PlayerClass.CLERIC,
    requiredLevel: 1,
    skillType: SkillType.HEAL,
    healing: 40,
    cooldown: 3,
    range: 15,
    costENE: 18,
    costFAT: 3,
    castTime: 1.5,
    areaOfEffect: false,
    school: ElementalSchool.LUMINIS
  },
  {
    id: 'cleric_light_blessing',
    name: 'Bênção da Luz',
    description: 'Cura em área ao longo do tempo',
    class: PlayerClass.CLERIC,
    requiredLevel: 8,
    skillType: SkillType.HEAL,
    healing: 60,
    duration: 8,
    cooldown: 20,
    range: 10,
    costENE: 30,
    costFAT: 8,
    castTime: 2,
    areaOfEffect: true,
    school: ElementalSchool.LUMINIS
  },
  {
    id: 'cleric_divine_punishment',
    name: 'Punição Divina',
    description: 'Causa dano sagrado e pode atordoar',
    class: PlayerClass.CLERIC,
    requiredLevel: 10,
    skillType: SkillType.DAMAGE,
    damage: 35,
    cooldown: 12,
    range: 12,
    costENE: 22,
    costFAT: 6,
    castTime: 1,
    areaOfEffect: false,
    school: ElementalSchool.LUMINIS
  },
  {
    id: 'cleric_resurrection',
    name: 'Ressurreição',
    description: 'Revive um aliado caído',
    class: PlayerClass.CLERIC,
    requiredLevel: 20,
    skillType: SkillType.HEAL,
    healing: 100,
    cooldown: 300,
    range: 20,
    costENE: 50,
    costFAT: 20,
    castTime: 5,
    areaOfEffect: false,
    school: ElementalSchool.LUMINIS
  },

  // Assassino
  {
    id: 'assassin_shadow_strike',
    name: 'Golpe nas Sombras',
    description: 'Ataque furtivo com dano crítico garantido',
    class: PlayerClass.ASSASSIN,
    requiredLevel: 1,
    skillType: SkillType.DAMAGE,
    damage: 40,
    cooldown: 8,
    range: 3,
    costENE: 20,
    costFAT: 5,
    areaOfEffect: false
  },
  {
    id: 'assassin_evade',
    name: 'Evadir',
    description: 'Fica intangível por 2 segundos',
    class: PlayerClass.ASSASSIN,
    requiredLevel: 5,
    skillType: SkillType.MOBILITY,
    duration: 2,
    cooldown: 15,
    range: 0,
    costENE: 15,
    costFAT: 8,
    areaOfEffect: false
  },
  {
    id: 'assassin_paralyzing_poison',
    name: 'Veneno Paralisante',
    description: 'Aplica veneno que causa dano e reduz velocidade',
    class: PlayerClass.ASSASSIN,
    requiredLevel: 10,
    skillType: SkillType.DEBUFF,
    damage: 20,
    duration: 6,
    cooldown: 18,
    range: 5,
    costENE: 18,
    costFAT: 6,
    areaOfEffect: false
  },
  {
    id: 'assassin_execute',
    name: 'Execução',
    description: 'Dano massivo em alvos com HP baixo',
    class: PlayerClass.ASSASSIN,
    requiredLevel: 15,
    skillType: SkillType.DAMAGE,
    damage: 80,
    cooldown: 25,
    range: 5,
    costENE: 35,
    costFAT: 12,
    castTime: 1,
    areaOfEffect: false
  }
];

// Especializações de cada classe
export const CLASS_SPECIALIZATIONS: Specialization[] = [
  // Guerreiro
  {
    id: 'warrior_tank',
    name: 'Guardião Implacável',
    class: PlayerClass.WARRIOR,
    description: 'Especializado em proteção e sobrevivência',
    bonuses: [
      { stat: 'def', value: 20, type: 'flat' },
      { stat: 'hp', value: 15, type: 'percentage' },
      { stat: 'res', value: 10, type: 'flat' }
    ]
  },
  {
    id: 'warrior_dps',
    name: 'Berserker',
    class: PlayerClass.WARRIOR,
    description: 'Especializado em dano físico',
    bonuses: [
      { stat: 'atq', value: 25, type: 'flat' },
      { stat: 'agi', value: 15, type: 'percentage' },
      { stat: 'crit', value: 10, type: 'flat' }
    ]
  },

  // Arqueiro
  {
    id: 'archer_ranged',
    name: 'Atirador de Elite',
    class: PlayerClass.ARCHER,
    description: 'Especializado em dano à distância',
    bonuses: [
      { stat: 'atq', value: 20, type: 'flat' },
      { stat: 'vel', value: 15, type: 'percentage' },
      { stat: 'range', value: 25, type: 'percentage' }
    ]
  },
  {
    id: 'archer_mobile',
    name: 'Caçador Veloz',
    class: PlayerClass.ARCHER,
    description: 'Especializado em mobilidade e kiting',
    bonuses: [
      { stat: 'agi', value: 25, type: 'flat' },
      { stat: 'vel', value: 30, type: 'percentage' },
      { stat: 'dodge', value: 15, type: 'flat' }
    ]
  },

  // Mago
  {
    id: 'mage_elemental',
    name: 'Mestre Elemental',
    class: PlayerClass.MAGE,
    description: 'Especializado em magia elemental',
    bonuses: [
      { stat: 'mag', value: 25, type: 'flat' },
      { stat: 'ene', value: 20, type: 'percentage' },
      { stat: 'spell_damage', value: 20, type: 'percentage' }
    ]
  },
  {
    id: 'mage_control',
    name: 'Controlador Arcano',
    class: PlayerClass.MAGE,
    description: 'Especializado em controle de multidão',
    bonuses: [
      { stat: 'mag', value: 15, type: 'flat' },
      { stat: 'cc_duration', value: 30, type: 'percentage' },
      { stat: 'res', value: 20, type: 'flat' }
    ]
  },

  // Clérigo
  {
    id: 'cleric_healer',
    name: 'Sacerdote Sagrado',
    class: PlayerClass.CLERIC,
    description: 'Especializado em cura e suporte',
    bonuses: [
      { stat: 'mag', value: 20, type: 'flat' },
      { stat: 'healing', value: 30, type: 'percentage' },
      { stat: 'ene', value: 25, type: 'percentage' }
    ]
  },
  {
    id: 'cleric_battle',
    name: 'Clérigo de Batalha',
    class: PlayerClass.CLERIC,
    description: 'Especializado em combate e suporte ofensivo',
    bonuses: [
      { stat: 'mag', value: 15, type: 'flat' },
      { stat: 'atq', value: 10, type: 'percentage' },
      { stat: 'def', value: 15, type: 'percentage' }
    ]
  },

  // Assassino
  {
    id: 'assassin_stealth',
    name: 'Sombra Mortal',
    class: PlayerClass.ASSASSIN,
    description: 'Especializado em furtividade e ataques surpresa',
    bonuses: [
      { stat: 'agi', value: 30, type: 'flat' },
      { stat: 'stealth', value: 25, type: 'percentage' },
      { stat: 'crit_damage', value: 40, type: 'percentage' }
    ]
  },
  {
    id: 'assassin_combat',
    name: 'Guerreiro das Sombras',
    class: PlayerClass.ASSASSIN,
    description: 'Especializado em combate corpo a corpo rápido',
    bonuses: [
      { stat: 'agi', value: 20, type: 'flat' },
      { stat: 'atq', value: 25, type: 'percentage' },
      { stat: 'attack_speed', value: 30, type: 'percentage' }
    ]
  }
];
