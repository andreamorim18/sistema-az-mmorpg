import { Player, PlayerStats } from '../types';
import { PlayerClass, ClassSkill, SkillType } from '../types/classes';
import { ElementalSchool, Rank } from '../types';

// Interfaces locais para evitar problemas de importação
export interface CombatResult {
  attacker: string;
  defender: string;
  damage: number;
  damageType: ElementalSchool;
  critical: boolean;
  blocked: boolean;
  dodged: boolean;
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
  TAUNT = 'Provocação',
  BUFF = 'Buff',
  DEBUFF = 'Debuff'
}

export class CombatEngine {
  // Fórmulas base do Sistema A-Z
  // $Dano = Dado + (ATQ / 5)
  private readonly BASE_DAMAGE_FORMULA = (attack: number, diceRoll: number): number => {
    return diceRoll + Math.floor(attack / 5);
  };

  // Fórmula de HP baseada no Rank
  private readonly HP_FORMULA = (rank: Rank, level: number): number => {
    const rankMultipliers: Record<Rank, number> = {
      'A': 1.0, 'B': 1.1, 'C': 1.2, 'D': 1.3, 'E': 1.4, 'F': 1.5,
      'G': 1.6, 'H': 1.7, 'I': 1.8, 'J': 1.9, 'K': 2.0, 'L': 2.1,
      'M': 2.2, 'N': 2.3, 'O': 2.4, 'P': 2.5, 'Q': 2.6, 'R': 2.7,
      'S': 2.8, 'T': 2.9, 'U': 3.0, 'V': 3.1, 'W': 3.2, 'X': 3.3,
      'Y': 3.4, 'Z': 3.5
    };
    return Math.floor(100 * rankMultipliers[rank] * (1 + (level - 1) * 0.1));
  };

  // Fórmula de Energia baseada no Rank
  private readonly ENE_FORMULA = (rank: Rank, level: number): number => {
    const rankMultipliers: Record<Rank, number> = {
      'A': 1.0, 'B': 1.08, 'C': 1.16, 'D': 1.24, 'E': 1.32, 'F': 1.40,
      'G': 1.48, 'H': 1.56, 'I': 1.64, 'J': 1.72, 'K': 1.80, 'L': 1.88,
      'M': 1.96, 'N': 2.04, 'O': 2.12, 'P': 2.20, 'Q': 2.28, 'R': 2.36,
      'S': 2.44, 'T': 2.52, 'U': 2.60, 'V': 2.68, 'W': 2.76, 'X': 2.84,
      'Y': 2.92, 'Z': 3.00
    };
    return Math.floor(50 * rankMultipliers[rank] * (1 + (level - 1) * 0.08));
  };

  // Fórmula de Ataque baseada no Rank
  private readonly ATQ_FORMULA = (rank: Rank, level: number): number => {
    const rankMultipliers: Record<Rank, number> = {
      'A': 1.0, 'B': 1.12, 'C': 1.24, 'D': 1.36, 'E': 1.48, 'F': 1.60,
      'G': 1.72, 'H': 1.84, 'I': 1.96, 'J': 2.08, 'K': 2.20, 'L': 2.32,
      'M': 2.44, 'N': 2.56, 'O': 2.68, 'P': 2.80, 'Q': 2.92, 'R': 3.04,
      'S': 3.16, 'T': 3.28, 'U': 3.40, 'V': 3.52, 'W': 3.64, 'X': 3.76,
      'Y': 3.88, 'Z': 4.00
    };
    return Math.floor(10 * rankMultipliers[rank] * (1 + (level - 1) * 0.12));
  };

  // Tabela de resistências elementais
  private readonly ELEMENTAL_RESISTANCE: Record<ElementalSchool, Record<ElementalSchool, number>> = {
    [ElementalSchool.TERRANOR]: {
      [ElementalSchool.TERRANOR]: 0.5,
      [ElementalSchool.PYRAXIS]: 1.2,
      [ElementalSchool.AQUARIS]: 0.8,
      [ElementalSchool.AERIS]: 1.0,
      [ElementalSchool.LUMINIS]: 1.0,
      [ElementalSchool.UMBRIS]: 1.0
    },
    [ElementalSchool.PYRAXIS]: {
      [ElementalSchool.TERRANOR]: 0.8,
      [ElementalSchool.PYRAXIS]: 0.5,
      [ElementalSchool.AQUARIS]: 1.5,
      [ElementalSchool.AERIS]: 1.0,
      [ElementalSchool.LUMINIS]: 1.1,
      [ElementalSchool.UMBRIS]: 0.9
    },
    [ElementalSchool.AQUARIS]: {
      [ElementalSchool.TERRANOR]: 1.2,
      [ElementalSchool.PYRAXIS]: 0.5,
      [ElementalSchool.AQUARIS]: 0.5,
      [ElementalSchool.AERIS]: 1.1,
      [ElementalSchool.LUMINIS]: 0.9,
      [ElementalSchool.UMBRIS]: 1.1
    },
    [ElementalSchool.AERIS]: {
      [ElementalSchool.TERRANOR]: 1.0,
      [ElementalSchool.PYRAXIS]: 1.0,
      [ElementalSchool.AQUARIS]: 0.9,
      [ElementalSchool.AERIS]: 0.5,
      [ElementalSchool.LUMINIS]: 1.2,
      [ElementalSchool.UMBRIS]: 0.8
    },
    [ElementalSchool.LUMINIS]: {
      [ElementalSchool.TERRANOR]: 1.0,
      [ElementalSchool.PYRAXIS]: 0.9,
      [ElementalSchool.AQUARIS]: 1.1,
      [ElementalSchool.AERIS]: 0.8,
      [ElementalSchool.LUMINIS]: 0.5,
      [ElementalSchool.UMBRIS]: 1.5
    },
    [ElementalSchool.UMBRIS]: {
      [ElementalSchool.TERRANOR]: 1.0,
      [ElementalSchool.PYRAXIS]: 1.1,
      [ElementalSchool.AQUARIS]: 0.9,
      [ElementalSchool.AERIS]: 1.2,
      [ElementalSchool.LUMINIS]: 0.5,
      [ElementalSchool.UMBRIS]: 0.5
    }
  };

  /**
   * Calcula o dano de um ataque baseado nas fórmulas do Sistema A-Z
   */
  public calculateDamage(
    attackerStats: PlayerStats,
    defenderStats: PlayerStats,
    skill: ClassSkill,
    diceRoll?: number
  ): CombatResult {
    // Rolagem de dado padrão (1d20 para ataques físicos, 1d12 para mágicos)
    const baseDice = skill.damage ? 12 : 20;
    const roll = diceRoll || Math.floor(Math.random() * baseDice) + 1;

    // Dano base: Dado + (ATQ / 5)
    let baseDamage = this.BASE_DAMAGE_FORMULA(attackerStats.atq, roll);

    // Adiciona dano da skill se houver
    if (skill.damage) {
      baseDamage += skill.damage;
    }

    // Cálculo de crítico (5% base + AGI/100)
    const criticalChance = 0.05 + (attackerStats.agi / 100);
    const isCritical = Math.random() < criticalChance;
    if (isCritical) {
      baseDamage = Math.floor(baseDamage * 1.5);
    }

    // Cálculo de bloqueio (baseado em DEF)
    const blockChance = Math.min(0.5, defenderStats.def / 100);
    const isBlocked = Math.random() < blockChance;
    if (isBlocked) {
      baseDamage = Math.floor(baseDamage * 0.3);
    }

    // Cálculo de esquiva (baseado em AGI)
    const dodgeChance = Math.min(0.4, defenderStats.agi / 150);
    const isDodged = Math.random() < dodgeChance;

    // Aplicação de resistências elementais
    let finalDamage = baseDamage;
    if (skill.school) {
      const resistance = this.ELEMENTAL_RESISTANCE[skill.school][skill.school] || 1.0;
      finalDamage = Math.floor(baseDamage * resistance);
    }

    // Aplicação de defesa
    const defenseReduction = Math.floor(defenderStats.def / 10);
    finalDamage = Math.max(1, finalDamage - defenseReduction);

    return {
      attacker: '', // Será preenchido pelo chamador
      defender: '', // Será preenchido pelo chamador
      damage: finalDamage,
      damageType: skill.school || ElementalSchool.TERRANOR,
      critical: isCritical,
      blocked: isBlocked,
      dodged: isDodged
    };
  }

  /**
   * Verifica se um jogador pode usar uma habilidade
   */
  public canUseSkill(playerStats: PlayerStats, skill: ClassSkill): boolean {
    return playerStats.ene >= skill.costENE && playerStats.fat >= skill.costFAT;
  }

  /**
   * Consome recursos ao usar uma habilidade
   */
  public consumeSkillResources(playerStats: PlayerStats, skill: ClassSkill): PlayerStats {
    return {
      ...playerStats,
      ene: Math.max(0, playerStats.ene - skill.costENE),
      fat: Math.min(playerStats.fat + skill.costFAT, 100) // Fadiga máxima de 100
    };
  }

  /**
   * Calcula a regeneração de energia por turno
   */
  public calculateEnergyRegeneration(playerStats: PlayerStats): number {
    const baseRegen = 5;
    const magBonus = Math.floor(playerStats.mag / 20);
    return baseRegen + magBonus;
  }

  /**
   * Calcula a recuperação de fadiga por turno
   */
  public calculateFatigueRecovery(playerStats: PlayerStats): number {
    const baseRecovery = 2;
    const velBonus = Math.floor(playerStats.vel / 25);
    return baseRecovery + velBonus;
  }

  /**
   * Aplica efeitos de status
   */
  public applyStatusEffect(
    targetStats: PlayerStats,
    effect: StatusEffect
  ): { stats: PlayerStats; message: string } {
    let newStats = { ...targetStats };
    let message = '';

    switch (effect.type) {
      case StatusEffectType.POISON:
        const poisonDamage = Math.floor(effect.value);
        newStats.hp = Math.max(0, newStats.hp - poisonDamage);
        message = `${newStats.hp} de dano por veneno`;
        break;

      case StatusEffectType.BURN:
        const burnDamage = Math.floor(effect.value);
        newStats.hp = Math.max(0, newStats.hp - burnDamage);
        message = `${burnDamage} de dano por queimadura`;
        break;

      case StatusEffectType.FROZEN:
        newStats.vel = Math.floor(newStats.vel * 0.5);
        message = 'Velocidade reduzida por congelamento';
        break;

      case StatusEffectType.STUNNED:
        message = 'Personagem atordoado';
        break;

      case StatusEffectType.BUFF:
        if (effect.name.includes('ATQ')) {
          newStats.atq += effect.value;
          message = `+${effect.value} de Ataque`;
        } else if (effect.name.includes('DEF')) {
          newStats.def += effect.value;
          message = `+${effect.value} de Defesa`;
        }
        break;

      case StatusEffectType.DEBUFF:
        if (effect.name.includes('ATQ')) {
          newStats.atq = Math.max(1, newStats.atq - effect.value);
          message = `-${effect.value} de Ataque`;
        } else if (effect.name.includes('DEF')) {
          newStats.def = Math.max(1, newStats.def - effect.value);
          message = `-${effect.value} de Defesa`;
        }
        break;
    }

    return { stats: newStats, message };
  }

  /**
   * Calcula stats base para um jogador baseado no Rank e Level
   */
  public calculateBaseStats(rank: Rank, level: number): PlayerStats {
    return {
      pi: this.calculatePI(rank, level),
      hp: this.HP_FORMULA(rank, level),
      ene: this.ENE_FORMULA(rank, level),
      atq: this.ATQ_FORMULA(rank, level),
      def: Math.floor(this.ATQ_FORMULA(rank, level) * 0.6),
      mag: Math.floor(this.ATQ_FORMULA(rank, level) * 0.5),
      res: Math.floor(this.ATQ_FORMULA(rank, level) * 0.4),
      agi: Math.floor(this.ATQ_FORMULA(rank, level) * 0.7),
      vel: Math.floor(this.ATQ_FORMULA(rank, level) * 0.8),
      fat: 0
    };
  }

  /**
   * Calcula Pontos de Impacto (PI) baseado no Rank e Level
   */
  private calculatePI(rank: Rank, level: number): number {
    const rankValues: Record<Rank, number> = {
      'A': 10, 'B': 15, 'C': 22, 'D': 30, 'E': 40, 'F': 52,
      'G': 65, 'H': 80, 'I': 97, 'J': 115, 'K': 135, 'L': 156,
      'M': 179, 'N': 203, 'O': 229, 'P': 256, 'Q': 285, 'R': 315,
      'S': 347, 'T': 380, 'U': 415, 'V': 451, 'W': 489, 'X': 528,
      'Y': 569, 'Z': 611
    };
    return rankValues[rank] + (level - 1) * 5;
  }

  /**
   * Verifica se um jogador pode evoluir de Rank
   */
  public canRankUp(currentRank: Rank, currentPI: number, currentXP: number): boolean {
    const rankOrder = Object.values(Rank);
    const currentIndex = rankOrder.indexOf(currentRank);
    
    if (currentIndex >= rankOrder.length - 1) {
      return false; // Já está no Rank máximo
    }

    const nextRank = rankOrder[currentIndex + 1];
    const requiredPI = this.calculatePI(nextRank, 1);
    const requiredXP = this.getRequiredXPForRank(nextRank);

    return currentPI >= requiredPI && currentXP >= requiredXP;
  }

  /**
   * Obtém XP necessário para cada Rank
   */
  private getRequiredXPForRank(rank: Rank): number {
    const xpRequirements: Record<Rank, number> = {
      'A': 0, 'B': 100, 'C': 250, 'D': 500, 'E': 900, 'F': 1500,
      'G': 2300, 'H': 3400, 'I': 4800, 'J': 6600, 'K': 8800, 'L': 11500,
      'M': 14800, 'N': 18800, 'O': 23600, 'P': 29300, 'Q': 36000, 'R': 43800,
      'S': 52800, 'T': 63100, 'U': 74800, 'V': 88000, 'W': 102800, 'X': 119300,
      'Y': 137800, 'Z': 158500
    };
    return xpRequirements[rank];
  }

  /**
   * Simula combate completo entre dois combatentes
   */
  public async simulateCombat(
    attacker: { stats: PlayerStats; skills: ClassSkill[] },
    defender: { stats: PlayerStats; skills: ClassSkill[] },
    maxTurns: number = 50
  ): Promise<{ winner: string; combatLog: CombatResult[] }> {
    const combatLog: CombatResult[] = [];
    let attackerStats = { ...attacker.stats };
    let defenderStats = { ...defender.stats };
    let currentTurn = 0;

    while (currentTurn < maxTurns && attackerStats.hp > 0 && defenderStats.hp > 0) {
      currentTurn++;

      // Turno do atacante
      const attackerSkill = attacker.skills[0]; // Simplificado - usa primeira skill
      if (attackerSkill && this.canUseSkill(attackerStats, attackerSkill)) {
        const result = this.calculateDamage(attackerStats, defenderStats, attackerSkill);
        result.attacker = 'Attacker';
        result.defender = 'Defender';
        
        if (!result.dodged) {
          defenderStats.hp = Math.max(0, defenderStats.hp - result.damage);
        }
        
        combatLog.push(result);
      } else {
        // Ataque básico se não tiver skill ou não puder usar
        const basicSkill: ClassSkill = {
          id: 'basic_attack',
          name: 'Ataque Básico',
          description: 'Ataque básico sem habilidade especial',
          class: PlayerClass.WARRIOR, // Qualquer classe serve para ataque básico
          requiredLevel: 1,
          skillType: SkillType.DAMAGE,
          damage: 0,
          cooldown: 0,
          range: 1,
          costENE: 0,
          costFAT: 0,
          castTime: 0,
          school: ElementalSchool.TERRANOR
        };
        const result = this.calculateDamage(attackerStats, defenderStats, basicSkill);
        result.attacker = 'Attacker';
        result.defender = 'Defender';
        
        if (!result.dodged) {
          defenderStats.hp = Math.max(0, defenderStats.hp - result.damage);
        }
        
        combatLog.push(result);
      }

      // Turno do defensor
      if (defenderStats.hp > 0) {
        const defenderSkill = defender.skills[0]; // Simplificado - usa primeira skill
        if (defenderSkill && this.canUseSkill(defenderStats, defenderSkill)) {
          const result = this.calculateDamage(defenderStats, attackerStats, defenderSkill);
          result.attacker = 'Defender';
          result.defender = 'Attacker';
          
          if (!result.dodged) {
            attackerStats.hp = Math.max(0, attackerStats.hp - result.damage);
          }
          
          combatLog.push(result);
        } else {
          // Ataque básico se não tiver skill ou não puder usar
          const basicSkill: ClassSkill = {
            id: 'basic_attack',
            name: 'Ataque Básico',
            description: 'Ataque básico sem habilidade especial',
            class: PlayerClass.WARRIOR,
            requiredLevel: 1,
            skillType: SkillType.DAMAGE,
            damage: 0,
            cooldown: 0,
            range: 1,
            costENE: 0,
            costFAT: 0,
            castTime: 0,
            school: ElementalSchool.TERRANOR
          };
          const result = this.calculateDamage(defenderStats, attackerStats, basicSkill);
          result.attacker = 'Defender';
          result.defender = 'Attacker';
          
          if (!result.dodged) {
            attackerStats.hp = Math.max(0, attackerStats.hp - result.damage);
          }
          
          combatLog.push(result);
        }
      }

      // Regeneração entre turnos
      const maxENE = this.ENE_FORMULA(Rank.A, 1); // Max ENE base
      attackerStats.ene = Math.min(maxENE, attackerStats.ene + this.calculateEnergyRegeneration(attackerStats));
      defenderStats.ene = Math.min(maxENE, defenderStats.ene + this.calculateEnergyRegeneration(defenderStats));

      attackerStats.fat = Math.max(0, attackerStats.fat - this.calculateFatigueRecovery(attackerStats));
      defenderStats.fat = Math.max(0, defenderStats.fat - this.calculateFatigueRecovery(defenderStats));
    }

    const winner = attackerStats.hp > 0 ? 'Attacker' : 'Defender';
    return { winner, combatLog };
  }
}
