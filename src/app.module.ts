import { Inject, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService, DataLoaderUsers } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { SupportModule } from './support/support.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeorm from './config/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseModule } from './purchase/purchase.module';
import { PayModule } from './pay/pay.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { CredentialController } from './credential/credential.controller';
import { CredentialModule } from './credential/credential.module';
import { User } from './entities/users.entity';
import { Credential } from './entities/credential.entity';
import { JwtModule } from '@nestjs/jwt';
import { OrderDetailModule } from './orderdetail/orderdetail.module';

@Module({
  
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
       load: [typeorm],  }),
       TypeOrmModule.forRootAsync({
       inject: [ConfigService],
        useFactory: (config: ConfigService) => config.get('typeorm') ?? {} ,
      }),
    
    TypeOrmModule.forFeature([User,Credential]), UsersModule, AuthModule, ProductsModule, SupportModule, OrderDetailModule, PurchaseModule, PayModule, SubscriptionModule, CredentialModule, 
    JwtModule.register({global:true,secret:process.env.JWT_SECRET, signOptions:{expiresIn:'1 h'}}) ],
  controllers: [AppController, CredentialController],
  providers: [AppService, DataLoaderUsers],
})
export class AppModule {}
