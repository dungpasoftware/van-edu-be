import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class ConfirmPaymentDto {
  @ApiProperty({
    description: 'Admin notes about the payment confirmation',
    example: 'Payment verified in bank account at 10:30 AM',
    required: false,
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
