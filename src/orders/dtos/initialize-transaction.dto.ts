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
// import { Design } from 'src/designs/schemas/design.schema';
// import { Product } from 'src/products/schemas/product.schema';
// import { User } from 'src/users/schemas/user.schema';

class OrderProductDto {
  @IsString()
  productId: string;

  @IsString()
  @IsOptional()
  designId: string;

  @IsString()
  @IsOptional()
  designImg: string;

  @IsString()
  @IsOptional()
  customizedOutfitImg: string;

  @IsInt()
  quantity: number;
}

export class InitializeTransactionDto {
  @IsEmail()
  email: string;

  @IsNumber()
  amount: number;

  @IsString()
  address: string;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => OrderProductDto)
  orderProducts: OrderProductDto[];
}
