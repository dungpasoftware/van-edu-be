import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsArray,
  IsEnum,
} from 'class-validator';
import { AdminPermission } from '../../users/enums/admin-permission.enum';

export class AdminRegisterDto {
  @ApiProperty({
    description: 'Full name of the admin',
    example: 'Admin User',
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    description: 'Email address',
    example: 'admin@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password (minimum 6 characters)',
    example: 'adminpass123',
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
    example: '123 Admin St, City, Country',
    required: false,
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({
    description: 'Age',
    example: 30,
    required: false,
  })
  @IsOptional()
  age?: number;

  @ApiProperty({
    description: 'Admin permissions',
    example: [
      AdminPermission.UPLOAD_VIDEO,
      AdminPermission.CREATE_CATEGORY,
      AdminPermission.VIEW_USERS,
    ],
    enum: AdminPermission,
    isArray: true,
  })
  @IsArray()
  @IsEnum(AdminPermission, { each: true })
  @IsNotEmpty()
  permissions: AdminPermission[];
}
