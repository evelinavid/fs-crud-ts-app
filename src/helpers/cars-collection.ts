import type Car from "../types/car.js";
import type Model from "../types/model.js";
import type Brand from "../types/brand.js";
type CarsCollectionProps = {
car:Car[],
brand: Brand[],
model:Model[],
};

class CarsCollection {
    private car: Car[];
    private brand: Brand[];
    private model: Model[];
constructor({car, brand, model}:CarsCollectionProps){
    this.car = JSON.parse(JSON.stringify(car));
    this.brand = JSON.parse(JSON.stringify(brand));
    this.model = JSON.parse(JSON.stringify(model));
}
}

export default CarsCollection;
