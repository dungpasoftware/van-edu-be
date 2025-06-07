import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PackagesService } from './packages.service';
import { Package } from './entities/package.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('packages')
@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all subscription packages',
    description:
      'Retrieve all available subscription packages for normal users',
  })
  @ApiResponse({
    status: 200,
    description: 'List of subscription packages retrieved successfully',
    type: [Package],
  })
  async findAll(): Promise<Package[]> {
    return this.packagesService.findAll();
  }

  @Get('authenticated')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get subscription packages (authenticated)',
    description:
      'Retrieve subscription packages for authenticated users with personalized information',
  })
  @ApiResponse({
    status: 200,
    description: 'List of subscription packages retrieved successfully',
    type: [Package],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - JWT token required',
  })
  async findAllAuthenticated(): Promise<Package[]> {
    // In the future, this could include user-specific pricing or recommendations
    return this.packagesService.findAll();
  }
}
