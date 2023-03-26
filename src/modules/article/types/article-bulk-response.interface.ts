import { ArticleEntity } from '../core/domain/article.entity';

export interface ArticleBulkResponseInterface {
  articles: ArticleEntity[];
  articlesCount: number;
}
