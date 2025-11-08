import { Module } from '@nestjs/common';
import { CredentialController } from './credential.controller';
import { CredentialService } from './credential.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Credential } from 'src/entities/credential.entity';
import { CredentialRepository } from './credential.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Credential])],
  controllers: [CredentialController],
  providers: [CredentialService, CredentialRepository],
  exports: [CredentialRepository],
})
export class CredentialModule {}
