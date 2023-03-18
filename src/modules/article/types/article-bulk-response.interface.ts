import { ArticleEntity } from '../article.entity';

export interface ArticleBulkResponseInterface {
  articles: ArticleEntity[];
  articlesCount: number;
}
