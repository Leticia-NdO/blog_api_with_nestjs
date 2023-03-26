import { ArticleResponseInterface } from '../../types/article-response.interface';
import { LikeArticleRepositoryInterface } from '../domain/repository/like-article-repository-interface';
import { buildArticleResponse } from './helpers/article-reponse-helper';

export class LikeArticleUseCase {
  constructor(
    private readonly likeArticleRepository: LikeArticleRepositoryInterface,
  ) {}
  async like(slug: string, userId: number): Promise<ArticleResponseInterface> {
    const likedArticle = await this.likeArticleRepository.like(slug, userId);
    return buildArticleResponse(likedArticle);
  }
}
