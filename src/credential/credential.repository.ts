import { InjectRepository } from '@nestjs/typeorm';
import { Credential } from 'src/entities/credential.entity';
import { Roles } from 'src/enum/roles.enum';
import { CreateUserDto } from 'src/users/Dtos/createUser.dto';
import { Repository } from 'typeorm';

export class CredentialRepository {
  constructor(
    @InjectRepository(Credential)
    private readonly credentialDataBase: Repository<Credential>,
  ) {}
  //metodo para obtener un usuario por su username
  async getCredentialByUsername(userName: string) {
    return await this.credentialDataBase.findOne({
      where: { userName: userName },
      relations: ['user'],
    });
  }
async createCredential(createUserDto: CreateUserDto): Promise<Credential> {
    const newCredential = this.credentialDataBase.create({
  userName: createUserDto.userName,
  password: createUserDto.password,
  roles: Roles.USER,
    });

    return await this.credentialDataBase.save(newCredential);
  }
}