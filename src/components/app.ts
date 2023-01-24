import CarsCollection from '../helpers/cars-collection';
import cars from '../data/cars';
import models from '../data/models';
import brands from '../data/brands';

class App {
  private htmlElement: HTMLElement;

  private carsCollection: CarsCollection;

  constructor(selector: string) {
    const foundElement = document.querySelector<HTMLElement>(selector);

    if (foundElement === null) throw new Error(`Nerastas elementas su selektoriumi '${selector}'`);
    if (!(foundElement instanceof HTMLElement)) {
      throw new Error('Turi būti HTML elementas');
    }

    this.htmlElement = foundElement;
    this.carsCollection = new CarsCollection({ cars, brands, models });
  }

  initialize = (): void => {
    const container = document.createElement('div');
    container.className = 'container my-5';
    container.innerHTML = 'Laukiu kol būsiu sukurtas';

    this.htmlElement.append(container);
  };
}

export default App;
