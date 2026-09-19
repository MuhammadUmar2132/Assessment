import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { HistoryService } from './history.service';
import { CreateHistoryDto } from './dto/create-history.dto';

@Controller('api/history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get(':userId')
  async getHistory(@Param('userId') userId: string) {
    return this.historyService.findByUser(userId);
  }

  @Post()
  async recordVisit(@Body() createHistoryDto: CreateHistoryDto) {
    return this.historyService.recordVisit(createHistoryDto);
  }

  @Post('scroll')
  async updateScroll(@Body() body: { userId: string; address: string; scrollY: number }) {
    await this.historyService.updateScroll(body.userId, body.address, body.scrollY);
    return { success: true };
  }

  @Delete(':userId')
  async clearHistory(@Param('userId') userId: string) {
    await this.historyService.clearUserHistory(userId);
    return { success: true };
  }
}
