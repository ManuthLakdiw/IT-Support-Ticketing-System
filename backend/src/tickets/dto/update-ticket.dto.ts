import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTicketDto {
  @ApiPropertyOptional({ example: 'Printer on Floor 2 not working', minLength: 5, maxLength: 120 })
  @IsOptional()
  @IsString()
  @MinLength(5, { message: 'Title must be at least 5 characters' })
  @MaxLength(120, { message: 'Title must be 120 characters or fewer' })
  title?: string;

  @ApiPropertyOptional({ example: 'The HP LaserJet on Floor 2 has stopped responding.', minLength: 10 })
  @IsOptional()
  @IsString()
  @MinLength(10, { message: 'Description must be at least 10 characters' })
  description?: string;
}
