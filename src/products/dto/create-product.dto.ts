import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { ProductType } from '../enums/product-type.enum';
import { Type } from 'class-transformer';

export class SizeInventoryDto {
  @IsString()
  size: string;

  @IsNumber()
  @Min(0)
  quantity: number;
}

export class CreateProductDto {
  @IsString()
  name: string;

  @IsEnum(ProductType)
  type: ProductType;

  @IsString()
  desc: string;

  @IsString()
  img: string;

  @IsArray()
  color: string[];

  @IsNumber()
  price: number;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => SizeInventoryDto)
  inventory: SizeInventoryDto[];

  @IsBoolean()
  customizable: boolean;
}
