import { Router } from 'express';

import { CreateCarControler } from '@modules/cars/useCases/createCar/CreateCarController';

const carsRoutes = Router();

const createCarController = new CreateCarControler();

carsRoutes.post('/', createCarController.handle);

export { carsRoutes };
