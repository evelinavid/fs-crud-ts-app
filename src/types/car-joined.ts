import Car from "./car.js";

type CarJoined = Car & {
    id: string
    price: number
    year: number
    brand: string
    model: string
};

export default CarJoined;
