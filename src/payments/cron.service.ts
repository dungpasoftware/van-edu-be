import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PaymentsService } from './payments.service';

@Injectable()
export class PaymentCronService {
  constructor(private readonly paymentsService: PaymentsService) {}

  // Run every hour to check for expired premium users
  @Cron(CronExpression.EVERY_HOUR)
  async handlePremiumExpiry() {
    console.log('Running premium expiry check...');
    try {
      await this.paymentsService.expirePremiumUsers();
    } catch (error) {
      console.error('Error in premium expiry check:', error);
    }
  }

  // Run every 6 hours to clean up expired payment transactions
  @Cron('0 */6 * * *') // Every 6 hours
  async handlePaymentCleanup() {
    console.log('Running payment transaction cleanup...');
    try {
      await this.paymentsService.expireOldTransactions();
    } catch (error) {
      console.error('Error in payment cleanup:', error);
    }
  }

  // Run daily at 2 AM to perform comprehensive cleanup
  @Cron('0 2 * * *') // Daily at 2 AM
  async handleDailyCleanup() {
    console.log('Running daily cleanup tasks...');
    try {
      await this.paymentsService.expirePremiumUsers();
      await this.paymentsService.expireOldTransactions();
      console.log('Daily cleanup completed successfully');
    } catch (error) {
      console.error('Error in daily cleanup:', error);
    }
  }
}
