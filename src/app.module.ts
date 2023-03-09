import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TagModule } from './modules/tag/tag.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from './ormconfig';

@Module({
  imports: [TypeOrmModule.forRoot(config), TagModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
