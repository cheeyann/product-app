import { IsString, IsDecimal } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  productCode: string;

  @ApiProperty()
  @IsString()
  productDescription: string;

  @ApiProperty()
  @IsString()
  location: string;

  @ApiProperty()
  @IsDecimal()
  price: number;
}
