import { ArticleBulkResponseInterface } from '@app/modules/article/types/article-bulk-response.interface';
import { ArticleQueries } from '@app/modules/article/types/article-queries.interface';
import { DataSource } from 'typeorm';
import { ArticleEntity } from '../../../domain/article.entity';
import { FindAllArticlesRepositoryInterface } from '../../../domain/repository/article-find-all-repository';

export class FindOwnArticlesRepository
  implements FindAllArticlesRepositoryInterface
{
  constructor(private dataSource: DataSource) {}

  async findAll(
    userId: number,
    queries: ArticleQueries,
  ): Promise<ArticleBulkResponseInterface> {
    const queryBuilder = this.dataSource
      .getRepository(ArticleEntity)
      .createQueryBuilder('articles')
      .innerJoin('articles.author', 'author')
      .where('author.id = :id', { id: userId });

    const articlesCount = await queryBuilder.getCount();

    if (queries.limit) {
      queryBuilder.limit(queries.limit);
    }

    if (queries.offset) {
      queryBuilder.offset(queries.offset);
    }

    const articles = await queryBuilder.getMany();

    return {
      articles,
      articlesCount,
    };
  }
}
