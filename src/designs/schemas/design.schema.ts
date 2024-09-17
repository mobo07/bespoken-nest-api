import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<Design>;

@Schema({ timestamps: true })
export class Design {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  img: string;

  @Prop({ required: true })
  price: number;
}

export const DesignSchema = SchemaFactory.createForClass(Design);
