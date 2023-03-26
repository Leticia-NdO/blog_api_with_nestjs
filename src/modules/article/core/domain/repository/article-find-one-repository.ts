import { ArticleBulkResponseInterface } from '@app/modules/article/types/article-bulk-response.interface';
import { ArticleQueries } from '@app/modules/article/types/article-queries.interface';

export interface FindAllArticlesRepositoryInterface {
  findAll(
    userId: number,
    queries: ArticleQueries,
  ): Promise<ArticleBulkResponseInterface>;
}
