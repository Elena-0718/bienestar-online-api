import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../entities/users.entity';
import { UserRepository } from './user.repository';
import { UserService } from './users.service';
import { UserController } from './users.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UserController],
  providers: [
    UserRepository,
    UserService,
  ],
  exports: [
    UserService,      // ✅ IMPORTANTE
    UserRepository,   // opcional, pero válido
  ],
})
export class UserModule {}

