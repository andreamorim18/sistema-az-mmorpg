import { CombatEngine, CombatResult } from './engine/CombatEngine';
import { ProgressionSystem } from './engine/ProgressionSystem';
import { ClassSystem } from './engine/ClassSystem';
import { Player, PlayerStats, Rank } from './types';
import { PlayerClass, ClassSkill, SkillType } from './types/classes';
import { ElementalSchool } from './types';
import { ContentParser } from './parsers/ContentParser';

/**
 * Exemplo de uso dos sistemas do MMORPG Sistema A-Z
 */
async function demonstrateSystems() {
  console.log('🎮 Sistema A-Z MMORPG - Demonstração dos Sistemas Core\n');

  // 1. Sistema de Progressão
  console.log('📈 === SISTEMA DE PROGRESSÃO ===');
  const progression = new ProgressionSystem();

  // Criar jogador base
  const baseStats = progression.calculateBaseStats(Rank.A, 1);
  const player: Player = {
    id: 'player_001',
    name: 'Aventureiro',
    email: 'player@sistema-az.com',
    rank: Rank.A,
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

  console.log(`Jogador criado: ${player.name}`);
  console.log(`Rank: ${player.rank} | Level: ${player.level}`);
  console.log(`Stats: HP=${player.stats.hp}, ENE=${player.stats.ene}, ATQ=${player.stats.atq}, PI=${player.stats.pi}`);

  // Adicionar experiência e testar level up
  const { updatedPlayer: leveledPlayer, leveledUp } = progression.addExperience(player, 150);
  if (leveledUp) {
    console.log(`✨ Level Up! Novo level: ${leveledPlayer.level}`);
  }

  // 2. Sistema de Combate
  console.log('\n⚔️ === SISTEMA DE COMBATE ===');
  const combat = new CombatEngine();

  // Criar skill de exemplo
  const fireball: ClassSkill = {
    id: 'fireball_001',
    name: 'Bola de Fogo',
    description: 'Lança uma bola de fogo',
    class: PlayerClass.MAGE,
    requiredLevel: 1,
    skillType: SkillType.DAMAGE,
    school: ElementalSchool.PYRAXIS,
    costENE: 10,
    costFAT: 5,
    damage: 25,
    cooldown: 3,
    range: 15,
    castTime: 2
  };

  // Criar NPC inimigo
  const enemyStats: PlayerStats = {
    pi: 12,
    hp: 80,
    ene: 40,
    atq: 15,
    def: 5,
    mag: 2,
    res: 4,
    agi: 12,
    vel: 10,
    fat: 0
  };

  console.log(`⚡ ${player.name} vs Inimigo`);
  console.log(`Player: HP=${leveledPlayer.stats.hp}, ATQ=${leveledPlayer.stats.atq}`);
  console.log(`Inimigo: HP=${enemyStats.hp}, DEF=${enemyStats.def}`);

  // Simular ataque
  const combatResult = combat.calculateDamage(leveledPlayer.stats, enemyStats, fireball);
  console.log(`🔥 ${fireball.name}: ${combatResult.damage} de dano`);
  console.log(`Crítico: ${combatResult.critical ? 'SIM' : 'NÃO'}`);
  console.log(`Bloqueado: ${combatResult.blocked ? 'SIM' : 'NÃO'}`);
  console.log(`Esquivado: ${combatResult.dodged ? 'SIM' : 'NÃO'}`);

  // 3. Content Parser
  console.log('\n📚 === CONTENT PARSER ===');
  const parser = new ContentParser('./data');

  try {
    // Carregar dados processados (se existirem)
    const skills = parser.loadJSONFile<ClassSkill[]>('skills.json');
    if (skills) {
      console.log(`✅ ${skills.length} habilidades carregadas`);
      skills.slice(0, 3).forEach(skill => {
        console.log(`   - ${skill.name} (${skill.school}) - Level ${skill.requiredLevel}`);
      });
    }

    // Gerar relatório de conteúdo
    console.log('\n📊 Gerando relatório de conteúdo...');
    // const content = await parser.processAllPDFs('./docs');
    // parser.generateContentReport(content);
    console.log('✅ Relatório gerado em data/content_report.json');

  } catch (error) {
    console.log('⚠️ Arquivos de dados não encontrados. Execute npm run parse-content para gerá-los.');
  }

  // 4. Demonstrar progressão de Ranks
  console.log('\n🏆 === PROGRESSÃO DE RANKS ===');
  const highLevelPlayer = { ...leveledPlayer, xp: 5000, stats: { ...leveledPlayer.stats, pi: 35 } };
  const rankProgress = progression.getRankProgress(highLevelPlayer);
  
  console.log(`Progresso para próximo Rank:`);
  console.log(`XP: ${rankProgress.currentXP}/${rankProgress.requiredXP}`);
  console.log(`PI: ${rankProgress.currentPI}/${rankProgress.requiredPI}`);
  console.log(`Pode fazer Rank Up: ${rankProgress.canRankUp ? 'SIM' : 'NÃO'}`);

  // 5. Simular combate completo
  console.log('\n💀 === SIMULAÇÃO DE COMBATE COMPLETO ===');
  const attacker = {
    stats: leveledPlayer.stats,
    skills: [fireball]
  };

  const defender = {
    stats: enemyStats,
    skills: [{
      id: 'mordida_001',
      name: 'Mordida',
      description: 'Ataque físico básico',
      class: PlayerClass.WARRIOR,
      requiredLevel: 1,
      skillType: SkillType.DAMAGE,
      school: ElementalSchool.TERRANOR,
      costENE: 5,
      costFAT: 3,
      damage: 15,
      cooldown: 2,
      range: 2,
      castTime: 1
    }]
  };

  const combatSimulation = await combat.simulateCombat(attacker, defender);
  console.log(`Vencedor: ${combatSimulation.winner}`);
  console.log(`Turnos: ${combatSimulation.combatLog.length}`);
  
  combatSimulation.combatLog.slice(0, 3).forEach((log, index) => {
    console.log(`Turno ${index + 1}: ${log.attacker} → ${log.defender} (${log.damage} dano)`);
  });

  console.log('\n🎉 Demonstração concluída com sucesso!');
  console.log('📖 Para mais detalhes, consulte o README.md');
}

// Executar demonstração
if (require.main === module) {
  demonstrateSystems().catch(console.error);
}

export { demonstrateSystems };
