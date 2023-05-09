import { PersistArticleDto } from '@app/modules/article/dto/persist-article.dto'
import { Repository } from 'typeorm'
import { ArticleEntity } from '../../../domain/article.entity'
import { UpdateOneArticleRepositoryInterface } from '../../../domain/repository/update-one-repository-interface'
import { getSlug } from '../../adapters/create-slug-adapter'

export class UpdateOneArticleTypeormRepository
implements UpdateOneArticleRepositoryInterface {
  constructor (private readonly updateRepo: Repository<ArticleEntity>) {}
  async update (
    updateArticleDto: PersistArticleDto,
    slug: string
  ): Promise<ArticleEntity> {
    const article = await this.updateRepo.findOne({
      where: {
        slug
      }
    })

    await this.updateRepo.update(
      {
        id: article.id
      },
      updateArticleDto.title // if the title is to be updated the slug needs to be too
        ? {
            ...updateArticleDto,
            slug: getSlug(updateArticleDto.title)
          }
        : updateArticleDto
    )

    const updatedArticle = await this.updateRepo.findOne({
      where: {
        id: article.id
      }
    })

    return updatedArticle
  }
}
