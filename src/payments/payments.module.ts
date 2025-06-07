import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { PaymentsService } from './payments.service';
import { PackagesService } from './packages.service';
import { PaymentCronService } from './cron.service';
import { PaymentsController } from './payments.controller';
import { PackagesController } from './packages.controller';
import { PaymentTransaction } from './entities/payment-transaction.entity';
import { Package } from './entities/package.entity';
import { User } from '../users/user.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentTransaction, Package, User]),
    ScheduleModule.forRoot(),
    UsersModule,
  ],
  controllers: [PaymentsController, PackagesController],
  providers: [PaymentsService, PackagesService, PaymentCronService],
  exports: [PaymentsService, PackagesService],
})
export class PaymentsModule {}
