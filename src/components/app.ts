import CarsCollection from '../helpers/cars-collection';
import cars from '../data/cars';
import models from '../data/models';
import brands from '../data/brands';
import Table from './table';
import stringifyProps, { StringifyObjectProps } from '../helpers/stringify-props';
import SelectField, { type Option } from './select-field';
import type Brand from '../types/brand';
import CarJoined from '../types/car-joined';

const ALL_BRANDS_ID = '-1' as const;
const ALL_BRANDS_TITLE = 'Visi automobiliai' as const;

type CarTableRow = StringifyObjectProps<Required<CarJoined>>;

const brandValues = ({ id, title }: Brand):Option => ({
  value: id,
  text: title,
});

class App {
  private htmlElement: HTMLElement;

  private selectedBrandId:string;

  private carsCollection: CarsCollection;

  private carsTable: Table<CarTableRow>;

  constructor(selector: string) {
    const foundElement = document.querySelector<HTMLElement>(selector);

    if (foundElement === null) throw new Error(`Nerastas elementas su selektoriumi '${selector}'`);

    if (!(foundElement instanceof HTMLElement)) {
      throw new Error('Turi būti HTML elementas');
    }
    this.selectedBrandId = ALL_BRANDS_ID;
    this.htmlElement = foundElement;
    this.carsCollection = new CarsCollection({ cars, brands, models });

    this.carsTable = new Table({
      title: ALL_BRANDS_TITLE,
      columns: {
        id: 'Id',
        brand: 'Markė',
        model: 'Modelis',
        price: 'Kaina',
        year: 'Metai',
      },
      rowsData: this.carsCollection.all.map(stringifyProps),
    });
  }

  // eslint-disable-next-line class-methods-use-this
  handleBrandChange = (brandId:string) => {
    this.selectedBrandId = brandId;
    this.update();
    // const filteredBrands = this.carsCollection.getByBrandId(brandId);
    // console.table(filteredBrands);
  };

  initialize = () => {
    const select = new SelectField({
      options: [
        { value: ALL_BRANDS_ID, text: ALL_BRANDS_TITLE },
        ...brands.map(brandValues),
      ],
      onChange: this.handleBrandChange,
    });

    const container = document.createElement('div');
    container.className = 'container d-flex flex-column my-5 gap-3';
    container.append(
      select.htmlElement,
      this.carsTable.htmlElement,
       );

    this.htmlElement.append(container);
  };

  update = () => {
    if (this.selectedBrandId === ALL_BRANDS_ID) {
      this.carsTable.updateProps({
        title: ALL_BRANDS_TITLE,
        rowsData: this.carsCollection.all.map(stringifyProps),
      });
    } else {
      const brand = this.carsCollection.getCarTitleById(this.selectedBrandId);
      this.carsTable.updateProps({
        title: `${brand.title} markės automobiliai`,
        rowsData: this.carsCollection.getByBrandId(this.selectedBrandId)
        .map(stringifyProps),
      });
    }
  };
}

export default App;
