import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { UserMiddleware } from '../auth/middleware/user.middleware';

@Module({
  imports: [AuthModule, UsersModule],
  providers: [UserMiddleware],
  exports: [UserMiddleware],
})
export class SharedModule {}
