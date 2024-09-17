import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { DesignsModule } from './designs/designs.module';
// import { JwtModule } from '@nestjs/jwt';
import { OrdersModule } from './orders/orders.module';
import config from './config/config';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({ isGlobal: true, cache: true, load: [config] }),
    // JwtModule.registerAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: async (config: ConfigService) => ({
    //     secret: config.getOrThrow<string>('jwt.secret'),
    //     signOptions: {
    //       expiresIn: config.getOrThrow<string | number>('jwt.expires'),
    //     },
    //   }),
    //   global: true,
    // }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config) => ({
        uri: config.get('database.connectionString'),
      }),
      inject: [ConfigService],
    }),
    ProductsModule,
    DesignsModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
