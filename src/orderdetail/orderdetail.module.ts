import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderDetail } from "src/entities/order_detail.entity";
import { OrderDetailRepository } from "./orderdetail.repository";
import { OrderDetailService } from "./orderdetail.service";
import { OrderDetailController } from "./orderdetail.controller";

@Module({
  imports: [TypeOrmModule.forFeature([OrderDetail])],
  controllers: [OrderDetailController],
  providers: [OrderDetailRepository, OrderDetailService],
  exports:[OrderDetailService],
})
export class OrderDetailModule {}

