import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Design } from 'src/designs/schemas/design.schema';
import { Product } from 'src/products/schemas/product.schema';
import { User } from 'src/users/schemas/user.schema';

class OrderProductDto {
  @IsString()
  productId: Product;

  @IsString()
  @IsOptional()
  designId: Design;

  @IsString()
  @IsOptional()
  designImg: string;

  @IsString()
  @IsOptional()
  customizedOutfitImg: string;

  @IsInt()
  quantity: number;
}

export class CreateOrderDto {
  @IsEmail()
  email: string;

  @IsNumber()
  amount: number;

  @IsString()
  userId: User;

  @IsString()
  address: string;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => OrderProductDto)
  orderProducts: OrderProductDto[];

  @IsString()
  reference: string;
}
