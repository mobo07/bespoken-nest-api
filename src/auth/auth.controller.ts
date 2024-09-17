import { Body, Controller, Post, Response, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from 'src/users/schemas/user.schema';
import { Response as ExpressResponse } from 'express';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import {
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiCreatedResponse({
    description: 'User created successfully',
  })
  @ApiConflictResponse({ description: 'This user already exists' })
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @ApiOperation({ summary: 'Login a user' })
  @ApiBody({ type: LoginDto })
  @ApiCreatedResponse({ description: 'Login successful' })
  @ApiUnauthorizedResponse({ description: 'Wrong Credentials' })
  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(
    @CurrentUser() user: User,
    @Response({ passthrough: true }) res: ExpressResponse,
  ) {
    await this.authService.login(user, res);
  }

  @ApiOperation({ summary: 'Refresh access token after expiration' })
  @ApiCreatedResponse({ description: 'Login successful' })
  @ApiUnauthorizedResponse({ description: 'Invalid refresh token' })
  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  async refresh(
    @CurrentUser() user: User,
    @Response({ passthrough: true }) res: ExpressResponse,
  ) {
    await this.authService.login(user, res);
  }
}
