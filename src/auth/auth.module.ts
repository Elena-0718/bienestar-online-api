import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CredentialModule } from 'src/credentials/credential.module';
import { UserModule } from 'src/users/users.module';

@Module({
  imports: [
    CredentialModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}


