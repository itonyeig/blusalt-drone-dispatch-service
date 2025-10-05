import { DroneModel } from '../drone/enums/drone-model.enum';

export function droneCapacity(model: DroneModel): number {
  switch (model) {
    case DroneModel.LIGHTWEIGHT:
      return 200;
    case DroneModel.MIDDLEWEIGHT:
      return 300;
    case DroneModel.CRUISERWEIGHT:
      return 400;
    case DroneModel.HEAVYWEIGHT:
      return 500;
    default:
      return 200;
  }
}
