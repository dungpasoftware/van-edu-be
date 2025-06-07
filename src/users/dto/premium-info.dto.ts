import { ApiProperty } from '@nestjs/swagger';

export class PremiumInfoDto {
  @ApiProperty({
    description: 'Whether user has premium access',
    example: true,
  })
  isPremium: boolean;

  @ApiProperty({
    description: 'Premium expiry date (null for lifetime)',
    example: '2024-12-31T23:59:59.999Z',
    required: false,
  })
  premiumExpiryDate: Date | null;

  @ApiProperty({
    description: 'Current subscription package type',
    example: 'monthly',
    required: false,
  })
  currentPackage: string | null;

  @ApiProperty({
    description: 'Days remaining for premium access (null for lifetime)',
    example: 25,
    required: false,
  })
  daysRemaining: number | null;

  @ApiProperty({
    description: 'Whether premium is about to expire (less than 7 days)',
    example: false,
  })
  isExpiringSoon: boolean;
}
