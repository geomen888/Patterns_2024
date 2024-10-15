'use strict';
// @ts-check

const data = `city,population,area,density,country
  Shanghai,24256800,6340,3826,China
  Delhi,16787941,1484,11313,India
  Lagos,16060303,1171,13712,Nigeria
  Istanbul,14160467,5461,2593,Turkey
  Tokyo,13513734,2191,6168,Japan
  Sao Paulo,12038175,1521,7914,Brazil
  Mexico City,8874724,1486,5974,Mexico
  London,8673713,1572,5431,United Kingdom
  New York City,8537673,784,10892,United States
  Bangkok,8280925,1569,5279,Thailand`;

class CityDataProcessor {
  constructor(data) {
    this.data = data.trim().split('\n').slice(1).map(line => line.trim().split(','));
    this.maxDensity = this.findMaxDensity();
  }

  findMaxDensity() {
    return Math.max(...this.data.map(row => parseInt(row[3])));
  }

  findMaxDensityInRow(density) {
    return Math.round((density / this.maxDensity) * 100);
  }

  addDensityPercentage() {
    this.data = this.data.map(row => {
      const density = parseInt(row[3]);
      const percentage = this.findMaxDensityInRow(density);
      return [...row, percentage];
    });
  }

  sortByDensity() {
    this.data.sort((a, b) => b[5] - a[5]);
  }

  display() {
    for (const row of this.data) {
      const [city, population, area, density, country, percentage] = row;
      const stringRow =
        city.padEnd(18) +
        population.padStart(10) +
        area.padStart(8) +
        density.padStart(8) +
        country.padStart(18) +
        percentage.toString().padStart(6);
      console.log(stringRow);
    }
  }

  process() {
    this.addDensityPercentage();
    this.sortByDensity();
    this.display();
  }
}

const processor = new CityDataProcessor(data);
processor.process();
// processor.findMaxDensityInRow('incorrct-type');