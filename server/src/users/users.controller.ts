import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Post()
  async create(@Body() body: { username: string; avatarColor?: string; title?: string }) {
    return this.usersService.create(body.username, body.avatarColor, body.title);
  }
}

