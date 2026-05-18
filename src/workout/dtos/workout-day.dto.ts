import {
  IsString,
  IsOptional,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Exercisedto } from './exercise.dto';





export class WorkoutDayDto {
  @IsString()
  focus: string;

  @IsOptional()
  @IsString()
  warmUp?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Exercisedto)
  exercises: Exercisedto[];

  @IsOptional()
  @IsString()
  coolDown?: string;
}
