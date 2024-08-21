import { Test, TestingModule } from '@nestjs/testing';
import { ProductModule } from './product.module';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';

describe('ProductModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [ProductModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide ProductService', () => {
    const productService = module.get<ProductService>(ProductService);
    expect(productService).toBeDefined();
  });

  it('should provide ProductController', () => {
    const productController = module.get<ProductController>(ProductController);
    expect(productController).toBeDefined();
  });

  it('should provide Product repository', () => {
    const productRepository = module.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
    expect(productRepository).toBeDefined();
  });
});
