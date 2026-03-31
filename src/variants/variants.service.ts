import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Variant } from './entities/variant.entity';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';

@Injectable()
export class VariantsService {
  constructor(
    @InjectRepository(Variant)
    private readonly variantRepository: Repository<Variant>,
  ) {}

  async create(
    productId: string,
    createVariantDto: CreateVariantDto,
  ): Promise<Variant> {
    const combinationKey =
      `${createVariantDto.color}-${createVariantDto.size}-${createVariantDto.material}`
        .toLowerCase()
        .trim();

    await this.checkDuplicate(productId, combinationKey);

    const variant = this.variantRepository.create({
      ...createVariantDto,
      productId,
      combinationKey,
    });

    return this.variantRepository.save(variant);
  }

  async findAllByProduct(productId: string): Promise<Variant[]> {
    return this.variantRepository.find({ where: { productId } });
  }

  async findOne(id: string): Promise<Variant> {
    const variant = await this.variantRepository.findOne({
      where: { id },
      relations: ['product'],
    });

    if (!variant) {
      throw new NotFoundException(`Variant with ID "${id}" not found`);
    }

    return variant;
  }

  async update(
    id: string,
    updateVariantDto: UpdateVariantDto,
  ): Promise<Variant> {
    const variant = await this.findOne(id);

    const color = updateVariantDto.color ?? variant.color;
    const size = updateVariantDto.size ?? variant.size;
    const material = updateVariantDto.material ?? variant.material;

    const newCombinationKey =
      `${color}-${size}-${material}`.toLowerCase().trim();

    if (newCombinationKey !== variant.combinationKey) {
      await this.checkDuplicate(variant.productId, newCombinationKey);
    }

    Object.assign(variant, updateVariantDto, {
      combinationKey: newCombinationKey,
    });

    return this.variantRepository.save(variant);
  }

  async remove(id: string): Promise<void> {
    const variant = await this.findOne(id);
    await this.variantRepository.remove(variant);
  }

  private async checkDuplicate(
    productId: string,
    combinationKey: string,
  ): Promise<void> {
    const existing = await this.variantRepository.findOne({
      where: { productId, combinationKey },
    });

    if (existing) {
      throw new ConflictException(
        `Variant combination '${combinationKey}' already exists for this product`,
      );
    }
  }
}
