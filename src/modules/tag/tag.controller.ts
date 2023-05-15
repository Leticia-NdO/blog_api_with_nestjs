import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, UseGuards } from '@nestjs/common'
import { TagService } from './tag.service'
import { TagBulkResponseInterface } from './types/tag-bulk-response.interface'
import { CreateTagDto, CreateTagRequest } from './dto/create-tag-dto'
import { TagResponseInterface } from './types/tag-response.interface'
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '../user/guards/auth.guard'

@ApiTags('Tags')
@Controller('tags')
export class TagController {
  constructor (private readonly tagService: TagService) {}

  /* ------------------------Swagger------------------------ */
  @ApiOperation({ summary: 'Gets all tags' })
  @ApiOkResponse({ description: 'Successfully got all the tags' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiBearerAuth('Authorization')
  /* ------------------------------------------------------- */
  @Get()
  @UseGuards(AuthGuard)
  async findAll (): Promise<TagBulkResponseInterface> {
    const tags = await this.tagService.findAll()
    return {
      tags
    }
  }


  /* ------------------------Swagger------------------------ */
  @ApiOperation({ summary: 'Creates a tag' })
  @ApiCreatedResponse({ description: 'Successfully created' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiConflictResponse({ description: 'Tag already exists'})
  @ApiBody({ type: CreateTagRequest })
  @ApiBearerAuth('Authorization')
  /* ------------------------------------------------------- */
  @Post()
  @UseGuards(AuthGuard)
  async createTag (@Body('tag') tag: CreateTagDto): Promise<TagResponseInterface> {
    const existingTag = await this.tagService.findOneTag(tag.name)
    if (existingTag) { throw new HttpException('Tag already exists', HttpStatus.CONFLICT) }
    const newTag = await this.tagService.create(tag)
    return {
      tag: newTag
    }
  }
}
