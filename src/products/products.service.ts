import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

    const qb = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.variants', 'variant');

    if (query.category?.length) {
      qb.andWhere('product.category IN (:...categories)', {
        categories: query.category,
      });
    }
    if (query.brand?.length) {
      qb.andWhere('product.brand IN (:...brands)', { brands: query.brand });
    }
    if (query.condition?.length) {
      qb.andWhere('product.condition IN (:...conditions)', {
        conditions: query.condition,
      });
    }
    if (query.minRating) {
      qb.andWhere('product.rating >= :minRating', {
        minRating: query.minRating,
      });
    }

    if (query.stock === 'in-stock' || query.stock === 'true') {
      qb.andWhere(
        `(product.stock > 0 OR EXISTS (
          SELECT 1 FROM variants v WHERE v."productId" = product.id AND v.stock > 0
        ))`,
      );
    } else if (query.stock === 'out-of-stock') {
      qb.andWhere(
        `product.stock = 0 AND NOT EXISTS (
          SELECT 1 FROM variants v WHERE v."productId" = product.id AND v.stock > 0
        )`,
      );
    }

    if (query.minPrice && query.maxPrice) {
      qb.andWhere('product.basePrice BETWEEN :minPrice AND :maxPrice', {
        minPrice: query.minPrice,
        maxPrice: query.maxPrice,
      });
    } else if (query.minPrice) {
      qb.andWhere('product.basePrice >= :minPrice', {
        minPrice: query.minPrice,
      });
    } else if (query.maxPrice) {
      qb.andWhere('product.basePrice <= :maxPrice', {
        maxPrice: query.maxPrice,
      });
    }

    const sortMap: Record<string, { field: string; order: 'ASC' | 'DESC' }> = {
      price_asc: { field: 'product.basePrice', order: 'ASC' },
      price_desc: { field: 'product.basePrice', order: 'DESC' },
      rating_desc: { field: 'product.rating', order: 'DESC' },
      newest: { field: 'product.createdAt', order: 'DESC' },
      oldest: { field: 'product.createdAt', order: 'ASC' },
    };
    const sort = (query.sort ? sortMap[query.sort] : undefined) ?? {
      field: 'product.createdAt',
      order: 'DESC' as const,
    };
    qb.orderBy(sort.field, sort.order);

    qb.skip(skip).take(limit);

    const [data, total] = await qb.getManyAndCount();

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
