import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HistoryEntry, HistoryDocument } from './schemas/history.schema';
import { CreateHistoryDto } from './dto/create-history.dto';

@Injectable()
export class HistoryService {
  constructor(
    @InjectModel(HistoryEntry.name) private historyModel: Model<HistoryDocument>,
  ) {}

  async findByUser(userId: string, limit = 100): Promise<HistoryEntry[]> {
    return this.historyModel
      .find({ userId })
      .sort({ visitedAt: -1 })
      .limit(limit)
      .exec();
  }

  async recordVisit(createHistoryDto: CreateHistoryDto): Promise<HistoryEntry> {
    const entry = new this.historyModel({
      ...createHistoryDto,
      visitedAt: new Date(),
    });
    return entry.save();
  }

  async updateScroll(userId: string, address: string, scrollY: number): Promise<void> {
    // Update latest visit scroll
    const latest = await this.historyModel
      .findOne({ userId, address })
      .sort({ visitedAt: -1 })
      .exec();

    if (latest) {
      latest.scrollY = scrollY;
      await latest.save();
    }
  }

  async clearUserHistory(userId: string): Promise<void> {
    await this.historyModel.deleteMany({ userId }).exec();
  }
}
