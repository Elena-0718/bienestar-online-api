import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { Credential } from './entities/credential.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import path from 'path';
import { Roles } from './enum/roles.enum';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
@Injectable()
export class DataLoaderUsers implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userDataBase: Repository<User>,
    @InjectRepository(Credential)
    private readonly credentialDataBase: Repository<Credential>,
  ) {}

  async onModuleInit() {
    const usersCount = await this.userDataBase.count();

    if (usersCount === 0) {
      console.log('Cargando usuarios iniciales...');
      const queryRunner =
        this.userDataBase.manager.connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        const filePath = path.resolve(__dirname, "..","utils","data.json" );
        const rawData = fs.readFileSync('src/utils/data.json', 'utf-8');
        const users = JSON.parse(rawData) as Array<
          {
           
           userName: string;
           password: string;
           name: string;
           lastName: string;
           email: string;
           phoneNumber: number;
           birthDate: string;
           roles: string;
          }
        >;
           
        await Promise.all(
          users.map(async (user) => {
            const hashedPassword: string = await bcrypt.hash(user.password, 10);
            
            const newCredential = this.credentialDataBase.create({
              userName: user.userName,
              password: hashedPassword,
              roles: user.roles as Roles,
          });
          await queryRunner.manager.save(newCredential);

          const newUser = this.userDataBase.create({
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: Number(user.phoneNumber),
            birthDate: new Date(user.birthDate),
            credential: newCredential,
      });
          await queryRunner.manager.save(newUser);
        }),
        );
  
        await queryRunner.commitTransaction();
        console.log('Usuarios iniciales cargados correctamente.')

  } catch (error) {
    console.error('Error cargando usuarios iniciales:', error);
    await queryRunner.rollbackTransaction();
  } finally {
    await queryRunner.release();
  }

    } else {
      console.log('Los usuarios ya existen en la base de datos');
    }
  }
}