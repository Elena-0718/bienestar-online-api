import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/users.entity';
import { CredentialModule } from 'src/credential/credential.module';
import { Credential } from 'src/entities/credential.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Credential]), CredentialModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersRepository],
})
export class UsersModule {}
