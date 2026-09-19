import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SitesModule } from './sites/sites.module';
import { HistoryModule } from './history/history.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/smallweb'),
    SitesModule,
    HistoryModule,
    UsersModule,
  ],
})
export class AppModule {}

