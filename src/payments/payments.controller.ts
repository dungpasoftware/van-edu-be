import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
import { PaymentTransaction } from './entities/payment-transaction.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { UserRole } from '../users/enums/user-role.enum';

@ApiTags('payments')
@ApiBearerAuth('JWT-auth')
@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('subscribe')
  @UseGuards(RolesGuard)
  @Roles(UserRole.USER)
  @ApiOperation({
    summary: 'Create subscription payment',
    description:
      'Create a payment request for a subscription package (normal users only)',
  })
  @ApiResponse({
    status: 201,
    description: 'Payment request created successfully with QR code',
    type: PaymentTransaction,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid package or existing pending payment',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - JWT token required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Normal user role required',
  })
  async createSubscription(
    @CurrentUser() user: User,
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<PaymentTransaction> {
    try {
      return await this.paymentsService.createSubscription(
        user.id,
        createSubscriptionDto.packageId,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to create subscription',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('my-payments')
  @UseGuards(RolesGuard)
  @Roles(UserRole.USER)
  @ApiOperation({
    summary: 'Get user payment history',
    description: 'Get payment history for the current user',
  })
  @ApiResponse({
    status: 200,
    description: 'Payment history retrieved successfully',
    type: [PaymentTransaction],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - JWT token required',
  })
  async getUserPayments(
    @CurrentUser() user: User,
  ): Promise<PaymentTransaction[]> {
    return this.paymentsService.getUserPayments(user.id);
  }

  @Get('pending')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Get pending payments',
    description: 'Get all pending payment transactions (admin only)',
  })
  @ApiResponse({
    status: 200,
    description: 'Pending payments retrieved successfully',
    type: [PaymentTransaction],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - JWT token required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin role required',
  })
  async getPendingPayments(): Promise<PaymentTransaction[]> {
    return this.paymentsService.getPendingPayments();
  }

  @Patch(':id/confirm')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Confirm payment',
    description:
      'Confirm a payment transaction after verifying bank transfer (admin only)',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Payment transaction ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Payment confirmed successfully',
    type: PaymentTransaction,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Transaction not pending or expired',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - JWT token required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin role required',
  })
  @ApiResponse({
    status: 404,
    description: 'Transaction not found',
  })
  async confirmPayment(
    @Param('id') id: string,
    @CurrentUser() admin: User,
    @Body() confirmPaymentDto: ConfirmPaymentDto,
  ): Promise<PaymentTransaction> {
    try {
      return await this.paymentsService.confirmPayment(
        +id,
        admin.id,
        confirmPaymentDto.notes,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to confirm payment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
