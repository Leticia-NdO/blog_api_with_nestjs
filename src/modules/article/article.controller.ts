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
  ValidationPipe,
} from '@nestjs/common';
import { User } from '../user/decorators/user.decorator';
import { AuthGuard } from '../user/guards/auth.guard';
import { UserEntity } from '../user/user.entity';
import {
  CreateArticleUseCase,
  DeleteArticleBySlugUseCase,
  DislikeArticleUseCase,
  GetFeedUseCase,
  LikeArticleUseCase,
  ListAllArticlesUseCase,
  ListOwnArticlesUseCase,
  LoadArticleBySlugUseCase,
  UpdateArticleBySlugUseCase,
} from './core/data';

import { PersistArticleDto } from './dto/persist-article.dto';
import { ArticleBulkResponseInterface } from './types/article-bulk-response.interface';
import { ArticleQueries } from './types/article-queries.interface';
import { ArticleResponseInterface } from './types/article-response.interface';

@Controller('articles')
export class ArticleController {
  constructor(
    private readonly listAllUseCase: ListAllArticlesUseCase,
    private readonly listOwnArticlesUseCase: ListOwnArticlesUseCase,
    private readonly getFeedUseCase: GetFeedUseCase,
    private readonly createArticleUseCase: CreateArticleUseCase,
    private readonly loadArticleBySlugUseCase: LoadArticleBySlugUseCase,
    private readonly deleteArticleBySlugUseCase: DeleteArticleBySlugUseCase,
    private readonly updateArticleBySlugUseCase: UpdateArticleBySlugUseCase,
    private readonly likeArticleUseCase: LikeArticleUseCase,
    private readonly dislikeArticleUseCase: DislikeArticleUseCase,
  ) {}

  @Get()
  async findAll(
    @User('id') userId: number,
    @Query() queries: ArticleQueries,
  ): Promise<ArticleBulkResponseInterface> {
    return await this.listAllUseCase.findAll(userId, queries);
  }

  @Get('my-articles')
  async getOwnArticles(
    @User('id') userId: number,
    @Query() queries: ArticleQueries,
  ): Promise<ArticleBulkResponseInterface> {
    return await this.listOwnArticlesUseCase.findAll(userId, queries);
  }

  @Get('feed')
  @UseGuards(AuthGuard)
  async getFeed(
    @User('id') userId: number,
    @Query() queries: ArticleQueries,
  ): Promise<ArticleBulkResponseInterface> {
    return await this.getFeedUseCase.findAll(userId, queries);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard)
  async createArticle(
    @User() author: UserEntity,
    @Body('article') persistArticleDto: PersistArticleDto,
  ): Promise<ArticleResponseInterface> {
    const articleEntity = await this.createArticleUseCase.create(
      author,
      persistArticleDto,
    );

    return articleEntity;
  }

  @Get(':slug')
  async getArticleBySlug(
    @Param('slug') slug: string,
  ): Promise<ArticleResponseInterface> {
    const article = await this.loadArticleBySlugUseCase.load(slug);
    if (!article.article)
      throw new HttpException('Article does not exists', HttpStatus.NOT_FOUND);

    return article;
  }

  @Delete(':slug')
  @HttpCode(204)
  @UseGuards(AuthGuard)
  async deleteArticleBySlug(
    @Param('slug') slug: string,
    @User('id') userId: number,
  ): Promise<void> {
    const { article } = await this.loadArticleBySlugUseCase.load(slug);
    if (!article)
      throw new HttpException('Article does not exists', HttpStatus.NOT_FOUND);
    if (article.author.id !== userId)
      throw new HttpException('Forbideen action', HttpStatus.FORBIDDEN);
    await this.deleteArticleBySlugUseCase.delete(slug);
  }

  @Put(':slug')
  @UseGuards(AuthGuard)
  async updateArticleBySlug(
    @Param('slug') slug: string,
    @User('id') userId: number,
    @Body('article') updateArticleDto: PersistArticleDto,
  ): Promise<ArticleResponseInterface> {
    const { article } = await this.loadArticleBySlugUseCase.load(slug);
    if (!article)
      throw new HttpException('Article does not exists', HttpStatus.NOT_FOUND);
    if (article.author.id !== userId)
      throw new HttpException('Forbideen action', HttpStatus.FORBIDDEN);

    return this.updateArticleBySlugUseCase.update(slug, updateArticleDto);
  }

  @Post(':slug/favorite')
  @UseGuards(AuthGuard)
  async likeArticle(
    @Param('slug') slug: string,
    @User('id') userId: number,
  ): Promise<ArticleResponseInterface> {
    const { article } = await this.loadArticleBySlugUseCase.load(slug);
    if (!article)
      throw new HttpException('Article does not exists', HttpStatus.NOT_FOUND);

    return this.likeArticleUseCase.like(slug, userId);
  }

  @Delete(':slug/favorite')
  @UseGuards(AuthGuard)
  async dislikeArticle(
    @Param('slug') slug: string,
    @User('id') userId: number,
  ): Promise<ArticleResponseInterface> {
    const { article } = await this.loadArticleBySlugUseCase.load(slug);
    if (!article)
      throw new HttpException('Article does not exists', HttpStatus.NOT_FOUND);

    return this.dislikeArticleUseCase.like(slug, userId);
  }
}
