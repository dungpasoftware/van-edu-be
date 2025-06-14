import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('package')
export class Package {
  @ApiProperty({
    description: 'Package ID',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Package name',
    example: 'Monthly Premium',
  })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({
    description: 'Package type identifier',
    example: 'monthly',
  })
  @Column({ type: 'varchar', length: 50, unique: true })
  type: string;

  @ApiProperty({
    description: 'Package description',
    example: 'Access to all premium courses for 1 month',
  })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({
    description: 'Package price in USD',
    example: 9.99,
  })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @ApiProperty({
    description: 'Duration in days (null for lifetime)',
    example: 30,
  })
  @Column({ name: 'duration_days', type: 'int', nullable: true })
  durationDays: number | null;

  @ApiProperty({
    description: 'Whether this package is active',
    example: true,
  })
  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @ApiProperty({
    description: 'Package creation date',
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    description: 'Package last update date',
  })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
