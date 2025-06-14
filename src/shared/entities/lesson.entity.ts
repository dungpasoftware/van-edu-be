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
import { Course } from './course.entity';

@Entity('lessons')
export class Lesson {
  @ApiProperty({
    description: 'Lesson ID',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Course this lesson belongs to',
  })
  @ManyToOne(() => Course)
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @Column({ name: 'course_id' })
  courseId: number;

  @ApiProperty({
    description: 'Lesson title',
    example: 'Introduction to Node.js',
  })
  @Column()
  title: string;

  @ApiProperty({
    description: 'Lesson content',
    example: 'In this lesson, we will cover the basics of Node.js...',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  content: string | null;

  @ApiProperty({
    description: 'Video URL for this lesson',
    example: 'https://example.com/video.mp4',
    required: false,
  })
  @Column({ name: 'video_url', nullable: true })
  videoUrl: string | null;

  @ApiProperty({
    description: 'Lesson duration in seconds',
    example: 1800,
    required: false,
  })
  @Column({ nullable: true })
  duration: number | null;

  @ApiProperty({
    description: 'Lesson order within the course',
    example: 1,
  })
  @Column({ name: 'lesson_order', default: 0 })
  lessonOrder: number;

  @ApiProperty({
    description: 'Whether this lesson requires premium access',
    example: true,
  })
  @Column({ name: 'is_premium', default: true })
  isPremium: boolean;

  @ApiProperty({
    description: 'Lesson creation date',
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    description: 'Lesson last update date',
  })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
