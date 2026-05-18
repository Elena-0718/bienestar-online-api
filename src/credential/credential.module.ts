import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Credential } from '../entities/credential.entity';
import { CredentialRepository } from './credential.repository';
import { CredentialService } from './credential.service';
import { CredentialController } from './credential.controller';
import { User } from 'src/entities/users.entity';
import { CredentialMailerService } from './mailer.service';

@Module({
  imports: [TypeOrmModule.forFeature([Credential, User])],
  controllers: [CredentialController],
  providers: [CredentialService, CredentialRepository, CredentialMailerService],
  exports: [CredentialRepository],
})
export class CredentialModule {}
