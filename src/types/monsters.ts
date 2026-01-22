import { Rank, ElementalSchool, Position, PlayerStats } from './index';

// Re-exportar tipos necessários
export { ElementalSchool, PlayerStats } from './index';
import { ItemTier, EquipmentRarity } from './equipment';

export enum MonsterType {
  BEAST = 'Besta',
  UNDEAD = 'Morto-Vivo',
  DEMON = 'Demônio',
  ELEMENTAL = 'Elemental',
  CONSTRUCT = 'Construto',
  DRACONIC = 'Draconico',
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

export enum MonsterBehavior {
  AGGRESSIVE = 'Agressivo',
  PASSIVE = 'Passivo',
  NEUTRAL = 'Neutro',
  TERRITORIAL = 'Territorial',
  PATROL = 'Patrulha',
  GUARDIAN = 'Guardião',
  AMBUSH = 'Emboscada',
  SWARM = 'Enxame',
  RANGED = 'Ataque à Distância',
  MELEE = 'Corpo a Corpo'
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

export enum LootQuality {
  TRASH = 'Lixo',
  COMMON = 'Comum',
  UNCOMMON = 'Incomum',
  RARE = 'Raro',
  EPIC = 'Épico',
  LEGENDARY = 'Lendário',
  MYTHIC = 'Mítico'
}

export interface Monster {
  id: string;
  name: string;
  description: string;
  type: MonsterType;
  rank: MonsterRank;
  level: number;
  requiredRank: Rank;
  
  // Stats básicos
  stats: PlayerStats;
  
  // Comportamento
  behavior: MonsterBehavior;
  aggression: number; // 0-100
  detectionRange: number;
  attackRange: number;
  fleeThreshold: number;
  
  // Spawn
  spawnInfo: SpawnInfo;
  
  // Habilidades
  abilities: MonsterAbility[];
  
  // Resistências e vulnerabilidades
  resistances: ElementalResistances;
  vulnerabilities: ElementalVulnerabilities;
  
  // Loot
  lootTable: MonsterLoot;
  
  // Visual
  model: string;
  size: MonsterSize;
  sounds: string[];
  
  // Especial
  isBoss: boolean;
  isWorldBoss: boolean;
  isRaidBoss: boolean;
  questRelated?: string;
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
  school?: ElementalSchool;
  effects?: StatusEffect[];
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

export interface StatusEffect {
  id: string;
  name: string;
  type: StatusEffectType;
  duration: number;
  value: number;
  stackable: boolean;
  maxStacks?: number;
  dispellable: boolean;
}

export enum StatusEffectType {
  POISON = 'Veneno',
  BURN = 'Queimadura',
  FROZEN = 'Congelado',
  STUNNED = 'Atordoado',
  SLEEP = 'Adormecido',
  CHARM = 'Encantado',
  FEAR = 'Medo',
  SLOW = 'Lentidão',
  HASTE = 'Aceleração',
  WEAKEN = 'Enfraquecimento',
  BLEED = 'Sangramento',
  BLIND = 'Cegueira',
  SILENCE = 'Silenciado',
  DISARM = 'Desarmado',
  ROOT = 'Imobilizado',
  KNOCKBACK = 'Knockback',
  PULL = 'Puxão',
  TAUNT = 'Provocação'
}

export interface SpawnInfo {
  type: SpawnType;
  locations: SpawnLocation[];
  respawnTime: number; // em segundos
  maxInstances: number;
  spawnConditions?: SpawnCondition[];
  eventRelated?: string;
}

export interface SpawnLocation {
  regionId: string;
  position: Position;
  radius?: number;
  patrolRoute?: Position[];
}

export interface SpawnCondition {
  type: ConditionType;
  value: any;
  description: string;
}

export enum ConditionType {
  TIME_OF_DAY = 'Hora do Dia',
  WEATHER = 'Clima',
  PLAYER_PROXIMITY = 'Proximidade de Jogador',
  QUEST_STATUS = 'Status de Quest',
  EVENT_ACTIVE = 'Evento Ativo',
  MOB_COUNT = 'Contagem de Mobs',
  REGION_CONTROL = 'Controle de Região'
}

export interface ElementalResistances {
  [ElementalSchool.TERRANOR]?: number;
  [ElementalSchool.PYRAXIS]?: number;
  [ElementalSchool.AQUARIS]?: number;
  [ElementalSchool.AERIS]?: number;
  [ElementalSchool.LUMINIS]?: number;
  [ElementalSchool.UMBRIS]?: number;
}

export interface ElementalVulnerabilities {
  [ElementalSchool.TERRANOR]?: number;
  [ElementalSchool.PYRAXIS]?: number;
  [ElementalSchool.AQUARIS]?: number;
  [ElementalSchool.AERIS]?: number;
  [ElementalSchool.LUMINIS]?: number;
  [ElementalSchool.UMBRIS]?: number;
}

export interface MonsterLoot {
  gold: { min: number; max: number };
  experience: number;
  items: LootEntry[];
  materials: MaterialEntry[];
  specialLoot?: SpecialLootEntry[];
}

export interface LootEntry {
  itemId: string;
  chance: number; // 0-100
  minQuantity: number;
  maxQuantity: number;
  condition?: LootCondition;
}

export interface MaterialEntry {
  materialId: string;
  chance: number;
  minQuantity: number;
  maxQuantity: number;
  skillRequired?: string;
  skillLevel?: number;
}

export interface SpecialLootEntry {
  type: SpecialLootType;
  itemId?: string;
  titleId?: string;
  mountId?: string;
  petId?: string;
  chance: number;
  description: string;
}

export enum SpecialLootType {
  MOUNT = 'Montaria',
  PET = 'Pet',
  TITLE = 'Título',
  RECIPE = 'Receita',
  QUEST_ITEM = 'Item de Quest',
  COSMETIC = 'Cosmético'
}

export interface LootCondition {
  type: LootConditionType;
  value: any;
}

export enum LootConditionType {
  PLAYER_LEVEL = 'Nível do Jogador',
  PLAYER_RANK = 'Rank do Jogador',
  PLAYER_CLASS = 'Classe do Jogador',
  TIME_OF_DAY = 'Hora do Dia',
  WEATHER = 'Clima',
  PARTY_SIZE = 'Tamanho do Grupo',
  DIFFICULTY = 'Dificuldade',
  EVENT_ACTIVE = 'Evento Ativo'
}

export interface BossMechanic {
  id: string;
  name: string;
  description: string;
  type: BossMechanicType;
  parameters: BossMechanicParams;
  priority: BossMechanicPriority;
}

export enum MonsterSize {
  TINY = 'Minúsculo',
  SMALL = 'Pequeno',
  MEDIUM = 'Médio',
  LARGE = 'Grande',
  HUGE = 'Enorme',
  GIGANTIC = 'Gigantesco'
}

// Interfaces para Bosses
export interface BossMechanic {
  id: string;
  name: string;
  description: string;
  type: BossMechanicType;
  parameters: BossMechanicParams;
  priority: BossMechanicPriority;
}

export enum BossMechanicType {
  ENRAGE_TIMER = 'Timer de Fúria',
  PHASE_TRANSITION = 'Transição de Fase',
  ADD_SPAWN = 'Spawn de Adds',
  ENVIRONMENTAL_HAZARD = 'Perigo Ambiental',
  PLAYER_DEBUFF = 'Debuff em Jogadores',
  INTERRUPT_CHECK = 'Verificação de Interrupção',
  POSITION_CHECK = 'Verificação de Posição',
  RESOURCE_DRAIN = 'Dreno de Recursos',
  MIND_CONTROL = 'Controle Mental',
  TRANSFORMATION = 'Transformação',
  IMMUNITY_PHASE = 'Fase de Imunidade',
  SOUL_BIND = 'Vinculação de Alma',
  TIME_PRESSURE = 'Pressão de Tempo',
  COORDINATION_CHECK = 'Verificação de Coordenação'
}

export interface BossMechanicParams {
  duration?: number;
  value?: number;
  radius?: number;
  damage?: number;
  count?: number;
  interval?: number;
  target?: string;
  condition?: string;
}

export enum BossMechanicPriority {
  CRITICAL = 'Crítico',
  HIGH = 'Alto',
  MEDIUM = 'Médio',
  LOW = 'Baixo'
}

export interface BossPhase {
  phaseNumber: number;
  name: string;
  healthThreshold: number;
  newMechanics: string[];
  abilityChanges: AbilityChange[];
  visualChanges: VisualChange[];
  duration?: number;
  enrageTimer?: number;
}

export interface AbilityChange {
  abilityId: string;
  changeType: AbilityChangeType;
  newValue: any;
  description: string;
}

export enum AbilityChangeType {
  DAMAGE_INCREASE = 'Aumento de Dano',
  COOLDOWN_DECREASE = 'Redução de Cooldown',
  RANGE_INCREASE = 'Aumento de Alcance',
  ADD_EFFECT = 'Adicionar Efeito',
  REMOVE_EFFECT = 'Remover Efeito',
  CAST_TIME_DECREASE = 'Redução de Tempo de Conjuração',
  AREA_INCREASE = 'Aumento de Área'
}

export interface VisualChange {
  type: VisualChangeType;
  description: string;
  modelChange?: string;
  colorChange?: string;
  sizeChange?: number;
  particleEffect?: string;
  soundEffect?: string;
}

export enum VisualChangeType {
  MODEL = 'Modelo',
  COLOR = 'Cor',
  SIZE = 'Tamanho',
  PARTICLE = 'Partícula',
  LIGHT = 'Luz',
  SOUND = 'Som',
  ANIMATION = 'Animação'
}

// Sistema de Bestiário
export interface BestiaryEntry {
  monsterId: string;
  kills: number;
  firstKill: Date;
  lastKill: Date;
  highestLevelKilled: number;
  achievements: string[];
  notes: string;
  tags: string[];
}

export interface PlayerBestiary {
  playerId: string;
  entries: Map<string, BestiaryEntry>;
  completionPercentage: number;
  uniqueKills: number;
  totalKills: number;
  achievements: string[];
}

// Configurações de Dificuldade
export interface DifficultyScaling {
  level: number;
  healthMultiplier: number;
  damageMultiplier: number;
  experienceMultiplier: number;
  lootMultiplier: number;
  abilityCount: number;
}

export const DIFFICULTY_SCALING: Record<number, DifficultyScaling> = {
  1: { level: 1, healthMultiplier: 1.0, damageMultiplier: 1.0, experienceMultiplier: 1.0, lootMultiplier: 1.0, abilityCount: 1 },
  10: { level: 10, healthMultiplier: 2.0, damageMultiplier: 1.5, experienceMultiplier: 1.2, lootMultiplier: 1.1, abilityCount: 2 },
  20: { level: 20, healthMultiplier: 4.0, damageMultiplier: 2.0, experienceMultiplier: 1.5, lootMultiplier: 1.3, abilityCount: 3 },
  30: { level: 30, healthMultiplier: 8.0, damageMultiplier: 2.5, experienceMultiplier: 1.8, lootMultiplier: 1.5, abilityCount: 4 },
  40: { level: 40, healthMultiplier: 15.0, damageMultiplier: 3.0, experienceMultiplier: 2.0, lootMultiplier: 1.8, abilityCount: 5 },
  50: { level: 50, healthMultiplier: 25.0, damageMultiplier: 3.5, experienceMultiplier: 2.5, lootMultiplier: 2.0, abilityCount: 6 },
  60: { level: 60, healthMultiplier: 40.0, damageMultiplier: 4.0, experienceMultiplier: 3.0, lootMultiplier: 2.5, abilityCount: 7 },
  70: { level: 70, healthMultiplier: 60.0, damageMultiplier: 4.5, experienceMultiplier: 3.5, lootMultiplier: 3.0, abilityCount: 8 },
  80: { level: 80, healthMultiplier: 80.0, damageMultiplier: 5.0, experienceMultiplier: 4.0, lootMultiplier: 3.5, abilityCount: 9 },
  90: { level: 90, healthMultiplier: 100.0, damageMultiplier: 5.5, experienceMultiplier: 4.5, lootMultiplier: 4.0, abilityCount: 10 },
  100: { level: 100, healthMultiplier: 125.0, damageMultiplier: 6.0, experienceMultiplier: 5.0, lootMultiplier: 4.5, abilityCount: 12 }
};

// Constantes de balanceamento
export const MONSTER_BALANCE_CONSTANTS = {
  BASE_HP: 100,
  BASE_DAMAGE: 10,
  BASE_DEFENSE: 5,
  BASE_XP: 50,
  BASE_GOLD: 25,
  ELITE_MULTIPLIER: 3.0,
  CHAMPION_MULTIPLIER: 8.0,
  BOSS_MULTIPLIER: 25.0,
  WORLD_BOSS_MULTIPLIER: 100.0,
  RAID_BOSS_MULTIPLIER: 500.0,
  CRITICAL_HIT_CHANCE: 0.05,
  CRITICAL_HIT_MULTIPLIER: 2.0,
  GLANCING_BLOW_CHANCE: 0.15,
  GLANCING_BLOW_MULTIPLIER: 0.3,
  MISS_CHANCE_BASE: 0.05,
  DODGE_CHANCE_BASE: 0.10,
  PARRY_CHANCE_BASE: 0.10,
  BLOCK_CHANCE_BASE: 0.15
};
