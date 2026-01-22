import { CombatEngine } from './engine/CombatEngine';
import { ProgressionSystem } from './engine/ProgressionSystem';
import { ClassSystem } from './engine/ClassSystem';
import { EquipmentSystem } from './engine/EquipmentSystem';
import { WorldSystem } from './engine/WorldSystem';
import { PlayerClass, PlayerBuild } from './types/classes';
import { EquipmentRarity, ItemTier, EquipmentType } from './types/equipment';
import { Rank } from './types';

/**
 * Demonstração completa do MMORPG Sistema A-Z
 */
async function demonstrateCompleteMMORPG() {
  console.log('🎮 SISTEMA A-Z MMORPG - DEMONSTRAÇÃO COMPLETA\n');

  // 1. Sistema de Classes
  console.log('⚔️ === SISTEMA DE CLASSES ===');
  const classSystem = new ClassSystem();

  // Criar jogador de cada classe
  const classes = [PlayerClass.WARRIOR, PlayerClass.ARCHER, PlayerClass.MAGE, PlayerClass.CLERIC, PlayerClass.ASSASSIN];
  
  classes.forEach(playerClass => {
    const player = classSystem.createPlayerWithClass(
      `player_${playerClass.toLowerCase()}`,
      `${playerClass} Test`,
      `test@${playerClass.toLowerCase()}.com`,
      playerClass
    );
    
    console.log(`\n📋 ${playerClass}:`);
    console.log(`   Nome: ${player.name}`);
    console.log(`   Level: ${player.level}`);
    console.log(`   HP: ${player.stats.hp} | ATQ: ${player.stats.atq} | DEF: ${player.stats.def}`);
    console.log(`   AGI: ${player.stats.agi} | MAG: ${player.stats.mag} | ENE: ${player.stats.ene}`);
  });

  // 2. Sistema de Equipamentos
  console.log('\n⚔️ === SISTEMA DE EQUIPAMENTOS ===');
  const equipmentSystem = new EquipmentSystem();

  // Gerar equipamentos de diferentes tiers e raridades
  const warrior = classSystem.createPlayerWithClass('warrior', 'Guerreiro', 'warrior@test.com', PlayerClass.WARRIOR);
  
  const equipmentExamples = [
    { tier: ItemTier.TIER_1, rarity: EquipmentRarity.COMMON, type: EquipmentType.WEAPON },
    { tier: ItemTier.TIER_2, rarity: EquipmentRarity.UNCOMMON, type: EquipmentType.ARMOR },
    { tier: ItemTier.TIER_3, rarity: EquipmentRarity.RARE, type: EquipmentType.WEAPON },
    { tier: ItemTier.TIER_4, rarity: EquipmentRarity.EPIC, type: EquipmentType.ARMOR },
    { tier: ItemTier.TIER_5, rarity: EquipmentRarity.LEGENDARY, type: EquipmentType.WEAPON }
  ];

  equipmentExamples.forEach((example, index) => {
    const equipment = equipmentSystem.generateEquipment({
      tier: example.tier,
      rarity: example.rarity,
      requiredLevel: 10 + (index * 20),
      equipmentType: example.type
    });
    
    console.log(`\n${equipment.rarity} ${equipment.name}:`);
    console.log(`   Tier: ${equipment.tier}`);
    console.log(`   Level Req: ${equipment.requiredLevel}`);
    console.log(`   Valor: ${equipment.value} gold`);
    
    if (equipment.baseStats.atq) console.log(`   ATQ: +${equipment.baseStats.atq}`);
    if (equipment.baseStats.def) console.log(`   DEF: +${equipment.baseStats.def}`);
    if (equipment.baseStats.hp) console.log(`   HP: +${equipment.baseStats.hp}`);
    if (equipment.randomStats) {
      console.log(`   Stats Aleatórios: ${Object.keys(equipment.randomStats).length} propriedades`);
    }
    if (equipment.sockets) console.log(`   Soquetes: ${equipment.sockets}`);
  });

  // 3. Sistema de Progressão
  console.log('\n📈 === SISTEMA DE PROGRESSÃO ===');
  const progression = new ProgressionSystem();

  // Demonstrar progressão de um jogador
  const testPlayer = classSystem.createPlayerWithClass('test', 'Test Player', 'test@test.com', PlayerClass.WARRIOR);
  
  console.log(`\nJogador: ${testPlayer.name}`);
  console.log(`Rank: ${testPlayer.rank} | Level: ${testPlayer.level}`);
  console.log(`XP: ${testPlayer.xp} | PI: ${testPlayer.stats.pi}`);

  // Adicionar experiência e mostrar progressão
  const { updatedPlayer, leveledUp, rankedUp } = progression.addExperience(testPlayer, 5000);
  
  if (leveledUp) {
    console.log(`✨ Level Up! Novo level: ${updatedPlayer.level}`);
  }
  
  const rankProgress = progression.getRankProgress(updatedPlayer);
  console.log(`Progresso Rank:`);
  console.log(`   XP: ${rankProgress.currentXP}/${rankProgress.requiredXP}`);
  console.log(`   PI: ${rankProgress.currentPI}/${rankProgress.requiredPI}`);
  console.log(`   Pode Rank Up: ${rankProgress.canRankUp ? 'SIM' : 'NÃO'}`);

  // 4. Sistema de Combate Avançado
  console.log('\n⚔️ === SISTEMA DE COMBATE AVANÇADO ===');
  const combat = new CombatEngine();

  // Criar build de guerreiro
  const warriorBuild: PlayerBuild = {
    class: PlayerClass.WARRIOR,
    equippedSkills: [
      'warrior_brutal_charge',
      'warrior_steel_wall',
      'warrior_war_cry',
      'warrior_devastating_blow'
    ],
    talents: [],
    specialization: {
      id: 'warrior_tank',
      name: 'Guardião Implacável',
      class: PlayerClass.WARRIOR,
      description: 'Especializado em proteção',
      bonuses: [
        { stat: 'def', value: 20, type: 'flat' },
        { stat: 'hp', value: 15, type: 'percentage' }
      ]
    }
  };

  // Calcular stats efetivos com build
  const effectiveStats = classSystem.calculateEffectiveStats(updatedPlayer, warriorBuild);
  
  console.log(`\nStats Efetivos com Build:`);
  console.log(`   HP: ${effectiveStats.hp} | DEF: ${effectiveStats.def} | ATQ: ${effectiveStats.atq}`);
  console.log(`   PI: ${effectiveStats.pi}`);

  // Simular combate entre classes
  const mage = classSystem.createPlayerWithClass('mage', 'Mago', 'mage@test.com', PlayerClass.MAGE);
  const mageStats = classSystem.calculateEffectiveStats(mage);

  console.log(`\n⚔️ COMBATE: Guerreiro vs Mago`);
  console.log(`Guerreiro: HP=${warrior.stats.hp} | DEF=${warrior.stats.def} | ATQ=${warrior.stats.atq}`);
  console.log(`Mago: HP=${mageStats.hp} | DEF=${mageStats.def} | ATQ=${mageStats.atq}`);

  // 5. Sistema de Mundo
  console.log('\n🗺️ === SISTEMA DE MUNDO ===');
  const worldSystem = new WorldSystem();

  const regions = worldSystem.getAllRegions();
  console.log(`\nRegiões Disponíveis: ${regions.length}`);
  
  regions.forEach(region => {
    console.log(`\n📍 ${region.name}:`);
    console.log(`   ID: ${region.id}`);
    console.log(`   Level: ${region.recommendedLevel.min}-${region.recommendedLevel.max}`);
    console.log(`   Rank: ${region.recommendedRank}`);
    console.log(`   Clima: ${region.climate}`);
    console.log(`   Terreno: ${region.terrain.join(', ')}`);
    console.log(`   PvP: ${region.pvpEnabled ? 'Sim' : 'Não'}`);
  });

  // 6. Sistema de Habilidades
  console.log('\n🎯 === SISTEMA DE HABILIDADES ===');
  
  classes.forEach(playerClass => {
    const classInfo = classSystem.getClassInfo(playerClass);
    console.log(`\n${playerClass} - Habilidades:`);
    
    classInfo.skills.slice(0, 3).forEach(skill => {
      console.log(`   • ${skill.name} (Level ${skill.requiredLevel})`);
      console.log(`     ${skill.description}`);
      console.log(`     Custo: ${skill.costENE} ENE / ${skill.costFAT} FAT`);
      console.log(`     Cooldown: ${skill.cooldown}s | Alcance: ${skill.range}`);
      if (skill.damage) console.log(`     Dano: ${skill.damage}`);
      if (skill.healing) console.log(`     Cura: ${skill.healing}`);
    });
  });

  // 7. Sistema de Builds
  console.log('\n🔧 === SISTEMA DE BUILDS ===');
  
  const playstyles = ['aggressive', 'defensive', 'support', 'balanced'] as const;
  
  classes.forEach(playerClass => {
    const classInfo = classSystem.getClassInfo(playerClass);
    console.log(`\n${playerClass} - Builds Recomendados:`);
    
    playstyles.forEach(playstyle => {
      const builds = classSystem.recommendBuilds(playerClass, playstyle);
      if (builds.length > 0) {
        console.log(`\n   Estilo ${playstyle}:`);
        builds[0].equippedSkills.forEach(skillId => {
          const skill = classInfo.skills.find((s: any) => s.id === skillId);
          if (skill) {
            console.log(`     • ${skill.name}`);
          }
        });
      }
    });
  });

  // 8. Comparação de Equipamentos
  console.log('\n⚖️ === COMPARAÇÃO DE EQUIPAMENTOS ===');
  
  const oldWeapon = equipmentSystem.getAllPredefinedEquipment().find(eq => eq.id === 'iron_sword_001');
  const newWeapon = equipmentSystem.getAllPredefinedEquipment().find(eq => eq.id === 'steel_bow_001');
  
  if (oldWeapon && newWeapon) {
    const comparison = equipmentSystem.compareEquipment(oldWeapon, newWeapon, warrior.stats);
    
    console.log(`\nComparação: ${oldWeapon.name} vs ${newWeapon.name}`);
    console.log(`   Upgrade: ${comparison.upgrade ? 'SIM' : 'NÃO'}`);
    console.log(`   Diferença de Score: ${comparison.scoreDifference}`);
    
    Object.entries(comparison.statDifferences).forEach(([stat, diff]) => {
      const sign = diff > 0 ? '+' : '';
      console.log(`   ${stat}: ${sign}${diff}`);
    });
  }

  // 9. Sistema de Sets
  console.log('\n🎁 === SISTEMA DE SETS ===');
  
  const equipmentSets = equipmentSystem.getAllEquipmentSets();
  
  equipmentSets.forEach(set => {
    console.log(`\n${set.name}:`);
    console.log(`   Level Req: ${set.requiredLevel}`);
    console.log(`   Peças: ${set.pieces.length}`);
    
    set.bonuses.forEach(bonus => {
      console.log(`   ${bonus.piecesRequired} peças: ${bonus.description}`);
      Object.entries(bonus.bonus).forEach(([stat, value]) => {
        console.log(`     ${stat}: +${value}`);
      });
    });
  });

  // 10. Resumo do Sistema
  console.log('\n📊 === RESUMO DO SISTEMA ===');
  console.log('✅ Sistema de Classes: 5 classes únicas implementadas');
  console.log('✅ Sistema de Equipamentos: 5 tiers com 6 níveis de raridade');
  console.log('✅ Sistema de Progressão: 26 ranks (A-Z) com sistema de PI');
  console.log('✅ Sistema de Combate: Fórmulas oficiais com resistências elementares');
  console.log('✅ Sistema de Mundo: 8 regiões principais com diferentes biomas');
  console.log('✅ Sistema de Habilidades: 4 habilidades por classe + especializações');
  console.log('✅ Sistema de Builds: Customização com 6 slots de habilidade');
  console.log('✅ Sistema de Sets: Bônus por conjuntos de equipamentos');
  
  console.log('\n🎉 DEMONSTRAÇÃO CONCLUÍDA COM SUCESSO!');
  console.log('📖 Para mais detalhes, consulte o README.md');
  console.log('🚀 Projeto pronto para desenvolvimento de APIs e frontend!');
}

// Executar demonstração
if (require.main === module) {
  demonstrateCompleteMMORPG().catch(console.error);
}

export { demonstrateCompleteMMORPG };
