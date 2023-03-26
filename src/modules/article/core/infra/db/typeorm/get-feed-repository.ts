import { ArticleBulkResponseInterface } from '@app/modules/article/types/article-bulk-response.interface';
import { ArticleQueries } from '@app/modules/article/types/article-queries.interface';
import { FollowEntity } from '@app/modules/profile/follow.entity';
import { UserEntity } from '@app/modules/user/user.entity';
import { DataSource, Repository } from 'typeorm';
import { ArticleEntity } from '../../../domain/article.entity';
import { FindAllArticlesRepositoryInterface } from '../../../domain/repository/article-find-all-repository';

export class GetFeedRepository implements FindAllArticlesRepositoryInterface {
  constructor(
    private readonly userRepository: Repository<UserEntity>,
    private readonly followRepository: Repository<FollowEntity>,
    private dataSource: DataSource,
  ) {}

  async findAll(
    userId: number,
    queries: ArticleQueries,
  ): Promise<ArticleBulkResponseInterface> {
    const follows = await this.followRepository.find({
      where: {
        followerId: userId,
      },
    });

    if (follows.length === 0) {
      return {
        articles: [],
        articlesCount: 0,
      };
    }

    const followingIds = follows.map((foll) => foll.followingId);

    const queryBuilder = this.dataSource
      .getRepository(ArticleEntity) // criando um repositório relacionado a tabela de articles
      .createQueryBuilder('articles') // inicializando o queryBuilder e dando um alias pra tabela articles
      .leftJoinAndSelect('articles.author', 'author')
      .where('author.id IN (:...ids)', { ids: followingIds });

    queryBuilder.orderBy('articles.createdAt', 'DESC');

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

    const articlesCount = await queryBuilder.getCount();

    if (queries.limit) {
      queryBuilder.limit(queries.limit);
    }

    if (queries.offset) {
      queryBuilder.offset(queries.offset);
    }

    const articles = await queryBuilder.getMany();
    const articleWithFavorited = articles.map((article) => {
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
}
