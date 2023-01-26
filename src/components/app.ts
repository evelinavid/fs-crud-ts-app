import CarsCollection from '../helpers/cars-collection';
import cars from '../data/cars';
import models from '../data/models';
import brands from '../data/brands';
import Table from './table';
import stringifyProps from '../helpers/stringify-props';
import SelectField, { type Option } from './select-field';
import type Brand from '../types/brand';

const getByBrandId = ({ id, title }: Brand):Option => ({
  value: id,
  text: title,
});

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

  handleBrandChange = () => {
    console.log(this);
     console.log('pasikeite selectas');
  };

  initialize() {
    const select = new SelectField({
      options: brands.map(getByBrandId),
      onChange: this.handleBrandChange,
    });

    const table = new Table({
      title: 'Visi automobiliai',
      columns: {
        id: 'Id',
        brand: 'Markė',
        model: 'Modelis',
        price: 'Kaina',
        year: 'Metai',
      },
      rowsData: this.carsCollection.all.map(stringifyProps),
    });
    const container = document.createElement('div');
    container.className = 'container d-flex flex-column my-5 gap-3';
    container.append(
      select.htmlElement,
      table.htmlElement,
       );

    this.htmlElement.append(container);
  }
}

export default App;
