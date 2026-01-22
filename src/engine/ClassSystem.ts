import { 
  Player, 
  PlayerStats, 
  Skill, 
  PlayerSkill 
} from '../types';
import { 
  PlayerClass, 
  ClassStats, 
  ClassSkill, 
  PlayerBuild, 
  Talent, 
  Specialization,
  SkillType,
  CLASS_DEFINITIONS,
  CLASS_SKILLS,
  CLASS_SPECIALIZATIONS
} from '../types/classes';

export interface ClassProgression {
  class: PlayerClass;
  level: number;
  unlockedSkills: ClassSkill[];
  availableTalentPoints: number;
  spentTalentPoints: number;
  specialization?: Specialization;
}

export class ClassSystem {
  /**
   * Cria um novo jogador com stats base da classe escolhida
   */
  public createPlayerWithClass(
    id: string,
    name: string,
    email: string,
    playerClass: PlayerClass
  ): Player {
    const classDefinition = CLASS_DEFINITIONS[playerClass];
    
    // Combina stats base da classe com stats base do jogador
    const baseStats: PlayerStats = {
      pi: 10,
      hp: classDefinition.baseStats.hp || 100,
      ene: classDefinition.baseStats.ene || 50,
      atq: classDefinition.baseStats.atq || 10,
      def: classDefinition.baseStats.def || 5,
      mag: classDefinition.baseStats.mag || 5,
      res: classDefinition.baseStats.res || 5,
      agi: classDefinition.baseStats.agi || 5,
      vel: classDefinition.baseStats.vel || 5,
      fat: 0,
      
      // Stats derivados
      crit: 5,
      crit_damage: 150,
      dodge: 5,
      range: playerClass === PlayerClass.ARCHER ? 25 : 5,
      spell_damage: playerClass === PlayerClass.MAGE || playerClass === PlayerClass.CLERIC ? 10 : 0,
      cc_duration: 100,
      healing: playerClass === PlayerClass.CLERIC ? 15 : 0,
      stealth: playerClass === PlayerClass.ASSASSIN ? 20 : 0,
      attack_speed: 100
    };

    return {
      id,
      name,
      email,
      rank: 'A' as any,
      level: 1,
      xp: 0,
      stats: baseStats,
      skills: [],
      inventory: [],
      quests: [],
      position: { x: 0, y: 0, z: 0, mapId: 'starter_zone' },
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Obtém a progressão de classe de um jogador
   */
  public getClassProgression(player: Player): ClassProgression {
    const playerClass = this.getPlayerClass(player);
    const unlockedSkills = this.getUnlockedSkills(playerClass, player.level);
    const totalTalentPoints = Math.floor(player.level / 2); // 1 ponto de talento a cada 2 níveis
    const spentTalentPoints = this.calculateSpentTalentPoints(player.skills);

    return {
      class: playerClass,
      level: player.level,
      unlockedSkills,
      availableTalentPoints: totalTalentPoints - spentTalentPoints,
      spentTalentPoints
    };
  }

  /**
   * Obtém habilidades disponíveis para a classe e nível
   */
  public getUnlockedSkills(playerClass: PlayerClass, level: number): ClassSkill[] {
    return CLASS_SKILLS.filter(skill => 
      skill.class === playerClass && skill.requiredLevel <= level
    );
  }

  /**
   * Verifica se um jogador pode aprender uma habilidade
   */
  public canLearnSkill(player: Player, skillId: string): boolean {
    const skill = CLASS_SKILLS.find(s => s.id === skillId);
    if (!skill) return false;

    const playerClass = this.getPlayerClass(player);
    if (skill.class !== playerClass) return false;
    if (skill.requiredLevel > player.level) return false;

    // Verifica se já não possui a habilidade
    const hasSkill = player.skills.some(ps => ps.skillId === skillId);
    if (hasSkill) return false;

    return true;
  }

  /**
   * Adiciona uma habilidade ao jogador
   */
  public learnSkill(player: Player, skillId: string): Player {
    if (!this.canLearnSkill(player, skillId)) {
      throw new Error('Cannot learn this skill');
    }

    const newSkill: PlayerSkill = {
      skillId,
      level: 1,
      experience: 0,
      unlockedAt: new Date()
    };

    return {
      ...player,
      skills: [...player.skills, newSkill],
      updatedAt: new Date()
    };
  }

  /**
   * Cria um build de jogador com habilidades equipadas
   */
  public createPlayerBuild(
    player: Player,
    equippedSkillIds: string[],
    specializationId?: string
  ): PlayerBuild {
    const playerClass = this.getPlayerClass(player);
    
    // Valida habilidades equipadas
    const equippedSkills = equippedSkillIds.map(id => {
      const skill = CLASS_SKILLS.find(s => s.id === id);
      if (!skill || skill.class !== playerClass) {
        console.warn(`Skill not found or invalid for class ${playerClass}: ${id}`);
        // Retorna uma skill básica da mesma classe como fallback
        const fallbackSkill = CLASS_SKILLS.find(s => 
          s.class === playerClass && s.skillType === SkillType.DAMAGE
        );
        if (fallbackSkill) {
          return fallbackSkill;
        }
        // Se não encontrar skill de dano, retorna a primeira skill da classe
        return CLASS_SKILLS.find(s => s.class === playerClass) || CLASS_SKILLS[0];
      }
      return skill;
    });

    if (equippedSkills.length > 6) {
      throw new Error('Maximum 6 skills can be equipped');
    }

    // Obtém especialização
    const specialization = specializationId 
      ? CLASS_SPECIALIZATIONS.find(s => s.id === specializationId && s.class === playerClass)
      : undefined;

    return {
      class: playerClass,
      equippedSkills: equippedSkillIds,
      talents: [], // Será implementado com sistema de talentos
      specialization: specialization || undefined
    };
  }

  /**
   * Aplica bônus de especialização aos stats do jogador
   */
  public applySpecializationBonuses(
    baseStats: PlayerStats,
    specialization: Specialization
  ): PlayerStats {
    const newStats = { ...baseStats };

    specialization.bonuses.forEach(bonus => {
      const currentValue = (newStats as any)[bonus.stat] || 0;
      
      if (bonus.type === 'flat') {
        (newStats as any)[bonus.stat] = currentValue + bonus.value;
      } else if (bonus.type === 'percentage') {
        (newStats as any)[bonus.stat] = Math.floor(currentValue * (1 + bonus.value / 100));
      }
    });

    return newStats;
  }

  /**
   * Calcula stats efetivos do jogador incluindo bônus de classe
   */
  public calculateEffectiveStats(player: Player, build?: PlayerBuild): PlayerStats {
    const playerClass = this.getPlayerClass(player);
    const classDefinition = CLASS_DEFINITIONS[playerClass];
    
    // Começa com stats base
    let effectiveStats = { ...player.stats };

    // Aplica bônus de especialização se houver
    if (build?.specialization) {
      effectiveStats = this.applySpecializationBonuses(effectiveStats, build.specialization!);
    }

    // Aplica bônus de classe base
    Object.entries(classDefinition.baseStats).forEach(([stat, value]) => {
      if (value && stat in effectiveStats) {
        (effectiveStats as any)[stat] += value;
      }
    });

    // Recalcula PI com stats finais
    effectiveStats.pi = this.calculatePI(effectiveStats);

    return effectiveStats;
  }

  /**
   * Obtém classe do jogador (baseado nos stats - simplificado)
   */
  private getPlayerClass(player: Player): PlayerClass {
    // Em uma implementação real, a classe seria armazenada no jogador
    // Por ora, vamos inferir baseado nos stats principais
    const { def, agi, mag, atq, hp } = player.stats;

    if (def > 12 && hp > 110) return PlayerClass.WARRIOR;
    if (agi > 14 && atq > 8) return PlayerClass.ARCHER;
    if (mag > 12) return PlayerClass.MAGE;
    if (mag > 8 && def > 8) return PlayerClass.CLERIC;
    if (agi > 16 && atq > 10) return PlayerClass.ASSASSIN;

    return PlayerClass.WARRIOR; // Default
  }

  /**
   * Calcula Pontos de Impacto com stats avançados
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
   * Calcula pontos de talento gastos
   */
  private calculateSpentTalentPoints(playerSkills: PlayerSkill[]): number {
    // Simplificado - cada nível de habilidade = 1 ponto
    return playerSkills.reduce((total, skill) => total + skill.level - 1, 0);
  }

  /**
   * Obtém informações detalhadas da classe
   */
  public getClassInfo(playerClass: PlayerClass): {
    definition: ClassStats;
    skills: ClassSkill[];
    specializations: Specialization[];
  } {
    return {
      definition: CLASS_DEFINITIONS[playerClass],
      skills: CLASS_SKILLS.filter(skill => skill.class === playerClass),
      specializations: CLASS_SPECIALIZATIONS.filter(spec => spec.class === playerClass)
    };
  }

  /**
   * Verifica se uma build é válida
   */
  public validateBuild(player: Player, build: PlayerBuild): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    const playerClass = this.getPlayerClass(player);

    // Verifica classe
    if (build.class !== playerClass) {
      errors.push(`Build class ${build.class} doesn't match player class ${playerClass}`);
    }

    // Verifica habilidades
    if (build.equippedSkills.length > 6) {
      errors.push('Maximum 6 skills can be equipped');
    }

    build.equippedSkills.forEach(skillId => {
      const skill = CLASS_SKILLS.find(s => s.id === skillId);
      if (!skill) {
        errors.push(`Skill ${skillId} not found`);
      } else if (skill.class !== playerClass) {
        errors.push(`Skill ${skill.name} doesn't belong to class ${playerClass}`);
      } else if (skill.requiredLevel > player.level) {
        errors.push(`Skill ${skill.name} requires level ${skill.requiredLevel}`);
      }
    });

    // Verifica especialização
    if (build.specialization && build.specialization.class !== playerClass) {
      errors.push(`Specialization ${build.specialization.name} doesn't match class ${playerClass}`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Obtém sinergias entre habilidades
   */
  public getSkillSynergies(skillIds: string[]): {
    synergies: string[];
    score: number;
  } {
    const synergies: string[] = [];
    let score = 0;

    // Sinergias baseadas em tipos de habilidade
    const skills = skillIds.map(id => CLASS_SKILLS.find(s => s.id === id)).filter(Boolean) as ClassSkill[];
    
    const damageSkills = skills.filter(s => s.skillType === SkillType.DAMAGE);
    const healSkills = skills.filter(s => s.skillType === SkillType.HEAL);
    const buffSkills = skills.filter(s => s.skillType === SkillType.BUFF);
    const mobilitySkills = skills.filter(s => s.skillType === SkillType.MOBILITY);

    // Combos de sinergia
    if (damageSkills.length >= 3) {
      synergies.push('Dano Focado');
      score += 20;
    }

    if (healSkills.length >= 2 && buffSkills.length >= 1) {
      synergies.push('Suporte Completo');
      score += 25;
    }

    if (mobilitySkills.length >= 2 && damageSkills.length >= 2) {
      synergies.push('Kiting Eficiente');
      score += 15;
    }

    if (damageSkills.length >= 2 && healSkills.length >= 1) {
      synergies.push('Híbrido Versátil');
      score += 10;
    }

    return { synergies, score };
  }

  /**
   * Recomenda builds baseados no estilo de jogo
   */
  public recommendBuilds(
    playerClass: PlayerClass,
    playstyle: 'aggressive' | 'defensive' | 'support' | 'balanced'
  ): PlayerBuild[] {
    const classSkills = CLASS_SKILLS.filter(skill => skill.class === playerClass);
    const builds: PlayerBuild[] = [];

    // Build Agressivo
    if (playstyle === 'aggressive') {
      const damageSkills = classSkills
        .filter(s => s.skillType === SkillType.DAMAGE)
        .sort((a, b) => (b.damage || 0) - (a.damage || 0))
        .slice(0, 4);

      const mobilitySkill = classSkills
        .find(s => s.skillType === SkillType.MOBILITY);

      const ccSkill = classSkills
        .find(s => s.skillType === SkillType.CROWD_CONTROL);

      const aggressiveSkills = [
        ...damageSkills.slice(0, 4),
        ...(mobilitySkill ? [mobilitySkill] : []),
        ...(ccSkill ? [ccSkill] : [])
      ].slice(0, 6);

      builds.push(this.createPlayerBuild(
        { ...this.createPlayerWithClass('temp', 'Temp', 'temp@email.com', playerClass), level: 50 },
        aggressiveSkills.map(s => s.id)
      ));
    }

    // Build Defensivo
    if (playstyle === 'defensive') {
      const tankSkills = classSkills
        .filter(s => s.skillType === SkillType.TANK || s.skillType === SkillType.BUFF)
        .slice(0, 3);

      const healSkills = classSkills
        .filter(s => s.skillType === SkillType.HEAL)
        .slice(0, 2);

      const damageSkill = classSkills
        .find(s => s.skillType === SkillType.DAMAGE);

      const defensiveSkills = [
        ...tankSkills,
        ...healSkills,
        ...(damageSkill ? [damageSkill] : [])
      ].slice(0, 6);

      builds.push(this.createPlayerBuild(
        { ...this.createPlayerWithClass('temp', 'Temp', 'temp@email.com', playerClass), level: 50 },
        defensiveSkills.map(s => s.id)
      ));
    }

    // Build de Suporte
    if (playstyle === 'support') {
      const healSkills = classSkills
        .filter(s => s.skillType === SkillType.HEAL)
        .slice(0, 3);

      const buffSkills = classSkills
        .filter(s => s.skillType === SkillType.BUFF)
        .slice(0, 2);

      const ccSkill = classSkills
        .find(s => s.skillType === SkillType.CROWD_CONTROL);

      const supportSkills = [
        ...healSkills,
        ...buffSkills,
        ...(ccSkill ? [ccSkill] : [])
      ].slice(0, 6);

      builds.push(this.createPlayerBuild(
        { ...this.createPlayerWithClass('temp', 'Temp', 'temp@email.com', playerClass), level: 50 },
        supportSkills.map(s => s.id)
      ));
    }

    // Build Balanceado
    if (playstyle === 'balanced') {
      const damageSkills = classSkills
        .filter(s => s.skillType === SkillType.DAMAGE)
        .slice(0, 2);

      const healSkills = classSkills
        .filter(s => s.skillType === SkillType.HEAL)
        .slice(0, 1);

      const utilitySkills = classSkills
        .filter(s => [SkillType.BUFF, SkillType.MOBILITY, SkillType.CROWD_CONTROL].includes(s.skillType))
        .slice(0, 3);

      const balancedSkills = [
        ...damageSkills,
        ...healSkills,
        ...utilitySkills
      ].slice(0, 6);

      builds.push(this.createPlayerBuild(
        { ...this.createPlayerWithClass('temp', 'Temp', 'temp@email.com', playerClass), level: 50 },
        balancedSkills.map(s => s.id)
      ));
    }

    return builds;
  }
}
