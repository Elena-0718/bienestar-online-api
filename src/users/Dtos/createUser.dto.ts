import { ApiProperty } from '@nestjs/swagger';
import { 
  IsDateString, IsEmail, IsEnum, IsNotEmpty, IsNumber, 
  IsOptional, IsString, Matches, MaxLength, Min, Max 
} from 'class-validator';
import { Type } from 'class-transformer';
import { Objective } from 'src/enum/objective.enum';
import { Sex } from 'src/enum/sex.enum';

export class CreateUserDto {
  @IsNotEmpty() @IsString() @MaxLength(150)
  fullName: string;

  @IsNotEmpty() @IsString() @Matches(/^\d+$/) @MaxLength(20)
  document: string;

  @IsNotEmpty() @IsDateString()
  birthDate: string;

  @IsNotEmpty() @IsEnum(Sex)
  sex: Sex;

  @IsNotEmpty() @IsString()
  phone: string;

  @IsNotEmpty({ message: 'La dirección es obligatoria para evitar error de DB.' })
  @IsString()
  address: string;

  @IsNotEmpty() @IsEmail() @MaxLength(150)
  email: string;

  @IsNotEmpty() @IsEnum(Objective)
  objective: Objective;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(30) @Max(300)
  weight?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1) @Max(250)
  height?: number;

  @IsOptional() @IsString() @MaxLength(500)
  observations?: string;

  @IsOptional() @IsString()
  photoUrl?: string;
}