import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from './enums/user-role.enum';
import { AdminPermission } from './enums/admin-permission.enum';

@Entity('user')
export class User {
  @ApiProperty({
    description: 'Unique identifier for the user',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
  })
  @Column({ name: 'full_name' })
  fullName: string;

  @ApiProperty({
    description: 'Email address of the user (must be unique)',
    example: 'john.doe@example.com',
  })
  @Column({ name: 'email', unique: true })
  email: string;

  @ApiProperty({
    description: 'Hashed password of the user',
    example: '$2b$10$xyz...',
    writeOnly: true, // This will hide the password in API responses
  })
  @Column({ name: 'password' })
  password: string;

  @ApiProperty({
    description: 'Phone number of the user',
    example: '+1234567890',
    required: false,
  })
  @Column({ name: 'phone', nullable: true })
  phone: string;

  @ApiProperty({
    description: 'Address of the user',
    example: '123 Main St, City, Country',
    required: false,
  })
  @Column({ name: 'address', nullable: true })
  address: string;

  @ApiProperty({
    description: 'Age of the user',
    example: 25,
    required: false,
  })
  @Column({ name: 'age', nullable: true })
  age: number;

  @ApiProperty({
    description: 'Role of the user',
    enum: UserRole,
    example: UserRole.USER,
  })
  @Column({
    name: 'role',
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @ApiProperty({
    description: 'Premium status (only for normal users)',
    example: false,
    required: false,
  })
  @Column({ name: 'is_premium', default: false })
  isPremium: boolean;

  @ApiProperty({
    description: 'Premium expiry date (for premium users)',
    example: '2024-12-31T23:59:59.999Z',
    required: false,
  })
  @Column({ name: 'premium_expiry_date', type: 'timestamp', nullable: true })
  premiumExpiryDate: Date | null;

  @ApiProperty({
    description: 'Current subscription package type',
    example: 'monthly',
    required: false,
  })
  @Column({ name: 'current_package', type: 'varchar', nullable: true })
  currentPackage: string | null;

  @ApiProperty({
    description: 'Admin permissions (JSON array, only for admin users)',
    example: ['upload_video', 'create_category'],
    required: false,
  })
  @Column({
    name: 'permissions',
    type: 'json',
    nullable: true,
  })
  permissions: AdminPermission[];
}
