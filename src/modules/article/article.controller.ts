import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { User } from '../user/decorators/user.decorator';
import { UserEntity } from '../user/user.entity';
import { ArticleService } from './article.service';
import { PersistArticleDto } from './dto/persist-article.dto';
import { ArticleResponseInterface } from './types/article-response.interface';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async createArticle(
    @User() author: UserEntity,
    @Body('article') persistArticleDto: PersistArticleDto,
  ): Promise<ArticleResponseInterface> {
    const articleEntity = await this.articleService.createArticle(
      author,
      persistArticleDto,
    );

    return this.articleService.buildArticleResponse(articleEntity);
  }

  @Get(':slug')
  async getArticleBySlug(
    @Param('slug') slug: string,
  ): Promise<ArticleResponseInterface> {
    const articleEntity = await this.articleService.loadArticleBySlug(slug);
    return this.articleService.buildArticleResponse(articleEntity);
  }

  @Delete(':slug')
  @HttpCode(204)
  async deleteArticleBySlug(
    @Param('slug') slug: string,
    @User('id') userId: number,
  ): Promise<void> {
    await this.articleService.deleteArticleBySlug(userId, slug);
  }

  @Put(':slug')
  async updateArticleBySlug(
    @Param('slug') slug: string,
    @User('id') userId: number,
    @Body('article') updateArticleDto: PersistArticleDto,
  ): Promise<ArticleResponseInterface> {
    const articleEntity = await this.articleService.updateArticleBySlug(
      userId,
      slug,
      updateArticleDto,
    );
    return this.articleService.buildArticleResponse(articleEntity);
  }
}
