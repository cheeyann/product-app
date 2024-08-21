import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

describe('ProductService', () => {
  let service: ProductService;
  let repository: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should create and return a new product', async () => {
    const createProductDto = {
      productCode: '1000',
      productDescription: 'Sedan',
      location: 'West Malaysia',
      price: 100,
    };
    const savedProduct = { id: 1, ...createProductDto };

    jest.spyOn(repository, 'create').mockReturnValue(savedProduct as any);
    jest.spyOn(repository, 'save').mockResolvedValue(savedProduct);

    const result = await service.create(createProductDto);
    expect(result).toEqual(savedProduct);
    expect(repository.create).toHaveBeenCalledWith(createProductDto);
    expect(repository.save).toHaveBeenCalledWith(savedProduct);
  });
  it('should return an array of products', async () => {
    const productArray = [
      {
        id: 1,
        productCode: '1000',
        productDescription: 'Sedan',
        location: 'West Malaysia',
        price: 100,
      },
      {
        id: 2,
        productCode: '1000',
        productDescription: 'SUV',
        location: 'West Malaysia',
        price: 200,
      },
    ];

    const queryBuilder: any = {
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue(productArray),
    };

    jest.spyOn(repository, 'createQueryBuilder').mockReturnValue(queryBuilder);
    const result = await service.findAll();
    expect(result).toEqual(productArray);
    expect(repository.createQueryBuilder).toHaveBeenCalledWith('product');
    expect(queryBuilder.getMany).toHaveBeenCalled();
  });
  it('should return an array of products when no filters are applied', async () => {
    const mockProducts = [
      {
        id: 1,
        productCode: '1000',
        productDescription: 'Sedan',
        location: 'West Malaysia',
        price: 100,
      },
      {
        id: 2,
        productCode: '1000',
        productDescription: 'SUV',
        location: 'West Malaysia',
        price: 200,
      },
    ];

    const queryBuilder: any = {
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue(mockProducts),
    };

    jest.spyOn(repository, 'createQueryBuilder').mockReturnValue(queryBuilder);

    const result = await service.findAll();
    expect(result).toEqual(mockProducts);
    expect(repository.createQueryBuilder).toHaveBeenCalledWith('product');
    expect(queryBuilder.getMany).toHaveBeenCalled();
  });

  it('should filter by productCode', async () => {
    const mockProducts = [
      {
        id: 1,
        productCode: '1000',
        productDescription: 'Sedan',
        location: 'West Malaysia',
        price: 100,
      },
    ];

    const queryBuilder: any = {
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue(mockProducts),
    };

    jest.spyOn(repository, 'createQueryBuilder').mockReturnValue(queryBuilder);

    const result = await service.findAll('1000');
    expect(result).toEqual(mockProducts);
    expect(queryBuilder.andWhere).toHaveBeenCalledWith(
      'product.productCode = :productCode',
      { productCode: '1000' },
    );
    expect(queryBuilder.getMany).toHaveBeenCalled();
  });

  it('should filter by location', async () => {
    const mockProducts = [
      {
        id: 1,
        productCode: '1000',
        productDescription: 'Sedan',
        location: 'West Malaysia',
        price: 100,
      },
    ];

    const queryBuilder: any = {
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue(mockProducts),
    };

    jest.spyOn(repository, 'createQueryBuilder').mockReturnValue(queryBuilder);

    const result = await service.findAll(undefined, 'West Malaysia');
    expect(result).toEqual(mockProducts);
    expect(queryBuilder.andWhere).toHaveBeenCalledWith(
      'product.location = :location',
      { location: 'West Malaysia' },
    );
    expect(queryBuilder.getMany).toHaveBeenCalled();
  });

  it('should filter by both productCode and location', async () => {
    const mockProducts = [
      {
        id: 1,
        productCode: '1000',
        productDescription: 'Sedan',
        location: 'West Malaysia',
        price: 100,
      },
    ];

    const queryBuilder: any = {
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue(mockProducts),
    };

    jest.spyOn(repository, 'createQueryBuilder').mockReturnValue(queryBuilder);

    const result = await service.findAll('1000', 'West Malaysia');
    expect(result).toEqual(mockProducts);
    expect(queryBuilder.andWhere).toHaveBeenCalledWith(
      'product.productCode = :productCode',
      { productCode: '1000' },
    );
    expect(queryBuilder.andWhere).toHaveBeenCalledWith(
      'product.location = :location',
      { location: 'West Malaysia' },
    );
    expect(queryBuilder.getMany).toHaveBeenCalled();
  });
  it('should update the product if it exists', async () => {
    const mockProduct = [
      {
        id: 1,
        productCode: '1000',
        productDescription: 'Sedan',
        location: 'West Malaysia',
        price: 100,
      },
    ];
    const updateProductDto = { location: 'West Malaysia', price: 150 };
    jest.spyOn(service, 'findAll').mockResolvedValue(mockProduct);

    const updateSpy = jest
      .spyOn(repository, 'update')
      .mockResolvedValue(undefined);

    await service.update('1000', updateProductDto);
    expect(service.findAll).toHaveBeenCalledWith('1000');
    expect(updateSpy).toHaveBeenCalledWith(
      { productCode: '1000' },
      updateProductDto,
    );
  });
  it('should throw NotFoundException if the product does not exist', async () => {
    const updateProductDto = { location: 'West Malaysia', price: 150 };

    jest.spyOn(service, 'findAll').mockResolvedValue([]);

    await expect(service.update('1000', updateProductDto)).rejects.toThrow(
      NotFoundException,
    );
    expect(service.findAll).toHaveBeenCalledWith('1000');
    expect(repository.update).not.toHaveBeenCalled();
  });
  it('should remove the product if it exists', async () => {
    const mockProduct = [
      {
        id: 1,
        productCode: '1000',
        productDescription: 'Sedan',
        location: 'West Malaysia',
        price: 100,
      },
    ];

    jest.spyOn(service, 'findAll').mockResolvedValue(mockProduct);
    const deleteSpy = jest
      .spyOn(repository, 'delete')
      .mockResolvedValue(undefined);

    await service.remove('1000');

    expect(service.findAll).toHaveBeenCalledWith('1000');
    expect(deleteSpy).toHaveBeenCalledWith({ productCode: '1000' });
  });

  it('should throw NotFoundException if the product does not exist', async () => {
    jest.spyOn(service, 'findAll').mockResolvedValue([]);

    await expect(service.remove('1000')).rejects.toThrow(NotFoundException);
    expect(service.findAll).toHaveBeenCalledWith('1000');
    expect(repository.delete).not.toHaveBeenCalled();
  });
});
