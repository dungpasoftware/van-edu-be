import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from './enums/user-role.enum';
import { AdminPermission } from './enums/admin-permission.enum';

@Entity('users')
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
  @Column({ name: 'full_name', type: 'varchar', length: 255 })
  fullName: string;

  @ApiProperty({
    description: 'Email address of the user (must be unique)',
    example: 'john.doe@example.com',
  })
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @ApiProperty({
    description: 'Hashed password of the user',
    example: '$2b$10$xyz...',
    writeOnly: true, // This will hide the password in API responses
  })
  @Column({ type: 'varchar', length: 255 })
  password: string;

  @ApiProperty({
    description: 'Phone number of the user',
    example: '+1234567890',
    required: false,
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  phone: string;

  @ApiProperty({
    description: 'Address of the user',
    example: '123 Main St, City, Country',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  address: string;

  @ApiProperty({
    description: 'Age of the user',
    example: 25,
    required: false,
  })
  @Column({ type: 'integer', nullable: true })
  age: number;

  @ApiProperty({
    description: 'Role of the user',
    enum: UserRole,
    example: UserRole.USER,
  })
  @Column({
    name: 'role',
    type: 'varchar',
    length: 20,
    default: 'user',
  })
  role: UserRole;

  @ApiProperty({
    description: 'Premium status (only for normal users)',
    example: false,
    required: false,
  })
  @Column({ name: 'is_premium', type: 'boolean', default: false })
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
  @Column({
    name: 'current_package',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  currentPackage: string | null;

  @ApiProperty({
    description: 'Admin permissions (JSON array, only for admin users)',
    example: ['upload_video', 'create_category'],
    required: false,
  })
  @Column({
    type: 'jsonb',
    nullable: true,
  })
  permissions: AdminPermission[];

  @ApiProperty({
    description: 'User creation date',
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    description: 'User last update date',
  })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
