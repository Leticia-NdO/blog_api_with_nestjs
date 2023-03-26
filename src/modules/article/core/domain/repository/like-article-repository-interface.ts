import { ArticleEntity } from '../article.entity';

export interface LikeArticleRepositoryInterface {
  like: (slug: string, userId: number) => Promise<ArticleEntity>;
}
