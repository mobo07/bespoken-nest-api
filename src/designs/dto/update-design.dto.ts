import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateDesignDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  img: string;

  @IsOptional()
  @IsNumber()
  price: number;
}
