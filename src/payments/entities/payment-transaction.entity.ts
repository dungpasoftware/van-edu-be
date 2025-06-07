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

@Entity()
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
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @ApiProperty({
    description: 'Package being purchased',
  })
  @ManyToOne(() => Package)
  @JoinColumn({ name: 'packageId' })
  package: Package;

  @Column()
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
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @ApiProperty({
    description: 'QR code data for payment',
    example: 'bank_qr_code_data_here',
  })
  @Column({ type: 'text', nullable: true })
  qrCodeData: string;

  @ApiProperty({
    description: 'Payment reference number',
    example: 'PAY-2024-001',
  })
  @Column({ unique: true })
  referenceNumber: string;

  @ApiProperty({
    description: 'Payment expiry date (for QR code)',
    example: '2024-06-07T10:00:00.000Z',
  })
  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @ApiProperty({
    description: 'Admin who confirmed the payment',
  })
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'confirmedById' })
  confirmedBy: User;

  @Column({ nullable: true })
  confirmedById: number;

  @ApiProperty({
    description: 'Payment confirmation date',
  })
  @Column({ type: 'timestamp', nullable: true })
  confirmedAt: Date;

  @ApiProperty({
    description: 'Additional notes',
  })
  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @ApiProperty({
    description: 'Transaction creation date',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Transaction last update date',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
