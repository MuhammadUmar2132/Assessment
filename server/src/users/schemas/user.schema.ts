import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, trim: true })
  username: string;

  @Prop({ default: '#3b82f6' })
  avatarColor: string;

  @Prop({ default: 'Explorer' })
  title: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

