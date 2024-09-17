import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  firstname: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastname: string;

  @ApiProperty({ example: 'johndoe@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'securepassword@123' })
  @IsNotEmpty()
  password: string;
}
