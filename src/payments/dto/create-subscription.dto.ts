import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreateSubscriptionDto {
  @ApiProperty({
    description: 'Package ID to subscribe to',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  packageId: number;
}
