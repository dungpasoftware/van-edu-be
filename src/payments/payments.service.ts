import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentTransaction } from './entities/payment-transaction.entity';
import { Package } from './entities/package.entity';
import { User } from '../users/user.entity';
import { PaymentStatus } from './enums/payment-status.enum';
import { UsersService } from '../users/users.service';
import { PackagesService } from './packages.service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(PaymentTransaction)
    private paymentRepository: Repository<PaymentTransaction>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private usersService: UsersService,
    private packagesService: PackagesService,
  ) {}

  async createSubscription(
    userId: number,
    packageId: number,
  ): Promise<PaymentTransaction> {
    // Validate user
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Validate package
    const packageEntity = await this.packagesService.findOne(packageId);
    if (!packageEntity) {
      throw new NotFoundException('Package not found');
    }

    // Check if user has pending payment for this package
    const existingPendingPayment = await this.paymentRepository.findOne({
      where: {
        userId,
        packageId,
        status: PaymentStatus.PENDING,
      },
    });

    if (existingPendingPayment) {
      throw new BadRequestException(
        'You already have a pending payment for this package',
      );
    }

    // Generate unique reference number
    const referenceNumber = this.generateReferenceNumber();

    // Generate QR code data (in real app, this would integrate with bank API)
    const qrCodeData = this.generateQRCodeData(
      packageEntity.price,
      referenceNumber,
    );

    // Create payment transaction
    const payment = this.paymentRepository.create({
      userId,
      packageId,
      amount: packageEntity.price,
      status: PaymentStatus.PENDING,
      qrCodeData,
      referenceNumber,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    });

    return this.paymentRepository.save(payment);
  }

  async confirmPayment(
    transactionId: number,
    adminId: number,
    notes?: string,
  ): Promise<PaymentTransaction> {
    const transaction = await this.paymentRepository.findOne({
      where: { id: transactionId },
      relations: ['user', 'package'],
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (transaction.status !== PaymentStatus.PENDING) {
      throw new BadRequestException('Transaction is not pending');
    }

    if (new Date() > transaction.expiresAt) {
      throw new BadRequestException('Transaction has expired');
    }

    // Update transaction
    transaction.status = PaymentStatus.CONFIRMED;
    transaction.confirmedById = adminId;
    transaction.confirmedAt = new Date();
    transaction.notes = notes || null;

    // Update user premium status
    await this.activateUserPremium(transaction.user.id, transaction.package);

    return this.paymentRepository.save(transaction);
  }

  async getUserPayments(userId: number): Promise<PaymentTransaction[]> {
    return this.paymentRepository.find({
      where: { userId },
      relations: ['package'],
      order: { createdAt: 'DESC' },
    });
  }

  async getPendingPayments(): Promise<PaymentTransaction[]> {
    return this.paymentRepository.find({
      where: { status: PaymentStatus.PENDING },
      relations: ['user', 'package'],
      order: { createdAt: 'DESC' },
    });
  }

  async expireOldTransactions(): Promise<void> {
    const expiredTransactions = await this.paymentRepository.find({
      where: {
        status: PaymentStatus.PENDING,
      },
    });

    const now = new Date();
    const toExpire = expiredTransactions.filter((t) => now > t.expiresAt);

    for (const transaction of toExpire) {
      transaction.status = PaymentStatus.EXPIRED;
      await this.paymentRepository.save(transaction);
    }

    if (toExpire.length > 0) {
      console.log(`Expired ${toExpire.length} old payment transactions`);
    }
  }

  async expirePremiumUsers(): Promise<void> {
    const now = new Date();

    const expiredUsers = await this.userRepository.find({
      where: {
        isPremium: true,
      },
    });

    const toExpire = expiredUsers.filter(
      (user) => user.premiumExpiryDate && now > user.premiumExpiryDate,
    );

    for (const user of toExpire) {
      user.isPremium = false;
      user.premiumExpiryDate = null;
      user.currentPackage = null;
      await this.userRepository.save(user);
    }

    if (toExpire.length > 0) {
      console.log(`Expired premium status for ${toExpire.length} users`);
    }
  }

  private async activateUserPremium(
    userId: number,
    packageEntity: Package,
  ): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) return;

    user.isPremium = true;
    user.currentPackage = packageEntity.type;

    if (packageEntity.durationDays) {
      // Calculate expiry date
      const expiryDate = new Date();

      // If user already has premium and it's not expired, extend from current expiry
      if (user.premiumExpiryDate && user.premiumExpiryDate > new Date()) {
        expiryDate.setTime(user.premiumExpiryDate.getTime());
      }

      expiryDate.setDate(expiryDate.getDate() + packageEntity.durationDays);
      user.premiumExpiryDate = expiryDate;
    } else {
      // Lifetime package
      user.premiumExpiryDate = null;
    }

    await this.userRepository.save(user);
  }

  private generateReferenceNumber(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `PAY-${timestamp.substring(-6)}-${random}`;
  }

  private generateQRCodeData(amount: number, reference: string): string {
    // In a real application, this would generate actual bank QR code data
    // For now, we'll return a mock QR code data structure
    return JSON.stringify({
      type: 'bank_transfer',
      bank: 'Your Bank Name',
      account: '1234567890',
      amount: amount,
      reference: reference,
      message: `Payment for premium subscription - ${reference}`,
    });
  }
}
