import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @ApiProperty({
    description: 'Unique identifier for the user',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
  })
  @Column()
  fullName: string;

  @ApiProperty({
    description: 'Email address of the user (must be unique)',
    example: 'john.doe@example.com',
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    description: 'Hashed password of the user',
    example: '$2b$10$xyz...',
    writeOnly: true, // This will hide the password in API responses
  })
  @Column()
  password: string;

  @ApiProperty({
    description: 'Phone number of the user',
    example: '+1234567890',
    required: false,
  })
  @Column({ nullable: true })
  phone: string;

  @ApiProperty({
    description: 'Address of the user',
    example: '123 Main St, City, Country',
    required: false,
  })
  @Column({ nullable: true })
  address: string;

  @ApiProperty({
    description: 'Age of the user',
    example: 25,
    required: false,
  })
  @Column({ nullable: true })
  age: number;
}
