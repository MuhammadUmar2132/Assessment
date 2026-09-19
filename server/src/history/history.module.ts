import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HistoryEntry, HistorySchema } from './schemas/history.schema';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: HistoryEntry.name, schema: HistorySchema }]),
  ],
  providers: [HistoryService],
  controllers: [HistoryController],
  exports: [HistoryService],
})
export class HistoryModule {}
