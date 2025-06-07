import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Package } from './entities/package.entity';

@Injectable()
export class PackagesService implements OnModuleInit {
  constructor(
    @InjectRepository(Package)
    private packageRepository: Repository<Package>,
  ) {}

  async onModuleInit() {
    // Seed default packages if they don't exist
    await this.seedDefaultPackages();
  }

  async findAll(): Promise<Package[]> {
    return this.packageRepository.find({
      where: { isActive: true },
      order: { durationDays: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Package | null> {
    return this.packageRepository.findOne({
      where: { id, isActive: true },
    });
  }

  async findByType(type: string): Promise<Package | null> {
    return this.packageRepository.findOne({
      where: { type, isActive: true },
    });
  }

  private async seedDefaultPackages() {
    const existingPackages = await this.packageRepository.count();

    if (existingPackages === 0) {
      const defaultPackages = [
        {
          name: 'Monthly Premium',
          type: 'monthly',
          description:
            'Access to all premium courses and features for 1 month. Perfect for trying out premium content.',
          price: 9.99,
          durationDays: 30,
          isActive: true,
        },
        {
          name: '6-Month Premium',
          type: 'semi_annual',
          description:
            'Access to all premium courses and features for 6 months. Great value with 20% savings compared to monthly.',
          price: 47.99,
          durationDays: 180,
          isActive: true,
        },
        {
          name: 'Annual Premium',
          type: 'annual',
          description:
            'Access to all premium courses and features for 1 year. Best value with 40% savings and priority support.',
          price: 71.99,
          durationDays: 365,
          isActive: true,
        },
        {
          name: 'Lifetime Premium',
          type: 'lifetime',
          description:
            'Lifetime access to all premium courses and features. One-time payment for unlimited learning.',
          price: 199.99,
          durationDays: null, // null for lifetime
          isActive: true,
        },
      ];

      for (const packageData of defaultPackages) {
        const packageEntity = this.packageRepository.create(packageData);
        await this.packageRepository.save(packageEntity);
      }

      console.log('Default subscription packages seeded successfully');
    }
  }
}
