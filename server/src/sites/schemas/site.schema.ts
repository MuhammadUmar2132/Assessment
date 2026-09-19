import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SiteDocument = Site & Document;

@Schema({ timestamps: true })
export class Site {
  @Prop({ required: true, unique: true, index: true, trim: true })
  address: string;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true, default: 'Anonymous' })
  author: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const SiteSchema = SchemaFactory.createForClass(Site);

// Full-text search index across content, title, and address
SiteSchema.index({
  title: 'text',
  content: 'text',
  address: 'text',
  tags: 'text',
}, {
  weights: {
    title: 10,
    address: 5,
    content: 1,
    tags: 2,
  },
  name: 'SiteTextIndex'
});

