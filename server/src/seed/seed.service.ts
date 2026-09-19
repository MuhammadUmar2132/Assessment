import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Site, SiteDocument } from '../sites/schemas/site.schema';
import { generateSeedSites } from './seed.data';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectModel(Site.name) private siteModel: Model<SiteDocument>,
  ) {}

  async seed(): Promise<{ inserted: number; total: number }> {
    this.logger.log('Starting Small Web database seeding...');
    const seedSites = generateSeedSites();

    // Upsert each site
    let insertedCount = 0;
    for (const site of seedSites) {
      await this.siteModel.updateOne(
        { address: site.address },
        {
          $set: {
            title: site.title,
            content: site.content,
            author: site.author,
            tags: site.tags,
            updatedAt: new Date(),
          },
          $setOnInsert: {
            createdAt: new Date(),
          }
        },
        { upsert: true }
      );
      insertedCount++;
    }

    const total = await this.siteModel.countDocuments();
    this.logger.log(`Seeding complete! Upserted ${insertedCount} sites. Total sites in database: ${total}`);
    return { inserted: insertedCount, total };
  }
}

