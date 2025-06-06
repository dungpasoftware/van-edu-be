import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsNumber,
  Min,
  IsEnum,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { UserRole } from '../../users/enums/user-role.enum';
import { AdminPermission } from '../../users/enums/admin-permission.enum';

export class RegisterDto {
  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    description: 'Email address',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password (minimum 6 characters)',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Phone number',
    example: '+1234567890',
    required: false,
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description: 'Address',
    example: '123 Main St, City, Country',
    required: false,
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({
    description: 'Age',
    example: 25,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  age?: number;

  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    example: UserRole.USER,
    required: false,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiProperty({
    description: 'Premium status (for normal users)',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isPremium?: boolean;

  @ApiProperty({
    description: 'Admin permissions (only for admin users)',
    example: [AdminPermission.UPLOAD_VIDEO, AdminPermission.CREATE_CATEGORY],
    enum: AdminPermission,
    isArray: true,
    required: false,
  })
  @IsArray()
  @IsEnum(AdminPermission, { each: true })
  @IsOptional()
  permissions?: AdminPermission[];
}
