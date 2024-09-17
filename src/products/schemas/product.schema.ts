import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document } from 'mongoose';
import { ProductType } from '../enums/product-type.enum';

// export type ProductDocument = HydratedDocument<Product>;

@Schema()
export class SizeInventory {
  @Prop({ required: true })
  size: string;

  @Prop({ required: true, min: 0 })
  quantity: number;
}

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({
    type: String,
    required: true,
    enum: ProductType,
  })
  type: ProductType;

  @Prop({ required: true })
  desc: string;

  @Prop({ required: true })
  img: string;

  @Prop({ required: true })
  color: string[];

  @Prop({ type: [SizeInventory], required: true })
  inventory: SizeInventory[];

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  customizable: boolean;

  @Prop({ default: false })
  isOutOfStock: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
