import { Controller, Get } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagsModel } from './tags-model';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}
  @Get()
  async findAll(): Promise<TagsModel> {
    const tags = await this.tagService.findAll();
    return {
      tags: tags.map((tag) => tag.name),
    };
  }
}
