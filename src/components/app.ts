import CarsCollection, { CarProps } from '../helpers/cars-collection';
import cars from '../data/cars';
import models from '../data/models';
import brands from '../data/brands';
import Table from './table';
import stringifyProps, { StringifyObjectProps } from '../helpers/stringify-props';
import SelectField from './select-field';
import CarJoined from '../types/car-joined';
import CarForm, { Values } from './car-form';

const ALL_BRANDS_ID = '-1' as const;
const ALL_BRANDS_TITLE = 'Visi automobiliai' as const;

type CarTableRow = StringifyObjectProps<Required<CarJoined>>;

class App {
  private htmlElement: HTMLElement;

  private selectedBrandId: null | string;

  private editedCarId: null | string;

  private brandSelect: SelectField;

  private carsCollection: CarsCollection;

  private carsTable: Table<CarTableRow>;

  private carForm: CarForm;

  constructor(selector: string) {
    const foundElement = document.querySelector<HTMLElement>(selector);

    if (foundElement === null) throw new Error(`Nerastas elementas su selektoriumi '${selector}'`);

    if (!(foundElement instanceof HTMLElement)) {
      throw new Error('Turi būti HTML elementas');
    }
    this.editedCarId = null;
    this.selectedBrandId = null;
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
      onDelete: this.handleDeleteCar,
      onEdit: this.handleEditCar,
      editedCarId: this.editedCarId,
    });

    this.brandSelect = new SelectField({
      labelText: '',
      options: [
        { title: ALL_BRANDS_TITLE, value: ALL_BRANDS_ID },
        ...brands.map(({ id, title }) => ({ title, value: id })),
      ],
      onChange: this.handleBrandChange,
    });

    const initialBrandId = brands[0].id;
    this.carForm = new CarForm({
      title: 'Sukurkite naują automobilį',
      values: {
        brand: initialBrandId,
        model: models.filter((m) => m.brandId === initialBrandId)[0].id,
        price: '0',
        year: '2000',
      },
      submitBtnText: 'Sukurti',
      onSubmit: this.handleCreateCar,
      status: 'create',

    });
  }

  private handleBrandChange = (brandId: string) => {
    const brand = brands.find((b) => b.id === brandId);
    this.selectedBrandId = brand ? brandId : null;
    this.renderView();
  };

  private handleDeleteCar = (carId: string) => {
    this.carsCollection.deleteCarById(carId);
    this.renderView();
  };

  private handleCreateCar = ({
    brand, model, price, year,
  }: Values): void => {
    const carProps: CarProps = {
      brandId: brand,
      modelId: model,
      price: Number(price),
      year: Number(year),
    };

    this.carsCollection.add(carProps);
    this.renderView();
  };

  // eslint-disable-next-line class-methods-use-this
  private handleEditCar = (carId: string) => {
    this.editedCarId = carId === this.editedCarId ? null : carId;

    this.renderView();
  };

  private handleUpdateCar = ({
    brand, model, price, year,
  }: Values) => {
    if (this.editedCarId) {
      const carProps:CarProps = {
        brandId: brand,
        modelId: model,
        price: Number(price),
        year: Number(year),
      };

      this.carsCollection.updateCar(this.editedCarId, carProps);
      this.editedCarId = null;

      this.renderView();
    }
  };

  public initialize = () => {
    const uxContainer = document.createElement('div');
    uxContainer.className = 'd-flex gap-4 align-items-start';
    uxContainer.append(
      this.carsTable.htmlElement,
      this.carForm.htmlElement,
    );

    const container = document.createElement('div');
    container.className = 'container d-flex flex-column my-5 gap-3';

    container.append(
      this.brandSelect.htmlElement,
      uxContainer,
    );

    this.htmlElement.append(container);
  };

  private renderView = () => {
    if (this.selectedBrandId === null) {
      this.carsTable.updateProps({
        title: ALL_BRANDS_TITLE,
        rowsData: this.carsCollection.all.map(stringifyProps),
        editedCarId: this.editedCarId,
      });
    } else {
      const brand = brands.find((b) => b.id === this.selectedBrandId);
      if (brand === undefined) throw new Error('Pasirinkta neegzistuojanti markė');

      this.carsTable.updateProps({
        title: `${brand.title} markės automobiliai`,
        rowsData: this.carsCollection.getByBrandId(this.selectedBrandId)
          .map(stringifyProps),
        editedCarId: this.editedCarId,

      });
    }

    if (this.editedCarId) {
      const editedCar = cars.find((c) => c.id === this.editedCarId);
      if (!editedCar) {
        alert('Nėra rasta mašina kurią bandote redaguoti');
        return;
      }
      const model = models.find((m) => m.id === editedCar.modelId);
      if (!model) {
        alert('Nėra rasta mašina kurią bandote redaguoti');
        return;
      }

      this.carForm.updateProps({
        title: 'Automobilio atnaujinimas',
        submitBtnText: 'Atnaujinti',
        status: 'update',
        values: {
          brand: model.brandId,
          model: model.id,
          price: String(editedCar.price),
          year: String(editedCar.year),
        },
        onSubmit: this.handleUpdateCar,
      });
    } else {
        const initialBrandId = brands[0].id;
        this.carForm.updateProps({
          title: 'Sukurti nauj1 automobili',
          submitBtnText: 'Sukurti ',
          status: 'create',
          values: {
            brand: initialBrandId,
            model: models.filter((m) => m.brandId === initialBrandId)[0].id,
            price: '',
            year: '',
          },
          onSubmit: this.handleCreateCar,
        });
    }
  };
}

export default App;
