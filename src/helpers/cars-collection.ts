import type Car from '../types/car.js';
import type Model from '../types/model.js';
import type Brand from '../types/brand.js';
import CarJoined from '../types/car-joined';

type CarsCollectionProps = {
cars:Car[],
brands: Brand[],
models:Model[],
};

class CarsCollection {
    private props: CarsCollectionProps;

constructor(props :CarsCollectionProps) {
this.props = props;
}

private joinCar = ({ modelId, ...car }:Car) => {
    const { brands, models } = this.props;
    const carModel = models.find((model) => model.id === modelId);
    const carBrand = brands.find((brand) => brand.id === carModel?.brandId);

    return {
        ...car,
        brand: (carBrand && carBrand.title) ?? 'unknown',
        model: (carModel && carModel.title) ?? 'unknown',
    };
};

public get all():CarJoined[] {
    return this.props.cars.map(this.joinCar);
}
}

export default CarsCollection;
