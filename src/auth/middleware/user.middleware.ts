import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/user.entity';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

interface JwtPayload {
  sub: number;
  email: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;

      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // Verify and decode the JWT token
        const payload = this.jwtService.verify<JwtPayload>(token);

        if (payload && payload.sub) {
          // Fetch full user data from database
          const user = await this.usersService.findOne(payload.sub);

          if (user) {
            // Attach user to request object
            req.user = user;
          }
        }
      }
    } catch (error) {
      // Token is invalid or expired, but we don't throw error here
      // Let the guards handle authentication requirements
    }

    next();
  }
}
