import { Body, Controller, Get, Post } from '@nestjs/common'
import { TagService } from './tag.service'
import { TagBulkResponseInterface } from './types/tag-bulk-response.interface'
import { CreateTagDto } from './dto/create-tag-dto'
import { TagResponseInterface } from './types/tag-response.interface'

@Controller('tags')
export class TagController {
  constructor (private readonly tagService: TagService) {}
  @Get()
  async findAll (): Promise<TagBulkResponseInterface> {
    const tags = await this.tagService.findAll()
    return {
      tags
    }
  }

  @Post()
  async createTag (@Body('tag') tag: CreateTagDto): Promise<TagResponseInterface> {
    const newTag = await this.tagService.create(tag)
    return {
      tag: newTag
    }
  }
}
