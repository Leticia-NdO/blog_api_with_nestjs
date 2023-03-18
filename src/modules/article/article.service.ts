import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { ArticleEntity } from './article.entity';
import { PersistArticleDto } from './dto/persist-article.dto';
import { ArticleResponseInterface } from './types/article-response.interface';
import slugify from 'slugify';
import { ArticleBulkResponseInterface } from './types/article-bulk-response.interface';
import { query } from 'express';
import { ArticleQueries } from './types/article-queries.interface';

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
    queries: ArticleQueries,
  ): Promise<ArticleBulkResponseInterface> {
    const queryBuilder = this.dataSource
      .getRepository(ArticleEntity) // criando um repositório relacionado a tabela de articles
      .createQueryBuilder('articles') // inicializando o queryBuilder e dando um alias pra tabela articles
      .leftJoinAndSelect('articles.author', 'author'); // damos um left join na tabela de user por meio da propriedade author (usamos o alias escolhido na linha de cima) e damos o alias de author pra esse left join

    queryBuilder.orderBy('articles.createdAt', 'DESC');

    if (queries.tag) {
      queryBuilder.andWhere('articles.tagList LIKE :tag', {
        // each "andWhere" adds another condition to the queryBuilder
        tag: `%${queries.tag}%`,
      });
    }

    if (queries.author) {
      queryBuilder.andWhere('author.username = :username', {
        username: queries.author,
      });
    }

    if (queries.favorited) {
      // here we're gonna find all the favorites articles of a given user
      const author = await this.userRepository.findOne({
        where: {
          username: queries.favorited,
        },
        relations: ['favorites'],
      });

      const favoritedArticlesIds = author.favorites.map(
        (favoritedArticle) => favoritedArticle.id,
      );
      if (favoritedArticlesIds.length > 0) {
        queryBuilder.andWhere('articles.id IN (:...ids)', {
          ids: favoritedArticlesIds,
        });
      } else {
        queryBuilder.andWhere('1=0');
      }
    }

    const articlesCount = await queryBuilder.getCount();

    if (queries.limit) {
      queryBuilder.limit(queries.limit);
    }

    let favoriteIds: number[] = [];

    if (userId) {
      // if the user is logged in we're gonna find all of it's favorite articles's ids
      const currentUser = await this.userRepository.findOne({
        where: {
          id: userId,
        },
        relations: ['favorites'],
      });

      favoriteIds = currentUser.favorites.map(
        (favoritedArticle) => favoritedArticle.id,
      );
    }

    const articles = await queryBuilder.getMany();
    const articleWithFavorited = articles.map((article) => {
      // we modifiy the articles including favorited property based on if the articles id is in favorite articles's ids of the logged user
      const isFavorited = favoriteIds.includes(article.id);
      return {
        ...article,
        favorited: isFavorited,
      };
    });

    return {
      articles: articleWithFavorited,
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
