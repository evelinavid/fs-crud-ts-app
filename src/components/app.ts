import CarsCollection from '../helpers/cars-collection';
import cars from '../data/cars';
import models from '../data/models';
import brands from '../data/brands';
import Table from './table';

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
    console.log(this.carsCollection);
  }

  initialize = (): void => {
    const table = new Table({
      title: 'Visi automobiliai',
      columns: {
        id: 'pavadinimas',
        brand: 'Marke',
        model: 'modelis',
      },
      rowsData: [
        { id: 'Auto', brand: 'Opel', model: 'Astra' },
        { id: 'Auto', brand: 'Opel', model: 'Astra' },
        { id: 'Auto', brand: 'Opel', model: 'Astra' },
        { id: 'Auto', brand: 'Opel', model: 'Astra' },
      ],
    });
  this.htmlElement.append(table.htmlElement);
  };
}

export default App;
