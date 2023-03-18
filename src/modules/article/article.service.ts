import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { ArticleEntity } from './article.entity';
import { PersistArticleDto } from './dto/persist-article.dto';
import { ArticleResponseInterface } from './types/article-response.interface';
import slugify from 'slugify';
import { ArticleBulkResponseInterface } from './types/article-bulk-response.interface';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private dataSource: DataSource,
  ) {}

  async findAll(
    userId: number,
    queries: any,
  ): Promise<ArticleBulkResponseInterface> {
    const queryBuilder = this.dataSource
      .getRepository(ArticleEntity) // criando um repositório relacionado a tabela de articles
      .createQueryBuilder('articles') // inicializando o queryBuilder e dando um alias pra tabela articles
      .leftJoinAndSelect('articles.author', 'author'); // damos um left join na tabela de user por meio da propriedade author (usamos o alias escolhido na linha de cima) e damos o alias de author pra esse left join

    queryBuilder.orderBy('articles.createdAt', 'DESC');

    if (queries.tag) {
      queryBuilder.andWhere('articles.tagList LIKE :tag', {
        tag: `%${queries.tag}%`,
      });
    }

    if (queries.author) {
      queryBuilder.andWhere('author.username = :username', {
        username: queries.author,
      });
    }

    const articlesCount = await queryBuilder.getCount();

    if (queries.limit) {
      queryBuilder.limit(queries.limit);
    }

    const articles = await queryBuilder.getMany();

    return {
      articles: articles,
      articlesCount,
    };
  }

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
      updateArticleDto.title // if the title is to be updated the slug needs to be too
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

  async likeArticle(userId: number, slug: string): Promise<ArticleEntity> {
    const article = await this.loadArticleBySlug(slug);
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: ['favorites'],
    });

    if (!article)
      throw new HttpException('Article does not exists', HttpStatus.NOT_FOUND);

    const isFavorited =
      user.favorites.findIndex(
        (articleInFavorites) => articleInFavorites.id === article.id,
      ) !== -1;

    console.log(user);

    if (!isFavorited) {
      user.favorites.push(article);
      article.favorites++;
      await this.userRepository.save(user);
      await this.articleRepository.save(article);
    }

    return article;
  }

  async dislikeArticle(userId: number, slug: string): Promise<ArticleEntity> {
    const article = await this.loadArticleBySlug(slug);
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: ['favorites'],
    });

    if (!article)
      throw new HttpException('Article does not exists', HttpStatus.NOT_FOUND);

    const articleFavoriteIndex = user.favorites.findIndex(
      (articleInFavorites) => articleInFavorites.id === article.id,
    );

    console.log(user);

    if (articleFavoriteIndex >= 0) {
      user.favorites.splice(articleFavoriteIndex, 1);
      article.favorites--;
      await this.userRepository.save(user);
      await this.articleRepository.save(article);
    }

    return article;
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
