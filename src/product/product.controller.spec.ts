import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../productAuth/roles.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { NotFoundException } from '@nestjs/common';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            findAll: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('create', () => {
    it('should call ProductService.create with the correct parameters', async () => {
      const createProductDto: CreateProductDto = {
        productCode: '1000',
        productDescription: 'Sedan',
        location: 'West Malaysia',
        price: 100,
      };
      jest
        .spyOn(service, 'create')
        .mockResolvedValue({ id: 1, ...createProductDto });

      const result = await controller.create(createProductDto);

      expect(result).toEqual(createProductDto);
      expect(service.create).toHaveBeenCalledWith(createProductDto);
    });
  });
  describe('findAll', () => {
    it('should call ProductService.findAll with the correct parameters', async () => {
      const mockProducts = [
        {
          id: 1,
          productCode: '1000',
          productDescription: 'Sedan',
          location: 'West Malaysia',
          price: 100,
        },
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(mockProducts);

      const result = await controller.findAll('PC001', 'NY');

      expect(result).toEqual(mockProducts);
      expect(service.findAll).toHaveBeenCalledWith('PC001', 'NY');
    });
  });

  describe('update', () => {
    it('should call ProductService.update with the correct parameters', async () => {
      const updateProductDto: UpdateProductDto = {
        location: 'West Malaysia',
        price: 150,
      };
      jest.spyOn(service, 'update').mockResolvedValue(undefined);

      await controller.update('1000', updateProductDto);

      expect(service.update).toHaveBeenCalledWith('1000', updateProductDto);
    });
  });

  describe('remove', () => {
    it('should call ProductService.remove with the correct parameters', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      await controller.remove('1000');

      expect(service.remove).toHaveBeenCalledWith('1000');
    });

    it('should throw NotFoundException if ProductService.remove throws NotFoundException', async () => {
      jest.spyOn(service, 'remove').mockRejectedValue(new NotFoundException());

      await expect(controller.remove('2000')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
