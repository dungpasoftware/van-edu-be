import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/user.entity';
import { Package } from './package.entity';
import { PaymentStatus } from '../enums/payment-status.enum';

@Entity('payment_transaction')
export class PaymentTransaction {
  @ApiProperty({
    description: 'Transaction ID',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'User who made the payment',
  })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id', type: 'integer' })
  userId: number;

  @ApiProperty({
    description: 'Package being purchased',
  })
  @ManyToOne(() => Package)
  @JoinColumn({ name: 'package_id' })
  package: Package;

  @Column({ name: 'package_id', type: 'integer' })
  packageId: number;

  @ApiProperty({
    description: 'Payment amount',
    example: 9.99,
  })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @ApiProperty({
    description: 'Payment status',
    enum: PaymentStatus,
    example: PaymentStatus.PENDING,
  })
  @Column({
    name: 'status',
    type: 'varchar',
    length: 20,
    default: 'pending',
  })
  status: PaymentStatus;

  @ApiProperty({
    description: 'QR code data for payment',
    example: 'bank_qr_code_data_here',
  })
  @Column({ name: 'qr_code_data', type: 'text', nullable: true })
  qrCodeData: string;

  @ApiProperty({
    description: 'Payment reference number',
    example: 'PAY-2024-001',
  })
  @Column({
    name: 'reference_number',
    type: 'varchar',
    length: 255,
    unique: true,
  })
  referenceNumber: string;

  @ApiProperty({
    description: 'Payment expiry date (for QR code)',
    example: '2024-06-07T10:00:00.000Z',
  })
  @Column({ name: 'expires_at', type: 'timestamp' })
  expiresAt: Date;

  @ApiProperty({
    description: 'Admin who confirmed the payment',
  })
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'confirmed_by_id' })
  confirmedBy: User;

  @Column({ name: 'confirmed_by_id', type: 'integer', nullable: true })
  confirmedById: number;

  @ApiProperty({
    description: 'Payment confirmation date',
  })
  @Column({ name: 'confirmed_at', type: 'timestamp', nullable: true })
  confirmedAt: Date;

  @ApiProperty({
    description: 'Additional notes',
  })
  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @ApiProperty({
    description: 'Transaction creation date',
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    description: 'Transaction last update date',
  })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
