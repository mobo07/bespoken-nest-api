import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { InitializeTransactionDto } from './dtos/initialize-transaction.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/users/schemas/user.schema';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private ordersService: OrdersService) {}
  @Post('initialize')
  async initializeOrder(
    @CurrentUser() user: User,
    @Body() order: InitializeTransactionDto,
  ) {
    return await this.ordersService.initializeTransaction(user, order);
  }

  @Get('order/verify')
  async verifyOrder(@CurrentUser() user: User) {
    return await this.ordersService.verifyOrder(user);
  }
}
