import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'PRODUCT' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productCode: string;

  @Column()
  productDescription: string;

  @Column()
  location: string;

  @Column('decimal')
  price: number;
}
