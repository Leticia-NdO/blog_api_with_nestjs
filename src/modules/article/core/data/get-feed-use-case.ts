import { ArticleBulkResponseInterface } from '../../types/article-bulk-response.interface';
import { ArticleQueries } from '../../types/article-queries.interface';
import { FindAllArticlesRepositoryInterface } from '../domain/repository/article-find-all-repository-interface';

export class GetFeedUseCase {
  constructor(
    private readonly findAllRepo: FindAllArticlesRepositoryInterface,
  ) {}

  async findAll(
    userId: number,
    queries: ArticleQueries,
  ): Promise<ArticleBulkResponseInterface> {
    const articles = await this.findAllRepo.findAll(userId, queries);
    return articles;
  }
}
