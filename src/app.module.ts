import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService, DataLoaderUsers } from './app.service';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import typeorm from './config/typeorm';

/* ✅ NUEVO */
import { ScheduleModule } from '@nestjs/schedule';

/* ===== ENTIDADES ===== */
import { User } from './entities/users.entity';
import { Credential } from './entities/credential.entity';

/* ===== MÓDULOS ===== */
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/users.module';
import { CredentialModule } from './credentials/credential.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { CartModule } from './cart/cart.module';

import { OrderModule } from './order/order.module';
import { OrderDetailModule } from './order-details/orderdetail.module';
import { PaymentModule } from './payments/payment.module';
import { SubscriptionModule } from './subscriptions/subscription.module';
import { PlanModule } from './plans/plan.module';
import { WorkoutModule } from './workout/workout.module';
import { ProgressModule } from './progress/progress.module';
import { ConsultationModule } from './consultation/consultation.module';
import { ProfessionalModule } from './professional/professional.module';
import { SupportModule } from './support/support.module';
import { NutritionModule } from './nutrition/nutrition.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { CartDetailModule } from './cart-details/cartDetail.module';
import { DeliveryModule } from './delivery/delivery.module';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'noridarueda37@gmail.com',
          pass: 'yuer ctcd vxcw rzkh',
        },
      },
      defaults: {
        from: '"Bienestar Online" <tu-correo@gmail.com>',
      },
    }),

    /* ✅ NUEVO: habilita @Cron, @Interval, etc */
    ScheduleModule.forRoot(),

    /* ===== CONFIG GLOBAL ===== */
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.development',
      load: [typeorm],
    }),

    /* ===== TYPEORM ===== */
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService): TypeOrmModuleOptions => {
        return config.getOrThrow<TypeOrmModuleOptions>('typeorm');
      },
    }),

    /* ===== JWT ===== */
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      global: true,
      useFactory: (config: ConfigService) => {
        const secret = config.get<string>('JWT_SECRET');
        if (!secret) throw new Error('❌ JWT_SECRET no está definido');

        return {
          secret,
          signOptions: { expiresIn: '1h' },
        };
      },
    }),

    /* ===== ENTIDADES GLOBALES ===== */
    TypeOrmModule.forFeature([User, Credential]),

    /* ===== DOMINIOS ===== */
    AuthModule,
    UserModule,
    CredentialModule,
    ProductsModule,
    CategoriesModule,
    CartModule,
    CartDetailModule,
    DeliveryModule,
    OrderModule,
    OrderDetailModule,
    PaymentModule,
    SubscriptionModule,
    PlanModule,
    NutritionModule,
    WorkoutModule,
    ProgressModule,
    ConsultationModule,
    ProfessionalModule,
    SupportModule,
  ],
  controllers: [AppController],
  providers: [AppService, DataLoaderUsers],
})
export class AppModule {}