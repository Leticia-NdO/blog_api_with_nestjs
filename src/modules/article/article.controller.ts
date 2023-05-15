import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'
import { User } from '../user/decorators/user.decorator'
import { AuthGuard } from '../user/guards/auth.guard'
import { UserEntity } from '../user/core/domain/user.entity'
import {
  CreateArticleUseCase,
  DeleteArticleBySlugUseCase,
  DislikeArticleUseCase,
  GetFeedUseCase,
  LikeArticleUseCase,
  ListAllArticlesUseCase,
  ListOwnArticlesUseCase,
  LoadArticleBySlugUseCase,
  UpdateArticleBySlugUseCase
} from './core/data'

import { PersistArticleRequest, PersistArticleDto } from './dto/persist-article.dto'
import { ArticleBulkResponseInterface } from './types/article-bulk-response.interface'
import { ArticleQueries } from './types/article-queries.interface'
import { ArticleResponseInterface } from './types/article-response.interface'
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'

@ApiTags('Articles')
@Controller('articles')
export class ArticleController {
  constructor (
    private readonly listAllUseCase: ListAllArticlesUseCase,
    private readonly listOwnArticlesUseCase: ListOwnArticlesUseCase,
    private readonly getFeedUseCase: GetFeedUseCase,
    private readonly createArticleUseCase: CreateArticleUseCase,
    private readonly loadArticleBySlugUseCase: LoadArticleBySlugUseCase,
    private readonly deleteArticleBySlugUseCase: DeleteArticleBySlugUseCase,
    private readonly updateArticleBySlugUseCase: UpdateArticleBySlugUseCase,
    private readonly likeArticleUseCase: LikeArticleUseCase,
    private readonly dislikeArticleUseCase: DislikeArticleUseCase
  ) {}


  /* ------------------------Swagger------------------------ */
  @ApiOperation({ summary: 'Return all articles that match the criteria in the queries' })
  @ApiOkResponse({ description: 'Successfully get articles' })
  @ApiForbiddenResponse({ description: 'Access Denied' })
  @ApiQuery({ name: 'tag', required: false, description: 'To get all the articles containing this specific tag' })
  @ApiQuery({ name: 'author', required: false, description: 'To get all the articles of this author' })
  @ApiQuery({ name: 'favorited', required: false, description: 'To get all the articles favorited by the given user' })
  @ApiQuery({ name: 'limit', required: false, description: 'To limit the amount of articles returned' })
  @ApiQuery({ name: 'offset', required: false, description: 'To define the starting point to display the set of articles' })
  @ApiBearerAuth('Authorization')
  /* ------------------------------------------------------- */
  @Get()
  async findAll (
    @User('id') userId: number,
      @Query() queries: ArticleQueries
  ): Promise<ArticleBulkResponseInterface> {
    return await this.listAllUseCase.findAll(userId, queries)
  }


  /* ------------------------Swagger------------------------ */
  @ApiOperation({ summary: 'Return all articles that made by the current user' })
  @ApiOkResponse({ description: 'Successfully get own articles' })
  @ApiForbiddenResponse({ description: 'Access Denied' })
  @ApiQuery({ name: 'limit', required: false, description: 'To limit the amount of articles returned' })
  @ApiQuery({ name: 'offset', required: false, description: 'To define the starting point to display the set of articles' })
  @ApiBearerAuth('Authorization')
  /* ------------------------------------------------------- */
  @Get('my-articles')
  async getOwnArticles (
    @User('id') userId: number,
      @Query() queries: ArticleQueries
  ): Promise<ArticleBulkResponseInterface> {
    return await this.listOwnArticlesUseCase.findAll(userId, queries)
  }


  /* ------------------------Swagger------------------------ */
  @ApiOperation({ summary: 'Return all articles made by users that the current user follows' })
  @ApiOkResponse({ description: 'Successfully get articles' })
  @ApiForbiddenResponse({ description: 'Access Denied' })
  @ApiQuery({ name: 'limit', required: false, description: 'To limit the amount of articles returned' })
  @ApiQuery({ name: 'offset', required: false, description: 'To define the starting point to display the set of articles' })
  @ApiBearerAuth('Authorization')
  /* ------------------------------------------------------- */
  @Get('feed')
  @UseGuards(AuthGuard)
  async getFeed (
    @User('id') userId: number,
      @Query() queries: ArticleQueries
  ): Promise<ArticleBulkResponseInterface> {
    return await this.getFeedUseCase.findAll(userId, queries)
  }


  /* ------------------------Swagger------------------------ */
  @ApiOperation({ summary: 'Creates an article' })
  @ApiCreatedResponse({ description: 'Successfully created an article' })
  @ApiForbiddenResponse({ description: 'Access Denied' })
  @ApiBody({ type: PersistArticleRequest })
  @ApiBearerAuth('Authorization')
  /* ------------------------------------------------------- */
  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard)
  async createArticle (
    @User() author: UserEntity,
      @Body('article') persistArticleDto: PersistArticleDto
  ): Promise<ArticleResponseInterface> {
    const articleEntity = await this.createArticleUseCase.create(
      author,
      persistArticleDto
    )

    return articleEntity
  }


  /* ------------------------Swagger------------------------ */
  @ApiOperation({ summary: `Returns one article based on it's slug` })
  @ApiOkResponse({ description: 'Successfully returned an article' })
  @ApiNotFoundResponse({ description: 'Article does not exist' })
  /* ------------------------------------------------------- */
  @Get(':slug')
  async getArticleBySlug (
    @Param('slug') slug: string
  ): Promise<ArticleResponseInterface> {
    const article = await this.loadArticleBySlugUseCase.load(slug)
    if (!article.article) { throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND) }

    return article
  }


  /* ------------------------Swagger------------------------ */
  @ApiOperation({ summary: `Delete one article based on it's slug` })
  @ApiCreatedResponse({ description: 'Successfully deleted an article' })
  @ApiNotFoundResponse({ description: 'Article does not exist' })
  @ApiForbiddenResponse({ description: `The current user is not the article's author` })
  @ApiBearerAuth('Authorization')
  /* ------------------------------------------------------- */
  @Delete(':slug')
  @HttpCode(204)
  @UseGuards(AuthGuard)
  async deleteArticleBySlug (
    @Param('slug') slug: string,
      @User('id') userId: number
  ): Promise<void> {
    const { article } = await this.loadArticleBySlugUseCase.load(slug)
    if (!article) { throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND) }
    if (article.author.id !== userId) { throw new HttpException('Forbideen action', HttpStatus.FORBIDDEN) }
    await this.deleteArticleBySlugUseCase.delete(slug)
  }


  /* ------------------------Swagger------------------------ */
  @ApiOperation({ summary: 'Updates an article' })
  @ApiOkResponse({ description: 'Successfully updated an article' })
  @ApiNotFoundResponse({ description: 'Article does not exist' })
  @ApiForbiddenResponse({ description: `The current user is not the article's author` })
  @ApiForbiddenResponse({ description: 'Access Denied' })
  @ApiBody({ type: PersistArticleRequest })
  @ApiBearerAuth('Authorization')
  /* ------------------------------------------------------- */
  @Put(':slug')
  @UseGuards(AuthGuard)
  async updateArticleBySlug (
    @Param('slug') slug: string,
      @User('id') userId: number,
      @Body('article') updateArticleDto: PersistArticleDto
  ): Promise<ArticleResponseInterface> {
    const { article } = await this.loadArticleBySlugUseCase.load(slug)
    if (!article) { throw new HttpException('Article does not exists', HttpStatus.NOT_FOUND) }
    if (article.author.id !== userId) { throw new HttpException('Forbideen action', HttpStatus.FORBIDDEN) }

    return await this.updateArticleBySlugUseCase.update(slug, updateArticleDto)
  }


  /* ------------------------Swagger------------------------ */
  @ApiOperation({ summary: 'Favorites an article' })
  @ApiCreatedResponse({ description: 'Successfully favorited an article' })
  @ApiNotFoundResponse({ description: 'Article does not exist' })
  @ApiForbiddenResponse({ description: 'Access Denied' })
  @ApiBearerAuth('Authorization')
  /* ------------------------------------------------------- */
  @Post(':slug/favorite')
  @UseGuards(AuthGuard)
  async likeArticle (
    @Param('slug') slug: string,
      @User('id') userId: number
  ): Promise<ArticleResponseInterface> {
    const { article } = await this.loadArticleBySlugUseCase.load(slug)
    if (!article) { throw new HttpException('Article does not exists', HttpStatus.NOT_FOUND) }

    return await this.likeArticleUseCase.like(slug, userId)
  }


  /* ------------------------Swagger------------------------ */
  @ApiOperation({ summary: 'Unfavorites an article' })
  @ApiOkResponse({ description: 'Successfully unfavorited an article' })
  @ApiNotFoundResponse({ description: 'Article does not exist' })
  @ApiForbiddenResponse({ description: 'Access Denied' })
  @ApiBearerAuth('Authorization')
  /* ------------------------------------------------------- */
  @Delete(':slug/favorite')
  @UseGuards(AuthGuard)
  async dislikeArticle (
    @Param('slug') slug: string,
      @User('id') userId: number
  ): Promise<ArticleResponseInterface> {
    const { article } = await this.loadArticleBySlugUseCase.load(slug)
    if (!article) { throw new HttpException('Article does not exists', HttpStatus.NOT_FOUND) }

    return await this.dislikeArticleUseCase.like(slug, userId)
  }
}
