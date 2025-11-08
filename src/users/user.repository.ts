import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/users.entity';
import { CreateUserDto } from './Dtos/createUser.dto';
import * as bcrypt from 'bcrypt';
import { Credential } from '../entities/credential.entity';
import { UpdateUserDto } from './Dtos/updateUser.dto';

@Injectable()
export class UsersRepository {
  subscriptionDataBase: any;
  
 
  async getByUserPhoneNumber(phoneNumber: number) {
     return await this.userDataBase.findOne({
    where: { phoneNumber },
  });
  }
  async getUserByEmail(email: string) {
    return await this.userDataBase.findOne({
    where: { email },
  });
  }
  constructor(
    @InjectRepository(User)
    private readonly userDataBase: Repository<User>,

    @InjectRepository(Credential)
    private readonly credentialDataBase: Repository<Credential>,
  ) {}

// metodo para obtener todos los usuarios
  async getAllUsersRepository() {
const users = await this.userDataBase.find({
      relations: ['credential'],
    });
    return users;
  }

// metodo para obtener un usuario por su ID

  async getUserByIdRepository(uuid: string) {
    return await this.userDataBase.findOne({
      where: { uuid: uuid },
      relations: ['credential'],
    });
    }

  // metodo para crear un nuevo usuario

  async createUserRepository(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Crear credenciales
    const newCredential = this.credentialDataBase.create({
      userName: createUserDto.userName,
      password: hashedPassword,
    });
    await this.credentialDataBase.save(newCredential);

    
    const [day, month, year] = createUserDto.birthDate.split('/');
    const newBirthDate = new Date(+year, +month - 1, +day);

   
    const newUser = this.userDataBase.create({
      name: createUserDto.name,
      lastName: createUserDto.lastName,
      email: createUserDto.email,
      phoneNumber: createUserDto.phoneNumber,
      birthDate: newBirthDate,
      credential: newCredential, 
    });

    await this.userDataBase.save(newUser);

    console.log(
      `Usuario creado: ${newUser.name} (${newCredential.userName})`,
    );

    return {
      message: `Usuario ${newUser.name} creado exitosamente en la base de datos.`,
    };
  }
    
   //metodo para actualizar un usuario
  async putUpdateUserRepository(
    userExisting: User,
    updateUserDto: UpdateUserDto,
  ) {
    if (updateUserDto.name) {
      userExisting.name = updateUserDto.name;
    }

    if (updateUserDto.lastName) {
      userExisting.lastName = updateUserDto.lastName;
    }

    if (updateUserDto.email) {
      userExisting.email = updateUserDto.email;
    }

    if (updateUserDto.phoneNumber) {
      userExisting.phoneNumber = updateUserDto.phoneNumber;
    }


    if (updateUserDto.birthDate) {
      userExisting.birthDate = new Date(updateUserDto.birthDate);
    }

    await this.userDataBase.save(userExisting);
    return { message: 'Usuario actualizado exitosamente' };
  }

  //metodo para hacer un softDelete del usuario

  async deleteUserRepository(userExisting: User) {
    userExisting.isActive = false;
    await this.userDataBase.save(userExisting);
    return { message: `El usuario ${userExisting.name} se desactivo` };
  }

}
