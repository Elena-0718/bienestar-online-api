import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { CredentialModule } from 'src/credential/credential.module';
import { AuthService } from './auth.service';

@Module({ 
  imports: [CredentialModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}