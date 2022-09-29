import { inject, injectable } from 'tsyringe';

import { IUserResponseDTO } from '@modules/accounts/dtos/IUserResponseDTO';
import { UserMap } from '@modules/accounts/mapper/UserMap';
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository';
import { AppError } from '@shared/errors/AppError';

@injectable()
export class ProfileUserUseCase {
  public errors = {
    userNotFound: new AppError('User not found!', 404),
  };

  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute(id: string): Promise<IUserResponseDTO> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw this.errors.userNotFound;
    }

    return UserMap.toDTO(user);
  }
}
