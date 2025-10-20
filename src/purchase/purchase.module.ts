import { Module } from '@nestjs/common';
import { PurchaseController } from './purchase.controller';
import { PurchaseService } from './purchase.service';
import { PurchaseRepository } from './purchase.repository';

@Module({
  controllers: [PurchaseController],
  providers: [PurchaseService, PurchaseRepository],
})
export class PurchaseModule {}
