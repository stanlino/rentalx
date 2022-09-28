import dayjs from 'dayjs';

import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { RentalsRepositoryInMemory } from '@modules/rentals/repositories/in-memory/RentalRepositoryInMemory';
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';

import { CreateRentalUseCase } from './CreateRentalUseCase';

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let dayjsDateProvider: DayjsDateProvider;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe('Create Rental', () => {
  const dayAdd24hours = dayjs().add(1, 'day').toDate();

  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    dayjsDateProvider = new DayjsDateProvider();
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      dayjsDateProvider,
      carsRepositoryInMemory,
    );
  });

  it('should be able to create a new rental', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'test',
      description: 'test',
      daily_rate: 100,
      license_plate: 'test',
      fine_amount: 40,
      category_id: '123',
      brand: 'test',
    });

    const rental = await createRentalUseCase.execute({
      car_id: car.id,
      expected_return_date: dayAdd24hours,
      user_id: '12345',
    });

    expect(rental).toHaveProperty('id');
    expect(rental).toHaveProperty('start_date');
  });

  it('should not be able to create a new rental if there is another open to the same user', async () => {
    await rentalsRepositoryInMemory.create({
      car_id: '111111',
      expected_return_date: dayAdd24hours,
      user_id: '12345',
    });

    await expect(
      createRentalUseCase.execute({
        car_id: '12345',
        expected_return_date: dayAdd24hours,
        user_id: '12345',
      }),
    ).rejects.toEqual(createRentalUseCase.errors.rentalOpenToUser);
  });

  it('should not be able to create a new rental if there is another open to the same car', async () => {
    await rentalsRepositoryInMemory.create({
      car_id: 'test',
      expected_return_date: dayAdd24hours,
      user_id: '12345',
    });

    await expect(
      createRentalUseCase.execute({
        car_id: 'test',
        expected_return_date: dayAdd24hours,
        user_id: '54321',
      }),
    ).rejects.toEqual(createRentalUseCase.errors.carIsUnavailable);
  });

  it('should not be able to create a new rental with invalid return time', async () => {
    expect(
      createRentalUseCase.execute({
        car_id: '12345',
        expected_return_date: dayjs().toDate(),
        user_id: '12345',
      }),
    ).rejects.toEqual(createRentalUseCase.errors.invalidReturnTime);
  });
});
