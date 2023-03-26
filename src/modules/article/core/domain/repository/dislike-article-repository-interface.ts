import { ArticleEntity } from '../article.entity';

export interface DislikeArticleRepositoryInterface {
  dislike: (slug: string, userId: number) => Promise<ArticleEntity>;
}
