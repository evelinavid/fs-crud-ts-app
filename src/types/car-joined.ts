import Car from "./car.js";

type CarJoined = Car & {
    brand: string
};

export default CarJoined;
