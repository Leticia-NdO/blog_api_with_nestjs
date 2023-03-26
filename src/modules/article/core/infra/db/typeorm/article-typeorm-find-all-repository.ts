import { DataSource, Repository } from 'typeorm';
import { FindAllArticlesRepositoryInterface } from '../../../domain/repository/article-find-all-repository';
import { ArticleEntity } from '../../../domain/article.entity';
import { ArticleBulkResponseInterface } from '@app/modules/article/types/article-bulk-response.interface';
import { ArticleQueries } from '@app/modules/article/types/article-queries.interface';
import { UserEntity } from '@app/modules/user/user.entity';

export class FindAllArticlesRepository
  implements FindAllArticlesRepositoryInterface
{
  constructor(
    private userRepository: Repository<UserEntity>,
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

    if (queries.offset) {
      queryBuilder.offset(queries.offset);
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
}
