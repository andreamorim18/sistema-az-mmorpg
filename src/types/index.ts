// Sistema A-Z MMORPG - Core Types
// Baseado na documentação dos PDFs

export enum Rank {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E',
  F = 'F',
  G = 'G',
  H = 'H',
  I = 'I',
  J = 'J',
  K = 'K',
  L = 'L',
  M = 'M',
  N = 'N',
  O = 'O',
  P = 'P',
  Q = 'Q',
  R = 'R',
  S = 'S',
  T = 'T',
  U = 'U',
  V = 'V',
  W = 'W',
  X = 'X',
  Y = 'Y',
  Z = 'Z'
}

export enum ElementalSchool {
  TERRANOR = 'Terranor',
  PYRAXIS = 'Pyraxis',
  AQUARIS = 'Aquaris',
  AERIS = 'Aeris',
  LUMINIS = 'Luminis',
  UMBRIS = 'Umbris'
}

export enum QuestCategory {
  MAIN = 'Principal',
  SIDE = 'Secundária',
  DAILY = 'Diária',
  WEEKLY = 'Semanal',
  EVENT = 'Evento',
  RAID = 'Raide'
}

export interface PlayerStats {
  pi: number;      // Pontos de Impacto
  hp: number;      // Health Points
  ene: number;     // Energia
  atq: number;     // Ataque
  def: number;     // Defesa
  mag: number;     // Magia
  res: number;     // Resistência
  agi: number;     // Agilidade
  vel: number;     // Velocidade
  fat: number;     // Fadiga
  
  // Stats derivados para combate avançado
  crit?: number;           // Chance crítico
  crit_damage?: number;    // Multiplicador de dano crítico
  dodge?: number;          // Chance de esquiva
  range?: number;          // Alcance (para ranged)
  spell_damage?: number;   // Dano mágico bônus
  cc_duration?: number;    // Duração de crowd control
  healing?: number;        // Poder de cura
  stealth?: number;        // Habilidade furtiva
  attack_speed?: number;   // Velocidade de ataque
}

export interface RankProgression {
  rank: Rank;
  minXP: number;
  minPI: number;
  hpMultiplier: number;
  eneMultiplier: number;
  atqMultiplier: number;
}

export interface Player {
  id: string;
  name: string;
  email: string;
  rank: Rank;
  level: number;
  xp: number;
  stats: PlayerStats;
  skills: PlayerSkill[];
  inventory: InventoryItem[];
  quests: QuestStatus[];
  position: Position;
  createdAt: Date;
  updatedAt: Date;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  school: ElementalSchool;
  tier: number;
  requiredRank: Rank;
  costENE: number;
  costFAT: number;
  damage?: number;
  healing?: number;
  duration?: number;
  cooldown: number;
  range: number;
  areaOfEffect?: boolean;
}

export interface PlayerSkill {
  skillId: string;
  level: number;
  experience: number;
  unlockedAt: Date;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  rarity: ItemRarity;
  requiredRank: Rank;
  value: number;
  stackable: boolean;
  maxStack: number;
  stats?: Partial<PlayerStats>;
}

export enum ItemType {
  WEAPON = 'Arma',
  ARMOR = 'Armadura',
  ACCESSORY = 'Acessório',
  CONSUMABLE = 'Consumível',
  MATERIAL = 'Material',
  QUEST = 'Quest'
}

export enum ItemRarity {
  COMMON = 'Comum',
  UNCOMMON = 'Incomum',
  RARE = 'Raro',
  EPIC = 'Épico',
  LEGENDARY = 'Lendário',
  MYTHIC = 'Mítico'
}

export interface InventoryItem {
  itemId: string;
  quantity: number;
  slot?: number;
  equipped: boolean;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  category: QuestCategory;
  requiredRank: Rank;
  requiredLevel: number;
  objectives: QuestObjective[];
  rewards: QuestReward[];
  timeLimit?: number;
  repeatable: boolean;
  cooldown?: number;
}

export interface QuestObjective {
  type: ObjectiveType;
  target: string;
  required: number;
  current: number;
}

export enum ObjectiveType {
  KILL = 'Matar',
  COLLECT = 'Coletar',
  DELIVER = 'Entregar',
  TALK = 'Falar',
  EXPLORE = 'Explorar',
  USE_SKILL = 'Usar Habilidade'
}

export interface QuestReward {
  type: RewardType;
  value: number;
  itemId?: string;
}

export enum RewardType {
  XP = 'XP',
  PI = 'PI',
  GOLD = 'Ouro',
  ITEM = 'Item',
  SKILL = 'Habilidade'
}

export interface QuestStatus {
  questId: string;
  status: QuestStatusType;
  progress: QuestObjective[];
  startedAt?: Date;
  completedAt?: Date;
}

export enum QuestStatusType {
  AVAILABLE = 'Disponível',
  IN_PROGRESS = 'Em Progresso',
  COMPLETED = 'Concluída',
  FAILED = 'Falhou',
  COOLDOWN = 'Em Recarga'
}

export interface NPC {
  id: string;
  name: string;
  type: NPCType;
  rank: Rank;
  level: number;
  stats: PlayerStats;
  position: Position;
  dialogue: DialogueTree[];
  quests: string[];
  lootTable: string[];
  aiBehavior: AIBehavior;
}

export enum NPCType {
  MERCHANT = 'Comerciante',
  QUEST_GIVER = 'Dador de Quests',
  TRAINER = 'Treinador',
  GUARD = 'Guarda',
  MONSTER = 'Monstro',
  BOSS = 'Chefe'
}

export interface Position {
  x: number;
  y: number;
  z: number;
  mapId: string;
}

export interface DialogueTree {
  id: string;
  text: string;
  options: DialogueOption[];
  conditions?: DialogueCondition[];
}

export interface DialogueOption {
  text: string;
  nextDialogueId?: string;
  action?: DialogueAction;
}

export interface DialogueCondition {
  type: ConditionType;
  value: any;
}

export enum ConditionType {
  RANK = 'Rank',
  LEVEL = 'Level',
  QUEST_COMPLETED = 'Quest_Completada',
  ITEM_HAS = 'Tem_Item'
}

export interface DialogueAction {
  type: ActionType;
  value: any;
}

export enum ActionType {
  GIVE_QUEST = 'Dar_Quest',
  GIVE_ITEM = 'Dar_Item',
  TAKE_ITEM = 'Pegar_Item',
  TELEPORT = 'Teletransportar'
}

export interface AIBehavior {
  aggression: number;
  detectionRange: number;
  attackRange: number;
  patrolRoute: Position[];
  skills: string[];
  fleeThreshold: number;
}

export interface CombatResult {
  attacker: string;
  defender: string;
  damage: number;
  damageType: ElementalSchool;
  critical: boolean;
  blocked: boolean;
  dodged: boolean;
  statusEffects?: StatusEffect[];
}

export interface StatusEffect {
  id: string;
  name: string;
  type: StatusEffectType;
  duration: number;
  value: number;
  source: string;
}

export enum StatusEffectType {
  POISON = 'Veneno',
  BURN = 'Queimadura',
  FROZEN = 'Congelado',
  STUNNED = 'Atordoado',
  BUFF = 'Buff',
  DEBUFF = 'Debuff'
}

export interface Biome {
  id: string;
  name: string;
  description: string;
  recommendedRank: Rank;
  recommendedLevel: number;
  npcs: string[];
  resources: ResourceNode[];
  lootTable: string[];
}

export interface ResourceNode {
  id: string;
  type: ResourceType;
  position: Position;
  respawnTime: number;
  loot: string[];
}

export enum ResourceType {
  MINERAL = 'Mineral',
  HERB = 'Erva',
  WOOD = 'Madeira',
  CRYSTAL = 'Cristal'
}

export interface LootTable {
  id: string;
  name: string;
  entries: LootEntry[];
}

export interface LootEntry {
  itemId: string;
  chance: number;
  minQuantity: number;
  maxQuantity: number;
  condition?: LootCondition;
}

export interface LootCondition {
  type: ConditionType;
  value: any;
}
