import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pay } from 'src/entities/pay.entity';
import { PayRepository } from './pay.repository';
import { PayService } from './pay.service';
import { PayController } from './pay.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Pay])],
  providers: [PayRepository, PayService],
  controllers: [PayController],
})
export class PayModule {}

