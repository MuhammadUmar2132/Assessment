import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Site, SiteDocument } from './schemas/site.schema';
import { CreateSiteDto } from './dto/create-site.dto';

@Injectable()
export class SitesService {
  constructor(
    @InjectModel(Site.name) private siteModel: Model<SiteDocument>,
  ) {}

  private normalizeAddress(address: string): string {
    if (!address) return '';
    return address.trim().replace(/^\/+|\/+$/g, '').toLowerCase();
  }

  async resolve(rawAddress: string): Promise<Site> {
    const address = this.normalizeAddress(rawAddress);
    const site = await this.siteModel.findOne({
      $or: [
        { address: address },
        { address: rawAddress.trim() }
      ]
    }).exec();

    if (!site) {
      throw new NotFoundException(`Address "${rawAddress}" was not found on the Small Web.`);
    }

    return site;
  }

  async publish(createSiteDto: CreateSiteDto): Promise<Site> {
    const address = this.normalizeAddress(createSiteDto.address);
    const existing = await this.siteModel.findOne({ address }).exec();

    if (existing) {
      existing.title = createSiteDto.title;
      existing.content = createSiteDto.content;
      existing.author = createSiteDto.author || existing.author;
      existing.updatedAt = new Date();
      return existing.save();
    }

    const newSite = new this.siteModel({
      ...createSiteDto,
      address,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return newSite.save();
  }

  async search(query: string): Promise<{ results: any[]; total: number; query: string }> {
    const trimmed = query?.trim() || '';
    if (!trimmed) {
      return { results: [], total: 0, query: '' };
    }

    // Try text search index first
    let sites = await this.siteModel
      .find(
        { $text: { $search: trimmed } },
        { score: { $meta: 'textScore' } }
      )
      .sort({ score: { $meta: 'textScore' } })
      .limit(30)
      .exec();

    // If text index gave no results (e.g. partial substring), fallback to case-insensitive regex
    if (!sites || sites.length === 0) {
      const regex = new RegExp(trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      sites = await this.siteModel
        .find({
          $or: [
            { title: regex },
            { address: regex },
            { content: regex },
          ]
        })
        .limit(30)
        .exec();
    }

    const results = sites.map(site => {
      // Generate clean snippet from HTML content
      const plainText = site.content
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      const lowerText = plainText.toLowerCase();
      const matchIndex = lowerText.indexOf(trimmed.toLowerCase());
      let snippet = '';

      if (matchIndex >= 0) {
        const start = Math.max(0, matchIndex - 40);
        const end = Math.min(plainText.length, matchIndex + trimmed.length + 60);
        snippet = (start > 0 ? '...' : '') + plainText.substring(start, end) + (end < plainText.length ? '...' : '');
      } else {
        snippet = plainText.substring(0, 100) + (plainText.length > 100 ? '...' : '');
      }

      return {
        address: site.address,
        title: site.title,
        author: site.author,
        snippet,
        updatedAt: site.updatedAt,
      };
    });

    return {
      results,
      total: results.length,
      query: trimmed,
    };
  }

  async findAll(limit = 100, skip = 0): Promise<{ sites: Site[]; total: number }> {
    const [sites, total] = await Promise.all([
      this.siteModel.find().sort({ address: 1 }).skip(skip).limit(limit).exec(),
      this.siteModel.countDocuments().exec(),
    ]);

    return { sites, total };
  }

  async count(): Promise<number> {
    return this.siteModel.countDocuments().exec();
  }
}
