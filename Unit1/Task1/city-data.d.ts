
declare const data: string;

interface CityDataRow {
  city: string;
  population: string;
  area: string;
  density: string;
  country: string;
  percentage?: number;
}

declare class CityDataProcessor {
  data: CityDataRow[][];
  maxDensity: number;

  constructor(data: string);

  findMaxDensity(): number;

  findMaxDensityInRow(density: number): number;

  addDensityPercentage(): void;

  sortByDensity(): void;

  display(): void;

  process(): void;
}

declare const processor: CityDataProcessor;
