import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderProduct } from './schemas/order.schema';
import { ProductsService } from 'src/products/products.service';
import { DesignsService } from 'src/designs/designs.service';
import { InitializeTransactionDto } from './dtos/initialize-transaction.dto';
import { User } from 'src/users/schemas/user.schema';
import { OrderStatus } from './enums/order-status.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private config: ConfigService,
    private productsService: ProductsService,
    private designsService: DesignsService,
  ) {}
  async initializeTransaction(
    user: User,
    { email, amount, address, orderProducts }: InitializeTransactionDto,
  ) {
    const amountToBePaid = await this.getOrderAmount(orderProducts);
    // console.log(amountToBePaid);
    if (amount !== amountToBePaid)
      throw new BadRequestException(
        'Invalid amount, please make sure you are paying the right amount for your order',
      );
    const data = await fetch(
      `${this.config.getOrThrow('paystack.baseUrl')}/transaction/initialize`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.config.getOrThrow<string>('paystack.secretKey')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          amount: amount * 100,
        }),
      },
    );
    const result = await data.json();

    await new this.orderModel({
      userId: user._id,
      orderProducts,
      address,
      totalPrice: amountToBePaid,
      reference: result.data.reference,
    }).save();
    return result;
  }

  async verifyOrder(user: User) {
    try {
      const order = await this.orderModel.findOne({ userId: user._id });
      await this.verifyTransaction(order.reference, order.totalPrice);
      await this.orderModel.findByIdAndUpdate(order._id, {
        $set: { status: OrderStatus.APPROVED },
      });
      return order;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  private async getOrderAmount(products: OrderProduct[]) {
    const productIds = products.map((p) => p.productId);
    const designIds = products.filter((p) => p.designId).map((p) => p.designId);

    const productsResult = await this.productsService.getOrderedProducts({
      _id: { $in: productIds },
    });
    const designsResult = await this.designsService.getOrderedDesigns({
      _id: { $in: designIds },
    });

    let productAmount = 0;
    let totalOrderAmount = 0;
    for (const product of products) {
      const existingProduct = productsResult.find((p) =>
        p._id.equals(product.productId),
      );
      productAmount += existingProduct.price;
      if (product.designId) {
        const existingDesign = designsResult.find((d) =>
          d._id.equals(product.designId),
        );
        productAmount += existingDesign.price;
      }
      productAmount *= product.quantity;
      totalOrderAmount += productAmount;
      productAmount = 0;
    }
    console.log(totalOrderAmount);
    return totalOrderAmount;
  }

  async verifyTransaction(reference: string, amount: number) {
    const data = await fetch(
      `${this.config.getOrThrow<string>('paystack.baseUrl')}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${this.config.getOrThrow<string>('paystack.secretKey')}`,
        },
      },
    );
    const res = await data.json();
    if (res.data.status !== 'success')
      throw new BadRequestException('Transaction not successful');
    if (res.data.amount / 100 !== amount)
      throw new BadRequestException('Invalid Transaction Amount');
    return res;
  }
}
