import { IsOptional, IsISO8601 } from 'class-validator';

export class FilterProgressDto {
  /**
   * Fecha de inicio del rango (Ej: 2025-01-01)
   */
  @IsOptional()
  @IsISO8601({}, { message: 'La fecha "from" debe tener un formato ISO8601 válido (YYYY-MM-DD)' })
  from?: string;

  /**
   * Fecha de fin del rango (Ej: 2025-01-31)
   */
  @IsOptional()
  @IsISO8601({}, { message: 'La fecha "to" debe tener un formato ISO8601 válido (YYYY-MM-DD)' })
  to?: string;
}