import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { TagEntity } from './types/tag.entity'
import { CreateTagDto } from './dto/create-tag-dto'

@Injectable()
export class TagService {
  constructor (
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>
  ) {}

  async findAll (): Promise<TagEntity[]> {
    return await this.tagRepository.find()
  }

  async create (tagToCreated: CreateTagDto): Promise<TagEntity> {
    const newTag = new TagEntity()
    Object.assign(newTag, tagToCreated)
    return await this.tagRepository.save(newTag)
  }
}
