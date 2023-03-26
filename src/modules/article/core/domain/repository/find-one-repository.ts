import { ArticleEntity } from '../article.entity';

export interface FindOneArticleRepositoryInterface {
  findArticleBySlug: (slug: string) => Promise<ArticleEntity>;
}
