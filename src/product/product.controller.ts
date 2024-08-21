import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Put,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../productAuth/roles.decorator';
import { RolesGuard } from '../productAuth/roles.guard';
import { Role } from '../productAuth/roles.enum';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Admin)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll(
    @Query('productCode') productCode?: string,
    @Query('location') location?: string,
  ) {
    return this.productService.findAll(productCode, location);
  }

  @Put()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Admin)
  update(
    @Query('productCode') productCode: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(productCode, updateProductDto);
  }

  @Delete()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Admin)
  remove(@Query('productCode') productCode: string) {
    return this.productService.remove(productCode);
  }
}
