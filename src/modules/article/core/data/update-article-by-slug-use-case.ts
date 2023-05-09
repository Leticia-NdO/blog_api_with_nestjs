import { PersistArticleDto } from '../../dto/persist-article.dto'
import { ArticleResponseInterface } from '../../types/article-response.interface'
import { UpdateOneArticleRepositoryInterface } from '../domain/repository/update-one-repository-interface'
import { buildArticleResponse } from './helpers/article-reponse-helper'

export class UpdateArticleBySlugUseCase {
  constructor (
    private readonly updateRepository: UpdateOneArticleRepositoryInterface
  ) {}

  async update (
    slug: string,
    updateArticleDto: PersistArticleDto
  ): Promise<ArticleResponseInterface> {
    const updatedArticle = await this.updateRepository.update(
      updateArticleDto,
      slug
    )

    return buildArticleResponse(updatedArticle)
  }
}
