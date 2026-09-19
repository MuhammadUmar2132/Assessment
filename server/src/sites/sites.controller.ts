import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { SitesService } from './sites.service';
import { CreateSiteDto } from './dto/create-site.dto';

@Controller('api/sites')
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  @Get('resolve')
  async resolve(@Query('address') address: string) {
    return this.sitesService.resolve(address);
  }

  @Get('search')
  async search(@Query('q') query: string) {
    return this.sitesService.search(query);
  }

  @Get('list')
  async list(@Query('limit') limit = 100, @Query('skip') skip = 0) {
    return this.sitesService.findAll(Number(limit), Number(skip));
  }

  @Post()
  async publish(@Body() createSiteDto: CreateSiteDto) {
    return this.sitesService.publish(createSiteDto);
  }
}
