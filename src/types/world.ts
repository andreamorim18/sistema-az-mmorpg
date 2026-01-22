import { Rank } from './index';
import { NPC, Biome, Position } from './index';

export enum RegionType {
  STARTER = 'Inicial',
  DUNGEON = 'Dungeon',
  PVP = 'PvP',
  GUILD = 'Guilda',
  RAID = 'Raid',
  WORLD_BOSS = 'World Boss'
}

export enum CityType {
  COMMERCIAL = 'Comercial',
  GUILD = 'Guilda',
  ACADEMY = 'Academia',
  SANCTUARY = 'Santuário',
  UNDERGROUND = 'Mercado Negro'
}

export interface Region {
  id: string;
  name: string;
  description: string;
  type: RegionType;
  recommendedLevel: { min: number; max: number };
  recommendedRank: Rank;
  
  // Geografia
  size: { width: number; height: number };
  climate: Climate;
  terrain: Terrain[];
  
  // Conexões
  connectedRegions: string[];
  travelMethods: TravelMethod[];
  
  // Conteúdo
  cities: City[];
  dungeons: Dungeon[];
  npcs: string[];
  resources: ResourceNode[];
  landmarks: Landmark[];
  
  // Propriedades especiais
  pvpEnabled?: boolean;
  guildTerritory?: boolean;
  worldBoss?: WorldBoss;
  
  // Visual
  backgroundColor?: string;
  musicTheme?: string;
  ambientSounds?: string[];
}

export interface City {
  id: string;
  name: string;
  type: CityType;
  description: string;
  position: Position;
  size: CitySize;
  
  // Serviços
  vendors: Vendor[];
  trainers: Trainer[];
  auctionHouse?: AuctionHouse;
  guildHall?: GuildHall;
  inn?: Inn;
  
  // NPCs
  guards: NPC[];
  citizens: NPC[];
  questGivers: NPC[];
  
  // Arquitetura
  buildings: Building[];
  districts: District[];
  
  // Funcionalidades
  fastTravel?: FastTravelPoint;
  bank?: BankService;
  mailbox?: MailboxService;
}

export interface Dungeon {
  id: string;
  name: string;
  description: string;
  type: DungeonType;
  difficulty: DungeonDifficulty;
  recommendedLevel: { min: number; max: number };
  recommendedGear: ItemTier;
  
  // Estrutura
  floors: DungeonFloor[];
  bosses: DungeonBoss[];
  encounters: Encounter[];
  puzzles: Puzzle[];
  
  // Mecânicas
  dungeonMechanics: DungeonMechanic[];
  timeLimit?: number; // em minutos
  lockout: LockoutInfo;
  
  // Recompensas
  loot: DungeonLoot;
  questRewards: string[];
  achievements: string[];
  
  // Configuração
  maxPlayers: number;
  requiredLevel: number;
  entryRequirements: EntryRequirement[];
}

export interface WorldBoss {
  id: string;
  name: string;
  description: string;
  level: number;
  rank: Rank;
  type: BossType;
  
  // Spawn
  spawnLocation: Position;
  spawnTimer: SpawnTimer;
  respawnTime: number; // em horas
  
  // Mecânicas
  phases: BossPhase[];
  mechanics: BossMechanic[];
  enrageTimer?: number;
  
  // Recompensas
  loot: BossLoot;
  achievements: string[];
  titles: string[];
  
  // Dificuldade
  minPlayers: number;
  recommendedPlayers: number;
  abilities: string[];
}

export interface ResourceNode {
  id: string;
  type: ResourceType;
  name: string;
  description: string;
  position: Position;
  
  // Spawn
  respawnTime: number; // em minutos
  maxQuantity: number;
  currentQuantity: number;
  
  // Requisitos
  requiredLevel: number;
  requiredSkill?: SkillRequirement;
  requiredTool?: ToolRequirement;
  
  // Loot
  possibleLoot: ResourceLoot[];
  rareLoot?: ResourceLoot[];
  
  // Visual
  model: string;
  particleEffects?: string[];
  soundEffects?: string[];
}

export interface Landmark {
  id: string;
  name: string;
  description: string;
  type: LandmarkType;
  position: Position;
  
  // Propriedades
  size: { width: number; height: number; depth: number };
  interactive: boolean;
  discoveryRequired: boolean;
  
  // Funcionalidade
  fastTravel?: FastTravelPoint;
  questTrigger?: string;
  eventLocation?: string;
  
  // Visual
  model: string;
  glowEffect?: boolean;
  particleEffects?: string[];
}

export enum Climate {
  TEMPERATE = 'Temperado',
  TROPICAL = 'Tropical',
  DESERT = 'Deserto',
  ARCTIC = 'Ártico',
  SWAMP = 'Pântano',
  VOLCANIC = 'Vulcânico',
  MYSTICAL = 'Místico'
}

export enum Terrain {
  GRASSLAND = 'Planície',
  FOREST = 'Floresta',
  MOUNTAIN = 'Montanha',
  DESERT = 'Deserto',
  SWAMP = 'Pântano',
  TUNDRA = 'Tundra',
  VOLCANIC = 'Vulcânico',
  RUINS = 'Ruínas',
  UNDERGROUND = 'Subterrâneo'
}

export enum TravelMethod {
  WALKING = 'Caminhada',
  MOUNT = 'Montaria',
  TELEPORT = 'Teleporte',
  BOAT = 'Barco',
  AIRSHIP = 'Nave Aérea',
  PORTAL = 'Portal'
}

export enum CitySize {
  HAMLET = 'Aldeia',
  VILLAGE = 'Vila',
  TOWN = 'Cidade',
  CITY = 'Metrópole',
  CAPITAL = 'Capital'
}

export enum DungeonType {
  CAVE = 'Caverna',
  RUINS = 'Ruínas',
  TOWER = 'Torre',
  FORTRESS = 'Fortaleza',
  TEMPLE = 'Templo',
  LABYRINTH = 'Labirinto',
  UNDERGROUND = 'Subterrâneo'
}

export enum DungeonDifficulty {
  NORMAL = 'Normal',
  HEROIC = 'Heróico',
  MYTHIC = 'Mítico'
}

export enum ItemTier {
  TIER_1 = 'Tier 1',
  TIER_2 = 'Tier 2',
  TIER_3 = 'Tier 3',
  TIER_4 = 'Tier 4',
  TIER_5 = 'Tier 5'
}

export enum BossType {
  BEAST = 'Besta',
  UNDEAD = 'Morto-Vivo',
  ELEMENTAL = 'Elemental',
  DEMON = 'Demônio',
  DRAGON = 'Dragão',
  GIANT = 'Gigante',
  CONSTRUCT = 'Construto'
}

export enum ResourceType {
  MINING = 'Mineração',
  HERBALISM = 'Herbalismo',
  SKINNING = 'Esfolamento',
  FISHING = 'Pesca',
  ARCHAEOLOGY = 'Arqueologia'
}

export enum LandmarkType {
  STATUE = 'Estátua',
  MONUMENT = 'Monumento',
  RUINS = 'Ruínas',
  SHRINE = 'Santuário',
  TOWER = 'Torre',
  BRIDGE = 'Ponte',
  WATERFALL = 'Cachoeira',
  CAVE = 'Caverna'
}

// Interfaces auxiliares
export interface Vendor {
  id: string;
  name: string;
  type: VendorType;
  position: Position;
  inventory: VendorItem[];
  restockTime: number;
  reputation: ReputationLevel;
}

export interface Trainer {
  id: string;
  name: string;
  type: TrainerType;
  position: Position;
  skills: string[];
  maxSkillLevel: number;
  cost: number;
}

export interface AuctionHouse {
  id: string;
  name: string;
  position: Position;
  tax: number;
  maxAuctions: number;
  duration: number;
}

export interface GuildHall {
  id: string;
  name: string;
  position: Position;
  size: GuildHallSize;
  amenities: GuildAmenity[];
  upgradeLevel: number;
}

export interface Inn {
  id: string;
  name: string;
  position: Position;
  rooms: InnRoom[];
  services: InnService[];
  reputation: ReputationLevel;
}

export interface Building {
  id: string;
  name: string;
  type: BuildingType;
  position: Position;
  size: { width: number; height: number };
  interior?: string;
}

export interface District {
  id: string;
  name: string;
  type: DistrictType;
  buildings: string[];
  npcs: string[];
  atmosphere: string;
}

export interface DungeonFloor {
  floorNumber: number;
  name: string;
  size: { width: number; height: number };
  layout: FloorLayout;
  enemies: string[];
  treasures: TreasureChest[];
  objectives: FloorObjective[];
  boss?: string;
}

export interface DungeonBoss {
  id: string;
  name: string;
  level: number;
  type: BossType;
  mechanics: BossMechanic[];
  loot: BossLoot;
  achievements: string[];
}

export interface Encounter {
  id: string;
  name: string;
  type: EncounterType;
  enemies: string[];
  mechanics: EncounterMechanic[];
  loot: EncounterLoot;
}

export interface Puzzle {
  id: string;
  name: string;
  type: PuzzleType;
  description: string;
  solution: string;
  reward: PuzzleReward;
  hints: string[];
}

export interface DungeonMechanic {
  type: MechanicType;
  description: string;
  difficulty: number;
  playerCount: number;
}

export interface LockoutInfo {
  type: LockoutType;
  duration: number;
  resetDay?: number;
  resetTime?: string;
}

export interface DungeonLoot {
  normal: LootEntry[];
  heroic: LootEntry[];
  mythic: LootEntry[];
  guaranteed: LootEntry[];
}

export interface EntryRequirement {
  type: RequirementType;
  value: any;
  description: string;
}

export interface SpawnTimer {
  type: SpawnType;
  schedule: SpawnSchedule;
  announceTime: number; // minutos antes
}

export interface BossPhase {
  phaseNumber: number;
  healthThreshold: number;
  newMechanics: BossMechanic[];
  abilityChanges: AbilityChange[];
  visualChanges: VisualChange[];
}

export interface BossMechanic {
  name: string;
  type: MechanicType;
  description: string;
  damage?: number;
  duration?: number;
  cooldown?: number;
  interruptible: boolean;
}

export interface BossLoot {
  common: LootEntry[];
  rare: LootEntry[];
  epic: LootEntry[];
  legendary: LootEntry[];
  guaranteed: LootEntry[];
}

export interface SkillRequirement {
  skill: string;
  level: number;
}

export interface ToolRequirement {
  tool: string;
  quality: number;
}

export interface ResourceLoot {
  itemId: string;
  quantity: { min: number; max: number };
  chance: number;
  condition?: LootCondition;
}

export interface FastTravelPoint {
  id: string;
  name: string;
  position: Position;
  destinations: string[];
  cost: number;
  requirements: TravelRequirement[];
}

export interface LootEntry {
  itemId: string;
  quantity: { min: number; max: number };
  chance: number;
  condition?: LootCondition;
}

export interface LootCondition {
  type: ConditionType;
  value: any;
}

export interface TreasureChest {
  id: string;
  type: ChestType;
  position: Position;
  locked: boolean;
  trapped: boolean;
  loot: LootEntry[];
  respawnTime: number;
}

export interface FloorObjective {
  type: ObjectiveType;
  target: string;
  required: number;
  description: string;
}

export interface EncounterMechanic {
  type: MechanicType;
  parameters: any;
}

export interface EncounterLoot {
  items: LootEntry[];
  experience: number;
  reputation: number;
}

export interface PuzzleReward {
  items: LootEntry[];
  experience: number;
  access?: string;
}

export interface AbilityChange {
  abilityId: string;
  changeType: ChangeType;
  newValue: any;
}

export interface VisualChange {
  type: VisualType;
  description: string;
}

export interface TravelRequirement {
  type: RequirementType;
  value: any;
}

// Enums auxiliares
export enum VendorType {
  GENERAL = 'Geral',
  ARMOR = 'Armaduras',
  WEAPONS = 'Armas',
  CONSUMABLES = 'Consumíveis',
  TRADE = 'Comércio',
  REAGENTS = 'Componentes'
}

export enum TrainerType {
  CLASS = 'Classe',
  PROFESSION = 'Profissão',
  WEAPON = 'Armas',
  ARMOR = 'Armaduras'
}

export enum ReputationLevel {
  HATED = 'Odiado',
  HOSTILE = 'Hostil',
  UNFRIENDLY = 'Não Amigável',
  NEUTRAL = 'Neutro',
  FRIENDLY = 'Amigável',
  HONORED = 'Honrado',
  REVERED = 'Reverenciado',
  EXALTED = 'Exaltado'
}

export enum GuildHallSize {
  SMALL = 'Pequeno',
  MEDIUM = 'Médio',
  LARGE = 'Grande',
  MASSIVE = 'Massivo'
}

export enum GuildAmenity {
  VAULT = 'Cofre',
  TRAINING_DUMMY = 'Boneco de Treinamento',
  CRAFTING_STATION = 'Estação de Crafting',
  PORTAL = 'Portal',
  BUFF_STATION = 'Estação de Buffs',
  TROPHY_ROOM = 'Sala de Troféus'
}

export enum InnService {
  REST = 'Descanso',
  FOOD = 'Comida',
  DRINK = 'Bebida',
  LAUNDRY = 'Lavanderia',
  STABLE = 'Estábulo'
}

export enum BuildingType {
  HOUSE = 'Casa',
  SHOP = 'Loja',
  TAVERN = 'Taverna',
  TEMPLE = 'Templo',
  TOWER = 'Torre',
  FORTRESS = 'Fortaleza',
  MARKET = 'Mercado'
}

export enum DistrictType {
  RESIDENTIAL = 'Residencial',
  COMMERCIAL = 'Comercial',
  INDUSTRIAL = 'Industrial',
  NOBLE = 'Nobre',
  TEMPLE = 'Templo',
  MILITARY = 'Militar'
}

export enum FloorLayout {
  LINEAR = 'Linear',
  BRANCHING = 'Ramificado',
  MAZE = 'Labirinto',
  ARENA = 'Arena',
  OPEN = 'Aberto'
}

export enum EncounterType {
  TRASH = 'Trash',
  ELITE = 'Elite',
  CHAMPION = 'Campeão',
  BOSS = 'Chefe',
  PUZZLE = 'Quebra-cabeça',
  EVENT = 'Evento'
}

export enum PuzzleType {
  LEVER = 'Alavanca',
  BUTTON = 'Botão',
  SEQUENCE = 'Sequência',
  MAZE = 'Labirinto',
  RIDDLE = 'Enigma',
  TIMED = 'Temporizado'
}

export enum MechanicType {
  DAMAGE = 'Dano',
  HEAL = 'Cura',
  CROWD_CONTROL = 'Controle de Massa',
  MOVEMENT = 'Movimento',
  ENVIRONMENTAL = 'Ambiental',
  PUZZLE = 'Quebra-cabeça'
}

export enum LockoutType {
  DAILY = 'Diário',
  WEEKLY = 'Semanal',
  MONTHLY = 'Mensal',
  ONCE = 'Único'
}

export enum RequirementType {
  LEVEL = 'Nível',
  RANK = 'Rank',
  QUEST = 'Quest',
  ITEM = 'Item',
  REPUTATION = 'Reputação',
  SKILL = 'Habilidade'
}

export enum SpawnType {
  FIXED = 'Fixo',
  RANDOM = 'Aleatório',
  SCHEDULED = 'Agendado',
  TRIGGERED = 'Acionado'
}

export enum SpawnSchedule {
  DAILY = 'Diário',
  WEEKLY = 'Semanal',
  MONTHLY = 'Mensal',
  RANDOM = 'Aleatório'
}

export enum ConditionType {
  LEVEL = 'Nível',
  CLASS = 'Classe',
  RANK = 'Rank',
  TIME = 'Tempo',
  WEATHER = 'Clima',
  EVENT = 'Evento'
}

export enum ObjectiveType {
  KILL = 'Matar',
  COLLECT = 'Coletar',
  ACTIVATE = 'Ativar',
  PROTECT = 'Proteger',
  ESCORT = 'Escoltar',
  SURVIVE = 'Sobreviver'
}

export enum ChangeType {
  DAMAGE = 'Dano',
  COOLDOWN = 'Cooldown',
  RANGE = 'Alcance',
  AREA = 'Área',
  EFFECT = 'Efeito'
}

export enum VisualType {
  MODEL = 'Modelo',
  COLOR = 'Cor',
  SIZE = 'Tamanho',
  PARTICLE = 'Partícula',
  LIGHT = 'Luz'
}

export enum ChestType {
  COMMON = 'Comum',
  RARE = 'Raro',
  EPIC = 'Épico',
  LEGENDARY = 'Lendário',
  TRAPPED = 'Armadilhada',
  LOCKED = 'Trancada'
}

export interface BankService {
  id: string;
  name: string;
  position: Position;
  maxSlots: number;
  fee: number;
}

export interface MailboxService {
  id: string;
  name: string;
  position: Position;
  maxMail: number;
}
export enum RoomType {
  BASIC = 'Básico',
  COMFORTABLE = 'Confortável',
  DELUXE = 'Luxo',
  SUITE = 'Suíte'
}

export interface InnRoom {
  type: RoomType;
  price: number;
  duration: number;
  amenities: InnService[];
}

export interface VendorItem {
  itemId: string;
  price: number;
  stock: number;
  restockTime: number;
  reputationRequired?: ReputationLevel;
}

export interface InnRoom {
  type: RoomType;
  price: number;
  duration: number;
  amenities: InnService[];
}
