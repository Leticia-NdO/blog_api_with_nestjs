import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { ArticleEntity } from './article.entity';
import { PersistArticleDto } from './dto/persist-article.dto';
import { ArticleResponseInterface } from './types/article-response.interface';
import slugify from 'slugify';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
  ) {}

  async createArticle(
    author: UserEntity,
    createArticleDto: PersistArticleDto,
  ): Promise<ArticleEntity> {
    const article = new ArticleEntity();
    Object.assign(article, createArticleDto);
    if (!article.tagList) article.tagList = [];
    article.slug = this.getSlug(article.title);
    article.author = author;
    return await this.articleRepository.save(article);
  }

  async loadArticleBySlug(slug: string): Promise<ArticleEntity> {
    const article = await this.articleRepository.findOne({
      where: {
        slug,
      },
    });

    if (!article)
      throw new HttpException('Article does not exists', HttpStatus.NOT_FOUND);

    return article;
  }

  async deleteArticleBySlug(
    userId: number,
    slug: string,
  ): Promise<DeleteResult> {
    const article = await this.loadArticleBySlug(slug);

    if (!article)
      throw new HttpException('Article does not exists', HttpStatus.NOT_FOUND);

    if (article.author.id !== userId)
      throw new HttpException('Forbideen action', HttpStatus.FORBIDDEN);

    return await this.articleRepository.delete(article.id);
  }

  async updateArticleBySlug(
    userId: number,
    slug: string,
    updateArticleDto: PersistArticleDto,
  ): Promise<ArticleEntity> {
    const article = await this.loadArticleBySlug(slug);

    if (!article)
      throw new HttpException('Article does not exists', HttpStatus.NOT_FOUND);

    if (article.author.id !== userId)
      throw new HttpException('Forbideen action', HttpStatus.FORBIDDEN);

    await this.articleRepository.update(
      {
        id: article.id,
      },
      updateArticleDto.title
        ? {
            ...updateArticleDto,
            slug: this.getSlug(updateArticleDto.title),
          }
        : updateArticleDto,
    );

    const updatedArticle = await this.articleRepository.findOne({
      where: {
        id: article.id,
      },
    });

    return updatedArticle;
  }

  buildArticleResponse(articleEntity: ArticleEntity): ArticleResponseInterface {
    return {
      article: articleEntity,
    };
  }

  private getSlug(title: string): string {
    return `${slugify(title, { lower: true })}-${(
      (Math.random() * Math.pow(36, 6)) |
      0
    ).toString(36)}`; // here we use Math class methods to generate a random integer and then toString to generate an unique string with it
  }
}
