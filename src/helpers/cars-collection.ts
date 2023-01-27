/* eslint-disable @typescript-eslint/no-shadow */
import type Car from '../types/car.js';
import type Model from '../types/model.js';
import type Brand from '../types/brand.js';
import CarJoined from '../types/car-joined';

type CarsCollectionProps = {
    cars: Car[],
    brands: Brand[],
    models: Model[],
};

export type CarProps = {
    brandId: string,
    modelId: string,
    price: number,
    year: number
};

const createId = (): string => String(Math.floor(Math.random() * 100000000000));

class CarsCollection {
    private props: CarsCollectionProps;

    constructor(props: CarsCollectionProps) {
        this.props = props;
    }

    private joinCar = ({ modelId, ...car }: Car) => {
        const { brands, models } = this.props;
        const carModel = models.find((model) => model.id === modelId);
        const carBrand = brands.find((brand) => brand.id === carModel?.brandId);

        return {
            ...car,
            brand: (carBrand && carBrand.title) ?? 'unknown',
            model: (carModel && carModel.title) ?? 'unknown',
        };
    };

    public get all(): CarJoined[] {
        return this.props.cars.map(this.joinCar);
    }

    public getByBrandId = (brandId: string): CarJoined[] => {
        const { cars, models } = this.props;

        const brandModelsIds = models
            .filter((model) => model.brandId === brandId)
            .map((model) => model.id);

        const brandCars = cars
            .filter((car) => brandModelsIds.includes(car.modelId))
            .map(this.joinCar);

        return brandCars;
    };

    public getCarTitleById = (brandId: string) => {
        const { brands } = this.props;
        const brandFind = brands.find((brand) => brand.id === brandId);
        if (brandFind === undefined) {
            throw new Error(`Brand is not found: ${brandId}`);
        }
        return brandFind;
    };

    public deleteCarById = (carId: string) => {
        this.props.cars = this.props.cars.filter((car) => car.id !== carId);
    };

    public add = ({ modelId, brandId, ...carProps }: CarProps): void => {
        const { models, brands, cars } = this.props;
        const model = models.find((m) => m.id === modelId);
        const brand = brands.find((b) => b.id === brandId);

        if (!model || !brand) {
            throw new Error('Netinkami duomenys sukurti automobilį');
        }

        const newCar: Car = {
            id: createId(),
            ...carProps,
            modelId,
        };

        cars.push(newCar);
    };

    public updateCar = (carId: string, { modelId, brandId, ...props }: CarProps) => {
        const { cars, brands, models } = this.props;

        const updatedCarIndex = cars.findIndex((c) => c.id === carId);
        if (updatedCarIndex === undefined) {
            throw new Error('Produktas nerastas');
        }

        const model = models.find((m) => m.id === modelId);
        if (!model) {
            throw new Error(`Atnaujinimo klaida: nerastas mašinos modelis su id: '${modelId}'`);
        }

        const brand = brands.find((b) => b.id === brandId);
        if (!brand) {
            throw new Error(`Atnaujinimo klaida: nerasta mašinos markė su id: '${brandId}'`);
        }

        const updatedCar: Car = {
            ...cars[updatedCarIndex],
            ...props,
            modelId,
        };
        this.props.cars.splice(updatedCarIndex, 1, updatedCar);
    };
}

export default CarsCollection;
