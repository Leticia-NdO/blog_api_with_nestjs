import { ArticleResponseInterface } from '../../types/article-response.interface'
import { FindOneArticleRepositoryInterface } from '../domain/repository/find-one-repository-interface'
import { buildArticleResponse } from './helpers/article-reponse-helper'

export class LoadArticleBySlugUseCase {
  constructor (
    private readonly findArticleRepository: FindOneArticleRepositoryInterface
  ) {}

  async load (slug: string): Promise<ArticleResponseInterface> {
    const article = await this.findArticleRepository.findArticleBySlug(slug)
    return buildArticleResponse(article)
  }
}
