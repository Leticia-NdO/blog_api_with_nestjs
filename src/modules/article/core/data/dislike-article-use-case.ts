import { ArticleResponseInterface } from '../../types/article-response.interface'
import { DislikeArticleRepositoryInterface } from '../domain/repository/dislike-article-repository-interface'
import { buildArticleResponse } from './helpers/article-reponse-helper'

export class DislikeArticleUseCase {
  constructor (
    private readonly dislikeArticleRepository: DislikeArticleRepositoryInterface
  ) {}

  async like (slug: string, userId: number): Promise<ArticleResponseInterface> {
    const likedArticle = await this.dislikeArticleRepository.dislike(
      slug,
      userId
    )
    return buildArticleResponse(likedArticle)
  }
}
