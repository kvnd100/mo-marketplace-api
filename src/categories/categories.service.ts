import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';

const PREDEFINED_CATEGORIES = [
  'Automotive',
  'Baby',
  'Beauty & Personal Care',
  'Books',
  'Cell Phones & Accessories',
  'Clothing, Shoes & Jewelry',
  'Collectibles & Fine Art',
  'Computers & Accessories',
  'Electronics',
  'Garden & Outdoor',
  'Grocery & Gourmet Food',
  'Handmade',
  'Health & Household',
  'Home & Kitchen',
  'Industrial & Scientific',
  'Luggage & Travel Gear',
  'Movies & TV',
  'Musical Instruments',
  'Office Products',
  'Pet Supplies',
  'Sports & Outdoors',
  'Tools & Home Improvement',
  'Toys & Games',
  'Video Games',
];

@Injectable()
export class CategoriesService implements OnModuleInit {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find({ order: { name: 'ASC' } });
  }

  private async seed(): Promise<void> {
    const existing = await this.categoryRepository.count();
    if (existing > 0) return;

    const categories = PREDEFINED_CATEGORIES.map((name) =>
      this.categoryRepository.create({ name }),
    );
    await this.categoryRepository.save(categories);
    this.logger.log(`Seeded ${categories.length} predefined categories`);
  }
}
