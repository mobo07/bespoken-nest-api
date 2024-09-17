import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/schemas/user.schema';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const newUser = await this.usersService.createUser(createUserDto);
    const { password, ...result } = newUser;
    return { message: 'User created successfully', user: result };
  }

  async login(user: User, res: Response) {
    const accessTokenExpiration = new Date();
    accessTokenExpiration.setMilliseconds(
      accessTokenExpiration.getTime() +
        parseInt(
          this.configService.getOrThrow<string>(
            'jwt.accessTokenExpirationInMs',
          ),
        ),
    );

    const refreshTokenExpiration = new Date();
    refreshTokenExpiration.setMilliseconds(
      refreshTokenExpiration.getTime() +
        parseInt(
          this.configService.getOrThrow<string>(
            'jwt.refreshTokenExpirationInMs',
          ),
        ),
    );

    const payload = { sub: user._id.toHexString(), role: user.role };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow('jwt.accessTokenSecret'),
      expiresIn: `${this.configService.getOrThrow('jwt.accessTokenExpirationInMs')}ms`,
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow('jwt.refreshTokenSecret'),
      expiresIn: `${this.configService.getOrThrow('jwt.refreshTokenExpirationInMs')}ms`,
    });

    await this.usersService.updateUser(
      { _id: user._id },
      { $set: { refreshToken: await bcrypt.hash(refreshToken, 10) } },
    );

    res.cookie('Authentication', accessToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      expires: accessTokenExpiration,
    });
    res.cookie('Refresh', refreshToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      expires: refreshTokenExpiration,
    });

    return res
      .status(201)
      .json({ statusCode: 201, message: 'Login successful' });
  }

  async verifyUser(email: string, password: string) {
    try {
      const user = await this.usersService.findUser({ email });
      const isPassword = await bcrypt.compare(password, user.password);
      if (!isPassword) throw new UnauthorizedException();
      return user;
    } catch (_err) {
      throw new UnauthorizedException('Wrong Credentials');
    }
  }

  async verifyUserRefreshToken(refreshToken: string, userId: string) {
    const user = await this.usersService.findUser({ _id: userId });
    const isValidRefreshToken = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    if (!isValidRefreshToken)
      throw new UnauthorizedException('Invalid refresh token');
    return user;
  }
}
