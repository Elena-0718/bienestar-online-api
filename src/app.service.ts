import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcrypt';

import { User } from './entities/users.entity';
import { Credential } from './entities/credential.entity';
import { Roles } from './enum/roles.enum';
import { Sex } from './enum/sex.enum';
import { Objective } from './enum/objective.enum';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Bienestar Online API 🚀';
  }
}

@Injectable()
export class DataLoaderUsers implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Credential)
    private readonly credentialRepo: Repository<Credential>,
  ) {}

  async onModuleInit() {
    try {
      const count = await this.userRepo.count();
      if (count > 0) {
        console.log('👤 Usuarios ya existen, no se cargan datos iniciales');
        return;
      }

      console.log('📦 Cargando usuarios iniciales...');

      // ✅ Ruta correcta (independiente de src / dist)
      const filePath = path.resolve(process.cwd(), 'src', 'utils', 'data.json');


      if (!fs.existsSync(filePath)) {
        console.warn('⚠️ Archivo utils/data.json no encontrado, se omite carga inicial');
        return;
      }

      const rawData = fs.readFileSync(filePath, 'utf-8');
      const users = JSON.parse(rawData);

      for (const data of users) {
        const hashedPassword = await bcrypt.hash(data.password, 10);

        /* ===== CREDENTIAL ===== */
        const credential = this.credentialRepo.create({
          email: data.email,
          password: hashedPassword,
          role: data.role as Roles,
          isActive: true,
        });

        await this.credentialRepo.save(credential);

        /* ===== USER ===== */
        const user = this.userRepo.create({
          fullName: data.fullName,
          document: data.document,
          email: data.email,
          phone: data.phone,
          address: data.address,
          birthDate: new Date(data.birthDate),
          sex: data.sex as Sex,
          objective: data.objective as Objective,
          isActive: true,
          credential,
        });

        await this.userRepo.save(user);
      }

      console.log('✅ Usuarios iniciales cargados correctamente');
    } catch (error) {
      console.error('❌ Error cargando usuarios iniciales:', error.message);
    }
  }
}
