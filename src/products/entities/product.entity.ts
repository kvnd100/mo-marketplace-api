import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Variant } from '../../variants/entities/variant.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  basePrice: number;

  @Column({ nullable: true })
  imageUrl: string;

  @Column('simple-array', { nullable: true })
  images: string[];

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  brand: string;

  @Column({ nullable: true })
  condition: string;

  @Column('decimal', { precision: 3, scale: 2, nullable: true })
  rating: number;

  @Column({ type: 'int', nullable: true, default: 0 })
  reviewCount: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Variant, (variant) => variant.product, { cascade: true })
  variants: Variant[];
}
