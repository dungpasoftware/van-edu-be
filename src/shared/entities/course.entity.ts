import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from './category.entity';

@Entity('courses')
export class Course {
  @ApiProperty({
    description: 'Course ID',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Course title',
    example: 'Complete Node.js Developer Course',
  })
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @ApiProperty({
    description: 'Course description',
    example: 'Learn Node.js from scratch and build real-world applications',
  })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({
    description: 'Category this course belongs to',
  })
  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ name: 'category_id', type: 'integer' })
  categoryId: number;

  @ApiProperty({
    description: 'Course thumbnail URL',
    example: 'https://example.com/thumbnail.jpg',
    required: false,
  })
  @Column({ name: 'thumbnail_url', type: 'varchar', length: 500, nullable: true })
  thumbnailUrl: string | null;

  @ApiProperty({
    description: 'Whether this course requires premium access',
    example: true,
  })
  @Column({ name: 'is_premium', type: 'boolean', default: true })
  isPremium: boolean;

  @ApiProperty({
    description: 'Whether this course is active',
    example: true,
  })
  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @ApiProperty({
    description: 'Course creation date',
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    description: 'Course last update date',
  })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
