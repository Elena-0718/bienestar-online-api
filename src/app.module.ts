import { Inject, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { SupportModule } from './support/support.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeorm from './config/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderdetailModule } from './orderdetail/orderdetail.module';
import { PurchaseModule } from './purchase/purchase.module';
import { PayModule } from './pay/pay.module';
import { SubscriptionModule } from './subscription/subscription.module';

@Module({
  
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
       load: [typeorm],  }),
       TypeOrmModule.forRootAsync({
       inject: [ConfigService],
        useFactory: (config: ConfigService) => config.get('typeorm') ?? {} ,
      }),
    
    UsersModule, AuthModule, ProductsModule, SupportModule, OrderdetailModule, PurchaseModule, PayModule, SubscriptionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
