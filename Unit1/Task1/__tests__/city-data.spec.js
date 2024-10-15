'use strict';

const sinon = require('sinon');

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

describe('CityDataProcessor', () => {
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

  let processor;

  beforeEach(() => {
    processor = new CityDataProcessor(data);
  });

  test('1. constructor should parse 10 cities', () => {
    expect(processor.data.length).toBe(10);
    expect(processor.data[0][0]).toBe('Shanghai');
  });

  test('2. findMaxDensity should return the correct max density', () => {
    const maxDensity = processor.findMaxDensity();
    expect(maxDensity).toBe(13712);
  });

  // New test for findMaxDensityInRow
  test('3. findMaxDensityInRow should correctly calculate percentage', () => {
    const maxDensity = processor.findMaxDensity();
    const percentage = processor.findMaxDensityInRow(3826); // Shanghai's density
    expect(percentage).toBeCloseTo(28); // Shanghai's expected percentage
  });

  test('4. addDensityPercentage should add density percentage correctly', () => {
    processor.addDensityPercentage();
    expect(processor.data[0][5]).toBeCloseTo(28, 0); // Allow for rounding difference
    expect(processor.data[2][5]).toBe(100); // Lagos's density percentage
  });

  test('5. sortByDensity should sort cities by density percentage', () => {
    processor.addDensityPercentage();
    processor.sortByDensity();
    expect(processor.data[0][0]).toBe('Lagos'); // Lagos should be first after sorting
    expect(processor.data[9][0]).toBe('Istanbul'); // Istanbul should be last after sorting
  });

  test('6. process should call the full flow of methods', () => {
    const addDensityPercentageSpy = sinon.spy(processor, 'addDensityPercentage');
    const sortByDensitySpy = sinon.spy(processor, 'sortByDensity');
    const displaySpy = sinon.spy(processor, 'display');

    processor.process();

    expect(addDensityPercentageSpy.calledOnce).toBe(true);
    expect(sortByDensitySpy.calledOnce).toBe(true);
    expect(displaySpy.calledOnce).toBe(true);
  });

  test('7. display should log the data correctly', () => {
    console.log = jest.fn(); 
  
    processor.addDensityPercentage();
    processor.sortByDensity();
    processor.display();
  
    const normalize = (str) => str.replace(/\s+/g, ' ').trim();
  
    const expected = normalize('Lagos              16060303    1171   13712           Nigeria   100');
    const actualFirstLog = normalize(console.log.mock.calls[0][0]);
  
    expect(actualFirstLog).toBe(expected);
  
    const expectedLast = normalize('Istanbul           14160467    5461    2593            Turkey    19');
    const actualLastLog = normalize(console.log.mock.calls[console.log.mock.calls.length - 1][0]);
  
    expect(actualLastLog).toBe(expectedLast);
  });
});
