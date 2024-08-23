import { Test, TestingModule } from '@nestjs/testing';
import { ProductModule } from './product.module';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
describe('ProductModule', () => {
  let module: TestingModule;
  let productService: ProductService;
  let productController: ProductController;
  let productRepository: Repository<Product>;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite', // Use SQLite for in-memory database testing
          database: ':memory:',
          entities: [Product],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Product]),
        ProductModule,
      ],
    }).compile();
    productService = module.get<ProductService>(ProductService);
    productController = module.get<ProductController>(ProductController);
    productRepository = module.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide ProductService', () => {
    expect(productService).toBeDefined();
  });

  it('should provide ProductController', () => {
    expect(productController).toBeDefined();
  });
  it('should provide Product repository', () => {
    expect(productRepository).toBeDefined();
  });
});
