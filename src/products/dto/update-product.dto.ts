import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ProductType } from '../enums/product-type.enum';
import { SizeInventoryDto } from './create-product.dto';
import { Type } from 'class-transformer';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsEnum(ProductType)
  type: ProductType;

  @IsOptional()
  @IsString()
  desc: string;

  @IsOptional()
  @IsString()
  img: string;

  @IsOptional()
  @IsArray()
  color: string[];

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => SizeInventoryDto)
  inventory: SizeInventoryDto[];

  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsBoolean()
  customizable: boolean;
}
