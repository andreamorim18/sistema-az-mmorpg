import { Region, City, Dungeon, WorldBoss } from '../types/world';
import { Rank, Position } from '../types';

export class WorldSystem {
  private regions: Map<string, Region> = new Map();
  private cities: Map<string, City> = new Map();

  constructor() {
    this.initializeWorld();
  }

  private initializeWorld(): void {
    // 8 Regiões Principais
    this.createStartingRegion();
    // this.createShadowForest();
    // this.createBurningDesert();
    // this.createFrozenMountains();
    // this.createCursedSwamp();
    // this.createAncientRuins();
    // this.createDemonicLands();
    // this.createCelestialCitadel();
  }

  private createStartingRegion(): void {
    const region: Region = {
      id: 'vale_inicial',
      name: 'Vale Inicial',
      description: 'Região segura para novos aventureiros começarem sua jornada.',
      type: 'STARTER' as any,
      recommendedLevel: { min: 1, max: 15 },
      recommendedRank: Rank.A,
      size: { width: 2000, height: 2000 },
      climate: 'TEMPERATE' as any,
      terrain: ['GRASSLAND' as any, 'FOREST' as any],
      connectedRegions: ['floresta_sombria'],
      travelMethods: ['WALKING' as any, 'MOUNT' as any],
      cities: [],
      dungeons: [],
      npcs: [],
      resources: [],
      landmarks: [],
      pvpEnabled: false
    };

    this.regions.set(region.id, region);
  }

  public getRegion(id: string): Region | null {
    return this.regions.get(id) || null;
  }

  public getCity(id: string): City | null {
    return this.cities.get(id) || null;
  }

  public getAllRegions(): Region[] {
    return Array.from(this.regions.values());
  }

  public getRegionsForLevel(level: number): Region[] {
    return Array.from(this.regions.values()).filter(
      region => level >= region.recommendedLevel.min && level <= region.recommendedLevel.max
    );
  }
}
