import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HistoryDocument = HistoryEntry & Document;

@Schema({ timestamps: true })
export class HistoryEntry {
  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ required: true, trim: true })
  address: string;

  @Prop({ required: true })
  title: string;

  @Prop({ default: 0 })
  scrollY: number;

  @Prop({ default: Date.now, index: true })
  visitedAt: Date;
}

export const HistorySchema = SchemaFactory.createForClass(HistoryEntry);
HistorySchema.index({ userId: 1, visitedAt: -1 });

