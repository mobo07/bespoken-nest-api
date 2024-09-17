import { IsNumber, IsString } from 'class-validator';

export class CreateDesignDto {
  @IsString()
  name: string;

  @IsString()
  img: string;

  @IsNumber()
  price: number;
}
