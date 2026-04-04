import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  In,
  MoreThanOrEqual,
  LessThanOrEqual,
  Between,
  FindOptionsWhere,
  FindOptionsOrder,
} from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }

  async findAll(query: PaginationQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<Product> = {};

    if (query.category?.length)
      where.category =
        query.category.length === 1 ? query.category[0] : In(query.category);
    if (query.brand?.length)
      where.brand = query.brand.length === 1 ? query.brand[0] : In(query.brand);
    if (query.condition?.length)
      where.condition =
        query.condition.length === 1 ? query.condition[0] : In(query.condition);
    if (query.minRating) where.rating = MoreThanOrEqual(query.minRating);
    if (query.stock === 'in-stock' || query.stock === 'true')
      where.stock = MoreThanOrEqual(1);
    else if (query.stock === 'out-of-stock') where.stock = 0;

    if (query.minPrice && query.maxPrice) {
      where.basePrice = Between(query.minPrice, query.maxPrice);
    } else if (query.minPrice) {
      where.basePrice = MoreThanOrEqual(query.minPrice);
    } else if (query.maxPrice) {
      where.basePrice = LessThanOrEqual(query.maxPrice);
    }

    const sortMap: Record<string, FindOptionsOrder<Product>> = {
      price_asc: { basePrice: 'ASC' },
      price_desc: { basePrice: 'DESC' },
      rating_desc: { rating: 'DESC' },
      newest: { createdAt: 'DESC' },
      oldest: { createdAt: 'ASC' },
    };
    const order: FindOptionsOrder<Product> = (query.sort
      ? sortMap[query.sort]
      : undefined) ?? { createdAt: 'DESC' };

    const [data, total] = await this.productRepository.findAndCount({
      where,
      relations: ['variants'],
      skip,
      take: limit,
      order,
    });

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['variants'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }

    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }
}
