import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/auth/enums/role.enum';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from './schemas/user.schema';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@ApiCookieAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  async updateUser(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() userUpdate: UpdateUserDto,
  ) {
    if (user._id.toHexString() !== id)
      throw new UnauthorizedException('Unauthorized action');
    return await this.usersService.updateUser(
      { email: user.email },
      {
        $set: userUpdate,
      },
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
