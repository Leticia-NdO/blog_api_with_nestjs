import { PersistArticleDto } from '@app/modules/article/dto/persist-article.dto'
import { UserEntity } from '@app/modules/user/core/domain/user.entity'
import { ArticleEntity } from '../article.entity'

export interface CreateArticleRepositoryInterface {
  create: (
    author: UserEntity,
    articleToBeCreated: PersistArticleDto,
  ) => Promise<ArticleEntity>
}
