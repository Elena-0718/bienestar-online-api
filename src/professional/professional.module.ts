import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfessionalService } from './professional.service';
import { ProfessionalController } from './professional.controller';
import { ProfessionalRepository } from './professional.repository';
import { Professional } from 'src/entities/professional.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Professional])],
  controllers: [ProfessionalController],
  providers: [ProfessionalService, ProfessionalRepository],
  exports: [ProfessionalService, ProfessionalRepository], 
})
export class ProfessionalModule {}
