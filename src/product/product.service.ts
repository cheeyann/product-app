import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }

  async findAll(productCode?: string, location?: string): Promise<Product[]> {
    const query = this.productRepository.createQueryBuilder('product');
    if (productCode) {
      query.andWhere('product.productCode = :productCode', { productCode });
    }
    if (location) {
      query.andWhere('product.location = :location', { location });
    }
    return query.getMany();
  }

  async update(
    productCode: string,
    updateProductDto: UpdateProductDto,
  ): Promise<void> {
    const product = await this.findAll(productCode);
    if (product.length === 0) {
      throw new NotFoundException();
    }
    await this.productRepository.update({ productCode }, updateProductDto);
  }

  async remove(productCode: string): Promise<void> {
    const product = await this.findAll(productCode);
    if (product.length === 0) {
      throw new NotFoundException();
    }
    await this.productRepository.delete({ productCode });
  }
}
