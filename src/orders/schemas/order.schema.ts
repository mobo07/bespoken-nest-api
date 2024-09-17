import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { OrderStatus } from '../enums/order-status.enum';
import mongoose from 'mongoose';

@Schema()
export class OrderProduct {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  })
  productId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Design' })
  designId?: string;

  @Prop()
  designImg?: string;

  @Prop()
  customizedOutfitImg?: string;

  @Prop({ required: true })
  quantity: number;
}

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ type: String, enum: OrderStatus, default: OrderStatus.PENDING })
  status: string;

  @Prop({ type: [OrderProduct], required: true })
  orderProducts: OrderProduct[];

  @Prop({ required: true })
  address: string;

  @Prop()
  totalPrice: number;

  @Prop()
  reference?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
