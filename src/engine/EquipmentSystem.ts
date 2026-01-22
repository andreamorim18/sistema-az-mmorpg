import { Player, PlayerStats } from '../types';
import { PlayerClass } from '../types/classes';
import {
  Equipment,
  EquipmentStats,
  PlayerEquipment,
  EquipmentSet,
  EquipmentSetBonus,
  Gem,
  SocketedEquipment,
  EquipmentRarity,
  ItemTier,
  EquipmentType,
  EquipmentSlot,
  TIER_MULTIPLIERS,
  RARITY_PROPERTIES,
  PREDEFINED_EQUIPMENT,
  PREDEFINED_GEMS,
  EQUIPMENT_SETS
} from '../types/equipment';

export interface EquipmentGenerationOptions {
  tier: ItemTier;
  rarity: EquipmentRarity;
  requiredLevel: number;
  equipmentType: EquipmentType;
  slot?: EquipmentSlot;
  requiredClass?: PlayerClass;
}

export interface EquipmentComparison {
  oldItem: Equipment | null;
  newItem: Equipment;
  statDifferences: Partial<EquipmentStats>;
  upgrade: boolean;
  scoreDifference: number;
}

export class EquipmentSystem {
  /**
   * Gera um equipamento aleatório baseado nas opções
   */
  public generateEquipment(options: EquipmentGenerationOptions): Equipment {
    const tierInfo = TIER_MULTIPLIERS[options.tier];
    const rarityInfo = RARITY_PROPERTIES[options.rarity];
    
    // Base stats do tipo de equipamento
    const baseStats = this.getBaseStatsForType(options.equipmentType, options.slot);
    
    // Aplica multiplicadores de tier e raridade
    const scaledStats = this.scaleStats(baseStats, tierInfo.statMultiplier, rarityInfo.statBonus);
    
    // Adiciona stats aleatórios se a raridade permitir
    const randomStats = this.generateRandomStats(options.rarity, options.tier);
    
    const equipment: Equipment = {
      id: this.generateEquipmentId(),
      name: this.generateEquipmentName(options),
      description: this.generateEquipmentDescription(options),
      type: options.equipmentType,
      rarity: options.rarity,
      tier: options.tier,
      requiredLevel: options.requiredLevel,
      requiredClass: options.requiredClass,
      slot: options.slot || this.getDefaultSlot(options.equipmentType),
      baseStats: scaledStats,
      randomStats: randomStats || undefined,
      sockets: rarityInfo.sockets,
      value: this.calculateEquipmentValue(scaledStats, options),
      lore: this.generateLore(options)
    };

    return equipment;
  }

  /**
   * Equipa um item no jogador
   */
  public equipItem(player: Player, equipment: Equipment): {
    success: boolean;
    message: string;
    updatedPlayer: Player;
    unequippedItem?: Equipment;
  } {
    // Verifica se pode equipar
    const canEquip = this.canEquipItem(player, equipment);
    if (!canEquip.canEquip) {
      return {
        success: false,
        message: canEquip.reason,
        updatedPlayer: player
      };
    }

    // Remove item atual do slot (se houver)
    const currentEquipment = player.inventory.find(item => 
      item.equipped && this.getEquipmentSlot(item.itemId) === equipment.slot
    );

    // Atualiza inventário
    let updatedInventory = [...player.inventory];
    
    // Remove item do inventário (vai ser equipado)
    const itemToEquipIndex = updatedInventory.findIndex(item => item.itemId === equipment.id);
    if (itemToEquipIndex === -1) {
      return {
        success: false,
        message: 'Item não encontrado no inventário',
        updatedPlayer: player
      };
    }

    // Desequipa item atual se houver
    let unequippedItem: Equipment | undefined;
    if (currentEquipment) {
      const currentIndex = updatedInventory.findIndex(item => item.itemId === currentEquipment.itemId);
      if (currentIndex !== -1) {
        updatedInventory[currentIndex] = {
          ...updatedInventory[currentIndex],
          equipped: false
        };
        unequippedItem = this.findEquipmentById(currentEquipment.itemId) || undefined;
      }
    }

    // Equipa novo item
    updatedInventory[itemToEquipIndex] = {
      ...updatedInventory[itemToEquipIndex],
      equipped: true
    };

    const updatedPlayer = {
      ...player,
      inventory: updatedInventory,
      updatedAt: new Date()
    };

    return {
      success: true,
      message: `${equipment.name} equipado com sucesso!`,
      updatedPlayer,
      unequippedItem
    };
  }

  /**
   * Calcula stats efetivos do jogador com equipamentos
   */
  public calculateEffectiveStats(player: Player): PlayerStats {
    const equippedItems = this.getEquippedItems(player);
    let effectiveStats = { ...player.stats };

    // Aplica stats de cada equipamento
    equippedItems.forEach(item => {
      const equipment = this.findEquipmentById(item.itemId);
      if (equipment) {
        // Stats base
        this.applyStatsToPlayer(effectiveStats, equipment.baseStats);
        
        // Stats aleatórios
        if (equipment.randomStats) {
          this.applyStatsToPlayer(effectiveStats, equipment.randomStats);
        }
      }
    });

    // Aplica bônus de sets
    const setBonuses = this.getSetBonuses(equippedItems);
    setBonuses.forEach(bonus => {
      this.applyStatsToPlayer(effectiveStats, bonus.bonus);
    });

    // Recalcula PI
    effectiveStats.pi = this.calculatePI(effectiveStats);

    return effectiveStats;
  }

  /**
   * Compara dois equipamentos
   */
  public compareEquipment(
    oldItem: Equipment | null,
    newItem: Equipment,
    playerStats: PlayerStats
  ): EquipmentComparison {
    const oldStats = oldItem ? this.getTotalStats(oldItem) : {};
    const newStats = this.getTotalStats(newItem);

    const statDifferences: Partial<EquipmentStats> = {};
    let upgrade = false;

    // Compara cada stat
    Object.keys(newStats).forEach(stat => {
      const statKey = stat as keyof EquipmentStats;
      const oldValue = (oldStats as any)[statKey] || 0;
      const newValue = (newStats as any)[statKey] || 0;
      
      const difference = newValue - oldValue;
      if (difference !== 0) {
        (statDifferences as any)[statKey] = difference;
        if (difference > 0) upgrade = true;
      }
    });

    const oldScore = oldItem ? this.calculateEquipmentScore(oldItem, playerStats) : 0;
    const newScore = this.calculateEquipmentScore(newItem, playerStats);

    return {
      oldItem,
      newItem,
      statDifferences,
      upgrade,
      scoreDifference: newScore - oldScore
    };
  }

  /**
   * Insere uma gema em um equipamento
   */
  public socketGem(
    equipment: Equipment,
    gem: Gem,
    socketIndex: number
  ): { success: boolean; message: string; updatedEquipment?: Equipment } {
    if (!equipment.sockets || equipment.sockets === 0) {
      return {
        success: false,
        message: 'Este equipamento não possui soquetes'
      };
    }

    if (socketIndex >= equipment.sockets) {
      return {
        success: false,
        message: 'Índice de soquete inválido'
      };
    }

    // Em uma implementação real, precisaríamos gerenciar soquetes
    // Por ora, vamos retornar sucesso
    return {
      success: true,
      message: `${gem.name} inserida com sucesso!`
    };
  }

  /**
   * Obtém bônus de sets equipados
   */
  public getSetBonuses(equippedItems: any[]): EquipmentSetBonus[] {
    const setCounts: Record<string, number> = {};
    const bonuses: EquipmentSetBonus[] = [];

    // Conta peças de cada set
    equippedItems.forEach(item => {
      const equipment = this.findEquipmentById(item.itemId);
      if (equipment?.setBonus) {
        setCounts[equipment.setBonus] = (setCounts[equipment.setBonus] || 0) + 1;
      }
    });

    // Obtém bônus disponíveis para cada set
    Object.entries(setCounts).forEach(([setId, pieceCount]) => {
      const set = EQUIPMENT_SETS.find(s => s.id === setId);
      if (set) {
        set.bonuses
          .filter(bonus => bonus.piecesRequired <= pieceCount)
          .forEach(bonus => bonuses.push(bonus));
      }
    });

    return bonuses;
  }

  /**
   * Verifica se um jogador pode equipar um item
   */
  private canEquipItem(player: Player, equipment: Equipment): {
    canEquip: boolean;
    reason: string;
  } {
    // Verifica nível
    if (player.level < equipment.requiredLevel) {
      return {
        canEquip: false,
        reason: `Nível ${equipment.requiredLevel} necessário`
      };
    }

    // Verifica classe
    if (equipment.requiredClass) {
      // Em uma implementação real, verificaríamos a classe do jogador
      // Por ora, vamos assumir que pode equipar
    }

    // Verifica se já tem um item equipado no mesmo slot
    const hasEquippedInSlot = player.inventory.some(item => 
      item.equipped && this.getEquipmentSlot(item.itemId) === equipment.slot
    );

    return {
      canEquip: true,
      reason: hasEquippedInSlot ? 'Item atual será substituído' : 'Pode equipar'
    };
  }

  /**
   * Obtém stats base para tipo de equipamento
   */
  private getBaseStatsForType(
    equipmentType: EquipmentType,
    slot?: EquipmentSlot
  ): Partial<EquipmentStats> {
    // Stats base por tipo
    const typeStats: Partial<EquipmentStats> = {};
    
    switch (equipmentType) {
      case EquipmentType.WEAPON:
        return {
          atq: 10,
          crit: 2,
          attack_speed: 100
        };
      case EquipmentType.ARMOR:
        return {
          def: 8,
          hp: 15,
          res: 3
        };
      case EquipmentType.ACCESSORY:
        return {
          agi: 3,
          vel: 2,
          crit: 1
        };
    }

    return typeStats;
  }

  /**
   * Escala stats baseado em multiplicadores
   */
  private scaleStats(
    baseStats: Partial<EquipmentStats>,
    tierMultiplier: number,
    rarityBonus: number
  ): EquipmentStats {
    const scaledStats: EquipmentStats = {};

    Object.entries(baseStats).forEach(([stat, value]) => {
      if (value !== undefined) {
        (scaledStats as any)[stat] = Math.floor(value * tierMultiplier * rarityBonus);
      }
    });

    return scaledStats;
  }

  /**
   * Gera stats aleatórios baseado na raridade
   */
  private generateRandomStats(
    rarity: EquipmentRarity,
    tier: ItemTier
  ): Partial<EquipmentStats> | null {
    const rarityInfo = RARITY_PROPERTIES[rarity];
    if (rarityInfo.randomStats === 0) return null;

    const randomStats: Partial<EquipmentStats> = {};
    const possibleStats = [
      'hp', 'ene', 'atq', 'def', 'mag', 'res', 'agi', 'vel',
      'crit', 'crit_damage', 'dodge', 'healing', 'spell_damage'
    ];

    // Seleciona stats aleatórios
    for (let i = 0; i < rarityInfo.randomStats; i++) {
      const randomStat = possibleStats[Math.floor(Math.random() * possibleStats.length)];
      const value = Math.floor(Math.random() * 10) + 1; // 1-10
      
      (randomStats as any)[randomStat] = ((randomStats as any)[randomStat] || 0) + value;
    }

    return randomStats;
  }

  /**
   * Aplica stats ao jogador
   */
  private applyStatsToPlayer(
    playerStats: PlayerStats,
    equipmentStats: Partial<EquipmentStats>
  ): void {
    Object.entries(equipmentStats).forEach(([stat, value]) => {
      if (value !== undefined && stat in playerStats) {
        (playerStats as any)[stat] += value;
      }
    });
  }

  /**
   * Obtém itens equipados do jogador
   */
  private getEquippedItems(player: Player): any[] {
    return player.inventory.filter(item => item.equipped);
  }

  /**
   * Obtém todos os stats de um equipamento (base + aleatórios)
   */
  private getTotalStats(equipment: Equipment): EquipmentStats {
    const totalStats: EquipmentStats = { ...equipment.baseStats };
    
    if (equipment.randomStats) {
      Object.entries(equipment.randomStats).forEach(([stat, value]) => {
        if (value !== undefined) {
          (totalStats as any)[stat] += value;
        }
      });
    }

    return totalStats;
  }

  /**
   * Calcula score de um equipamento para comparação
   */
  private calculateEquipmentScore(
    equipment: Equipment,
    playerStats: PlayerStats
  ): number {
    const stats = this.getTotalStats(equipment);
    let score = 0;

    // Pondera stats baseado na classe do jogador (simplificado)
    const weights = {
      hp: 1,
      ene: 0.8,
      atq: 2,
      def: 1.5,
      mag: 2,
      res: 1.2,
      agi: 1.8,
      vel: 1.3,
      crit: 3,
      crit_damage: 2,
      dodge: 2.5,
      healing: 2.5,
      spell_damage: 2.2
    };

    Object.entries(stats).forEach(([stat, value]) => {
      if (value !== undefined) {
        const weight = (weights as any)[stat] || 1;
        score += value * weight;
      }
    });

    // Bônus por raridade e tier
    const rarityBonus = RARITY_PROPERTIES[equipment.rarity].valueMultiplier;
    const tierBonus = TIER_MULTIPLIERS[equipment.tier].statMultiplier;

    return Math.floor(score * rarityBonus * tierBonus);
  }

  /**
   * Calcula valor do equipamento
   */
  private calculateEquipmentValue(
    stats: EquipmentStats,
    options: EquipmentGenerationOptions
  ): number {
    const tierInfo = TIER_MULTIPLIERS[options.tier];
    const rarityInfo = RARITY_PROPERTIES[options.rarity];

    let baseValue = 0;
    Object.values(stats).forEach(value => {
      if (value !== undefined) {
        baseValue += value;
      }
    });

    return Math.floor(baseValue * tierInfo.valueMultiplier * rarityInfo.valueMultiplier);
  }

  /**
   * Gera ID único para equipamento
   */
  private generateEquipmentId(): string {
    return `equip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Gera nome para equipamento
   */
  private generateEquipmentName(options: EquipmentGenerationOptions): string {
    const tierNames = {
      [ItemTier.TIER_1]: 'de Ferro',
      [ItemTier.TIER_2]: 'de Aço',
      [ItemTier.TIER_3]: 'de Mithril',
      [ItemTier.TIER_4]: 'de Adamantina',
      [ItemTier.TIER_5]: 'Dragônico'
    };

    const rarityPrefixes = {
      [EquipmentRarity.COMMON]: '',
      [EquipmentRarity.UNCOMMON]: 'Superior ',
      [EquipmentRarity.RARE]: 'Excelente ',
      [EquipmentRarity.EPIC]: 'Épico ',
      [EquipmentRarity.LEGENDARY]: 'Lendário ',
      [EquipmentRarity.MYTHIC]: 'Mítico '
    };

    const typeNames = {
      [EquipmentType.WEAPON]: 'Arma',
      [EquipmentType.ARMOR]: 'Armadura',
      [EquipmentType.ACCESSORY]: 'Acessório'
    };

    return `${rarityPrefixes[options.rarity]}${typeNames[options.equipmentType]} ${tierNames[options.tier]}`;
  }

  /**
   * Gera descrição para equipamento
   */
  private generateEquipmentDescription(options: EquipmentGenerationOptions): string {
    const rarityDescriptions = {
      [EquipmentRarity.COMMON]: 'Um item comum e funcional.',
      [EquipmentRarity.UNCOMMON]: 'Um item de qualidade superior.',
      [EquipmentRarity.RARE]: 'Um item raro com propriedades especiais.',
      [EquipmentRarity.EPIC]: 'Um item épico com grande poder.',
      [EquipmentRarity.LEGENDARY]: 'Um item lendário de imenso valor.',
      [EquipmentRarity.MYTHIC]: 'Um item mítico de poder incomparável.'
    };

    return rarityDescriptions[options.rarity];
  }

  /**
   * Gera lore para equipamento
   */
  private generateLore(options: EquipmentGenerationOptions): string {
    const tierLore = {
      [ItemTier.TIER_1]: 'Forjado com materiais básicos, servindo aos aventureiros iniciantes.',
      [ItemTier.TIER_2]: 'Criado por artesãos habilidosos, oferece proteção confiável.',
      [ItemTier.TIER_3]: 'Forjado com metais raros, possui qualidades excepcionais.',
      [ItemTier.TIER_4]: 'Criado com materiais lendários, quase indestrutível.',
      [ItemTier.TIER_5]: 'Forjado com essência elemental, transcende os limites mortais.'
    };

    return tierLore[options.tier];
  }

  /**
   * Obtém slot padrão para tipo de equipamento
   */
  private getDefaultSlot(equipmentType: EquipmentType): EquipmentSlot {
    switch (equipmentType) {
      case EquipmentType.WEAPON:
        return EquipmentSlot.WEAPON;
      case EquipmentType.ARMOR:
        return EquipmentSlot.CHEST;
      case EquipmentType.ACCESSORY:
        return EquipmentSlot.RING1;
      default:
        return EquipmentSlot.WEAPON;
    }
  }

  /**
   * Obtém slot de um equipamento pelo ID
   */
  private getEquipmentSlot(equipmentId: string): EquipmentSlot | null {
    const equipment = this.findEquipmentById(equipmentId);
    return equipment?.slot || null;
  }

  /**
   * Encontra equipamento pelo ID (em uma implementação real, buscaria no database)
   */
  private findEquipmentById(equipmentId: string): Equipment | null {
    return PREDEFINED_EQUIPMENT.find(eq => eq.id === equipmentId) || null;
  }

  /**
   * Calcula Pontos de Impacto
   */
  private calculatePI(stats: PlayerStats): number {
    return Math.floor(
      (stats.hp / 10) +
      (stats.ene / 5) +
      stats.atq +
      stats.def +
      stats.mag +
      (stats.res * 2) +
      (stats.agi * 1.5) +
      (stats.vel * 1.2) +
      ((stats.crit || 0) * 2) +
      ((stats.crit_damage || 0) / 10) +
      ((stats.dodge || 0) * 1.5) +
      ((stats.spell_damage || 0) / 5) +
      ((stats.healing || 0) / 3)
    );
  }

  /**
   * Obtém todos os equipamentos pré-definidos
   */
  public getAllPredefinedEquipment(): Equipment[] {
    return PREDEFINED_EQUIPMENT;
  }

  /**
   * Obtém todas as gemas pré-definidas
   */
  public getAllPredefinedGems(): Gem[] {
    return PREDEFINED_GEMS;
  }

  /**
   * Obtém todos os sets de equipamento
   */
  public getAllEquipmentSets(): EquipmentSet[] {
    return EQUIPMENT_SETS;
  }
}
