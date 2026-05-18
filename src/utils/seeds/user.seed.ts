import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '../../entities/users.entity';
import { Credential } from '../../entities/credential.entity';
import { Roles } from '../../enum/roles.enum';
import usersData from '../data/data.json';
import { UserSeedData } from '../interfaces/user-seed.interface';

export async function userSeed(
  dataSource: DataSource,
): Promise<void> {
  const userRepository = dataSource.getRepository(User);
  const credentialRepository = dataSource.getRepository(Credential);
  const data = usersData as UserSeedData[];

  console.log(`🌱 Seed de usuarios iniciado (${data.length} registros)`);

  for (const item of data) {
    const user = await userRepository.findOne({
      where: { email: item.email },
      relations: ['credential'],
    });

    /* =========================
       🔄 UPDATE
    ========================== */
    if (user) {
      user.fullName = item.fullName;
      user.document = item.document;
      user.email = item.email;
      user.phone = item.phone;
      user.address = item.address;
      user.birthDate = new Date(item.birthDate);
      user.sex = item.sex;
      user.objective = item.objective;
      user.observations = item.observations ?? null;
      user.photoUrl = item.photoUrl ?? null; // 🔥 CLAVE
      user.weight = item.weight ?? null;
      user.height = item.height ?? null;
      user.isActive = true;

      if (user.credential) {
        const hashedPassword = await bcrypt.hash(item.password, 10);
        user.credential.password = hashedPassword;
        user.credential.role = item.role as Roles;
        user.credential.isActive = true;

        await credentialRepository.save(user.credential);
      }

      await userRepository.save(user);

      console.log(`🔄 Usuario actualizado: ${user.email}`);
      continue;
    }

    /* =========================
       🆕 CREATE
    ========================== */
    const hashedPassword = await bcrypt.hash(item.password, 10);

    const newUser = new User();
    newUser.fullName = item.fullName;
    newUser.document = item.document;
    newUser.email = item.email;
    newUser.phone = item.phone;
    newUser.address = item.address;
    newUser.birthDate = new Date(item.birthDate);
    newUser.sex = item.sex;
    newUser.objective = item.objective;
    newUser.observations = item.observations ?? null;
    newUser.photoUrl = item.photoUrl ?? null;
    newUser.weight = item.weight ?? null;
    newUser.height = item.height ?? null;
    newUser.isActive = true;

    const credential = new Credential();
    credential.email = item.email;
    credential.password = hashedPassword;
    credential.role = item.role as Roles;
    credential.isActive = true;

    newUser.credential = credential;

    await userRepository.save(newUser);

    console.log(`✅ Usuario creado: ${newUser.email}`);
  }

  console.log('✅ Seed de usuarios finalizado');
}