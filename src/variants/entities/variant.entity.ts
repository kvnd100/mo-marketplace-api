import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
  Unique,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@Entity('variants')
@Unique(['productId', 'combinationKey'])
export class Variant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  productId: string;

  @Column()
  color: string;

  @Column()
  size: string;

  @Column()
  material: string;

  @Column()
  combinationKey: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ nullable: true })
  sku: string;

  @Column({ nullable: true })
  imageUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Product, (product) => product.variants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @BeforeInsert()
  @BeforeUpdate()
  generateCombinationKey() {
    this.combinationKey =
      `${this.color}-${this.size}-${this.material}`.toLowerCase();
  }
}
