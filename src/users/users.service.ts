import { Injectable } from '@nestjs/common';
import { UsersRepository } from './user.repository';


@Injectable()
export class UsersService {
    getUserByIdService(uuid: string) {
      throw new Error('Method not implemented.');
 
    }
     
    constructor(private readonly usersRepository: UsersRepository) {}
    getAllUsersService() {
        return this.usersRepository.getAllUsersRepository();
    }
}
