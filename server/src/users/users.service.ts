import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async onModuleInit() {
    // Seed default personas if empty
    const count = await this.userModel.countDocuments().exec();
    if (count === 0) {
      const defaultUsers = [
        { username: 'Alice', avatarColor: '#ec4899', title: 'Curious Archivist' },
        { username: 'Bob', avatarColor: '#3b82f6', title: 'Hypertext Hacker' },
        { username: 'Charlie', avatarColor: '#10b981', title: 'Digital Botanist' },
        { username: 'Dana', avatarColor: '#f59e0b', title: 'Webring Navigator' },
        { username: 'Eve', avatarColor: '#8b5cf6', title: 'Cybernetic Poet' },
      ];
      await this.userModel.insertMany(defaultUsers);
    }
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().sort({ username: 1 }).exec();
  }

  async create(username: string, avatarColor?: string, title?: string): Promise<User> {
    const existing = await this.userModel.findOne({ username }).exec();
    if (existing) return existing;
    const user = new this.userModel({ username, avatarColor, title });
    return user.save();
  }
}

