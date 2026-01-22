import { Rank, PlayerStats, Player, PlayerSkill, Skill } from '../types';

export interface RankRequirement {
  rank: Rank;
  minXP: number;
  minPI: number;
  minLevel: number;
  requiredQuests?: string[];
}

export interface LevelUpReward {
  statPoints: number;
  skillPoints: number;
  hpBonus: number;
  eneBonus: number;
}

export class ProgressionSystem {
  // Requisitos para cada Rank (baseado nos PDFs)
  private readonly RANK_REQUIREMENTS: Record<Rank, RankRequirement> = {
    [Rank.A]: { rank: Rank.A, minXP: 0, minPI: 10, minLevel: 1 },
    [Rank.B]: { rank: Rank.B, minXP: 100, minPI: 15, minLevel: 5 },
    [Rank.C]: { rank: Rank.C, minXP: 250, minPI: 22, minLevel: 10 },
    [Rank.D]: { rank: Rank.D, minXP: 500, minPI: 30, minLevel: 15 },
    [Rank.E]: { rank: Rank.E, minXP: 900, minPI: 40, minLevel: 20 },
    [Rank.F]: { rank: Rank.F, minXP: 1500, minPI: 52, minLevel: 25 },
    [Rank.G]: { rank: Rank.G, minXP: 2300, minPI: 65, minLevel: 30 },
    [Rank.H]: { rank: Rank.H, minXP: 3400, minPI: 80, minLevel: 35 },
    [Rank.I]: { rank: Rank.I, minXP: 4800, minPI: 97, minLevel: 40 },
    [Rank.J]: { rank: Rank.J, minXP: 6600, minPI: 115, minLevel: 45 },
    [Rank.K]: { rank: Rank.K, minXP: 8800, minPI: 135, minLevel: 50 },
    [Rank.L]: { rank: Rank.L, minXP: 11500, minPI: 156, minLevel: 55 },
    [Rank.M]: { rank: Rank.M, minXP: 14800, minPI: 179, minLevel: 60 },
    [Rank.N]: { rank: Rank.N, minXP: 18800, minPI: 203, minLevel: 65 },
    [Rank.O]: { rank: Rank.O, minXP: 23600, minPI: 229, minLevel: 70 },
    [Rank.P]: { rank: Rank.P, minXP: 29300, minPI: 256, minLevel: 75 },
    [Rank.Q]: { rank: Rank.Q, minXP: 36000, minPI: 285, minLevel: 80 },
    [Rank.R]: { rank: Rank.R, minXP: 43800, minPI: 315, minLevel: 85 },
    [Rank.S]: { rank: Rank.S, minXP: 52800, minPI: 347, minLevel: 90 },
    [Rank.T]: { rank: Rank.T, minXP: 63100, minPI: 380, minLevel: 95 },
    [Rank.U]: { rank: Rank.U, minXP: 74800, minPI: 415, minLevel: 100 },
    [Rank.V]: { rank: Rank.V, minXP: 88000, minPI: 451, minLevel: 105 },
    [Rank.W]: { rank: Rank.W, minXP: 102800, minPI: 489, minLevel: 110 },
    [Rank.X]: { rank: Rank.X, minXP: 119300, minPI: 528, minLevel: 115 },
    [Rank.Y]: { rank: Rank.Y, minXP: 137800, minPI: 569, minLevel: 120 },
    [Rank.Z]: { rank: Rank.Z, minXP: 158500, minPI: 611, minLevel: 125 }
  };

  // XP necessário para cada nível
  private readonly LEVEL_XP_REQUIREMENTS: number[] = (() => {
    const requirements = [0]; // Level 1 = 0 XP
    for (let i = 2; i <= 125; i++) {
      // Fórmula: XP = base * (1.15^(level-1))
      const baseXP = 100;
      const xp = Math.floor(baseXP * Math.pow(1.15, i - 2));
      requirements.push(requirements[i - 1] + xp);
    }
    return requirements;
  })();

  // Recompensas por level up
  private readonly LEVEL_UP_REWARDS: Record<number, LevelUpReward> = (() => {
    const rewards: Record<number, LevelUpReward> = {};
    for (let i = 1; i <= 125; i++) {
      rewards[i] = {
        statPoints: i % 5 === 0 ? 3 : 2, // +1 ponto extra a cada 5 níveis
        skillPoints: i % 10 === 0 ? 2 : 1, // +1 ponto extra a cada 10 níveis
        hpBonus: Math.floor(10 * (1 + i * 0.1)),
        eneBonus: Math.floor(5 * (1 + i * 0.08))
      };
    }
    return rewards;
  })();

  /**
   * Verifica se um jogador pode subir de nível
   */
  public canLevelUp(player: Player): boolean {
    const currentLevelXP = this.LEVEL_XP_REQUIREMENTS[player.level - 1] || 0;
    const nextLevelXP = this.LEVEL_XP_REQUIREMENTS[player.level] || Infinity;
    return player.xp >= nextLevelXP;
  }

  /**
   * Faz o level up de um jogador
   */
  public levelUp(player: Player, statAllocation?: Partial<PlayerStats>): Player {
    if (!this.canLevelUp(player)) {
      throw new Error('Player cannot level up');
    }

    const newLevel = player.level + 1;
    const rewards = this.LEVEL_UP_REWARDS[newLevel];

    // Aplica bônus base
    let newStats = { ...player.stats };
    newStats.hp += rewards.hpBonus;
    newStats.ene += rewards.eneBonus;

    // Aplica alocação de stats se fornecida
    if (statAllocation) {
      const totalPoints = Object.values(statAllocation).reduce((sum, val) => sum + (val || 0), 0);
      if (totalPoints > rewards.statPoints) {
        throw new Error(`Cannot allocate more than ${rewards.statPoints} stat points`);
      }

      Object.entries(statAllocation).forEach(([stat, value]) => {
        if (value && stat in newStats) {
          (newStats as any)[stat] += value;
        }
      });
    }

    return {
      ...player,
      level: newLevel,
      stats: newStats,
      updatedAt: new Date()
    };
  }

  /**
   * Verifica se um jogador pode subir de Rank
   */
  public canRankUp(player: Player, completedQuests: string[] = []): boolean {
    const currentRank = player.rank;
    const rankOrder = Object.values(Rank);
    const currentIndex = rankOrder.indexOf(currentRank);
    
    if (currentIndex >= rankOrder.length - 1) {
      return false; // Já está no Rank máximo
    }

    const nextRankName = rankOrder[currentIndex + 1];
    const requirements = this.RANK_REQUIREMENTS[nextRankName];

    const meetsRequirements = 
      player.level >= requirements.minLevel &&
      player.xp >= requirements.minXP &&
      player.stats.pi >= requirements.minPI;

    const meetsQuestRequirements = 
      !requirements.requiredQuests || 
      requirements.requiredQuests.every(questId => completedQuests.includes(questId));

    return meetsRequirements && meetsQuestRequirements;
  }

  /**
   * Faz o Rank Up de um jogador
   */
  public rankUp(player: Player): Player {
    if (!this.canRankUp(player)) {
      throw new Error('Player cannot rank up');
    }

    const currentRank = player.rank;
    const rankOrder = Object.values(Rank);
    const currentIndex = rankOrder.indexOf(currentRank);
    const nextRank = rankOrder[currentIndex + 1];

    // Recalcula stats base para o novo Rank
    const baseStats = this.calculateBaseStats(nextRank, player.level);
    
    // Preserva progresso de habilidades e inventário
    const updatedPlayer = {
      ...player,
      rank: nextRank,
      stats: {
        ...baseStats,
        // Preserva PI atual se for maior
        pi: Math.max(baseStats.pi, player.stats.pi)
      },
      updatedAt: new Date()
    };

    return updatedPlayer;
  }

  /**
   * Calcula Pontos de Impacto (PI) baseados nos stats do jogador
   */
  public calculatePI(stats: PlayerStats): number {
    // Fórmula: PI = (HP/10) + (ENE/5) + ATQ + DEF + MAG + (RES*2) + (AGI*1.5) + (VEL*1.2)
    return Math.floor(
      (stats.hp / 10) +
      (stats.ene / 5) +
      stats.atq +
      stats.def +
      stats.mag +
      (stats.res * 2) +
      (stats.agi * 1.5) +
      (stats.vel * 1.2)
    );
  }

  /**
   * Calcula stats base para um Rank e Level específicos
   */
  public calculateBaseStats(rank: Rank, level: number): PlayerStats {
    // Multiplicadores base para cada Rank
    const rankMultipliers: Record<Rank, { hp: number; ene: number; atq: number }> = {
      [Rank.A]: { hp: 1.0, ene: 1.0, atq: 1.0 },
      [Rank.B]: { hp: 1.1, ene: 1.08, atq: 1.12 },
      [Rank.C]: { hp: 1.2, ene: 1.16, atq: 1.24 },
      [Rank.D]: { hp: 1.3, ene: 1.24, atq: 1.36 },
      [Rank.E]: { hp: 1.4, ene: 1.32, atq: 1.48 },
      [Rank.F]: { hp: 1.5, ene: 1.40, atq: 1.60 },
      [Rank.G]: { hp: 1.6, ene: 1.48, atq: 1.72 },
      [Rank.H]: { hp: 1.7, ene: 1.56, atq: 1.84 },
      [Rank.I]: { hp: 1.8, ene: 1.64, atq: 1.96 },
      [Rank.J]: { hp: 1.9, ene: 1.72, atq: 2.08 },
      [Rank.K]: { hp: 2.0, ene: 1.80, atq: 2.20 },
      [Rank.L]: { hp: 2.1, ene: 1.88, atq: 2.32 },
      [Rank.M]: { hp: 2.2, ene: 1.96, atq: 2.44 },
      [Rank.N]: { hp: 2.3, ene: 2.04, atq: 2.56 },
      [Rank.O]: { hp: 2.4, ene: 2.12, atq: 2.68 },
      [Rank.P]: { hp: 2.5, ene: 2.20, atq: 2.80 },
      [Rank.Q]: { hp: 2.6, ene: 2.28, atq: 2.92 },
      [Rank.R]: { hp: 2.7, ene: 2.36, atq: 3.04 },
      [Rank.S]: { hp: 2.8, ene: 2.44, atq: 3.16 },
      [Rank.T]: { hp: 2.9, ene: 2.52, atq: 3.28 },
      [Rank.U]: { hp: 3.0, ene: 2.60, atq: 3.40 },
      [Rank.V]: { hp: 3.1, ene: 2.68, atq: 3.52 },
      [Rank.W]: { hp: 3.2, ene: 2.76, atq: 3.64 },
      [Rank.X]: { hp: 3.3, ene: 2.84, atq: 3.76 },
      [Rank.Y]: { hp: 3.4, ene: 2.92, atq: 3.88 },
      [Rank.Z]: { hp: 3.5, ene: 3.00, atq: 4.00 }
    };

    const multiplier = rankMultipliers[rank];
    const levelMultiplier = 1 + (level - 1) * 0.1;

    const baseHP = Math.floor(100 * multiplier.hp * levelMultiplier);
    const baseENE = Math.floor(50 * multiplier.ene * (1 + (level - 1) * 0.08));
    const baseATQ = Math.floor(10 * multiplier.atq * (1 + (level - 1) * 0.12));

    const stats: PlayerStats = {
      pi: this.RANK_REQUIREMENTS[rank].minPI,
      hp: baseHP,
      ene: baseENE,
      atq: baseATQ,
      def: Math.floor(baseATQ * 0.6),
      mag: Math.floor(baseATQ * 0.5),
      res: Math.floor(baseATQ * 0.4),
      agi: Math.floor(baseATQ * 0.7),
      vel: Math.floor(baseATQ * 0.8),
      fat: 0
    };

    // Recalcula PI com os stats finais
    stats.pi = this.calculatePI(stats);

    return stats;
  }

  /**
   * Verifica se uma habilidade pode ser desbloqueada
   */
  public canUnlockSkill(player: Player, skill: Skill, playerSkills: PlayerSkill[]): boolean {
    // Verifica Rank requerido
    const rankOrder = Object.values(Rank);
    const playerRankIndex = rankOrder.indexOf(player.rank);
    const skillRankIndex = rankOrder.indexOf(skill.requiredRank);
    
    if (playerRankIndex < skillRankIndex) {
      return false;
    }

    // Verifica se já não possui a habilidade
    const hasSkill = playerSkills.some(ps => ps.skillId === skill.id);
    if (hasSkill) {
      return false;
    }

    // Verifica se tem Tier disponível (simplificado)
    const skillsOfSameTier = playerSkills.filter(ps => {
      // Aqui você precisaria buscar a skill para verificar o tier
      return true; // Simplificado para exemplo
    });

    return true;
  }

  /**
   * Adiciona experiência ao jogador
   */
  public addExperience(player: Player, xpGained: number): { updatedPlayer: Player; leveledUp: boolean; rankedUp: boolean } {
    const newXP = player.xp + xpGained;
    let updatedPlayer = { ...player, xp: newXP };
    let leveledUp = false;
    let rankedUp = false;

    // Verifica múltiplos level ups
    while (this.canLevelUp(updatedPlayer)) {
      updatedPlayer = this.levelUp(updatedPlayer);
      leveledUp = true;
    }

    // Verifica Rank Up
    if (this.canRankUp(updatedPlayer)) {
      updatedPlayer = this.rankUp(updatedPlayer);
      rankedUp = true;
    }

    return { updatedPlayer, leveledUp, rankedUp };
  }

  /**
   * Obtém progresso para o próximo nível
   */
  public getLevelProgress(player: Player): { current: number; required: number; percentage: number } {
    const currentLevelXP = this.LEVEL_XP_REQUIREMENTS[player.level - 1] || 0;
    const nextLevelXP = this.LEVEL_XP_REQUIREMENTS[player.level] || Infinity;
    
    const current = player.xp - currentLevelXP;
    const required = nextLevelXP - currentLevelXP;
    const percentage = Math.min(100, (current / required) * 100);

    return { current, required, percentage };
  }

  /**
   * Obtém progresso para o próximo Rank
   */
  public getRankProgress(player: Player): { currentXP: number; requiredXP: number; currentPI: number; requiredPI: number; canRankUp: boolean } {
    const currentRank = player.rank;
    const rankOrder = Object.values(Rank);
    const currentIndex = rankOrder.indexOf(currentRank);
    
    if (currentIndex >= rankOrder.length - 1) {
      return { 
        currentXP: player.xp, 
        requiredXP: player.xp, 
        currentPI: player.stats.pi, 
        requiredPI: player.stats.pi, 
        canRankUp: false 
      };
    }

    const nextRank = rankOrder[currentIndex + 1];
    const requirements = this.RANK_REQUIREMENTS[nextRank];

    return {
      currentXP: player.xp,
      requiredXP: requirements.minXP,
      currentPI: player.stats.pi,
      requiredPI: requirements.minPI,
      canRankUp: this.canRankUp(player)
    };
  }
}
