import { PersistArticleDto } from '@app/modules/article/dto/persist-article.dto'
import { ArticleEntity } from '../article.entity'

export interface UpdateOneArticleRepositoryInterface {
  update: (
    updateArticleDto: PersistArticleDto,
    slug: string,
  ) => Promise<ArticleEntity>
}
