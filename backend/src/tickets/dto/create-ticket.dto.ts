import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTicketDto {
  @ApiProperty({
    example: 'Cannot access VPN',
    description: 'Short title describing the issue',
    minLength: 5,
    maxLength: 120,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(120)
  title: string;

  @ApiProperty({
    example: 'I have been unable to connect to the VPN since this morning. Error code: 800.',
    description: 'Detailed description of the issue',
    minLength: 10,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  description: string;
}
