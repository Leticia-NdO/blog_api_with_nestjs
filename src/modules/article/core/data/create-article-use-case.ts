import { UserEntity } from '@app/modules/user/user.entity';
import { PersistArticleDto } from '../../dto/persist-article.dto';
import { ArticleResponseInterface } from '../../types/article-response.interface';
import { CreateArticleRepositoryInterface } from '../domain/repository/create-article-repository-interface';
import { buildArticleResponse } from './helpers/article-reponse-helper';

export class CreateArticleUseCase {
  constructor(
    private readonly createRepository: CreateArticleRepositoryInterface,
  ) {}

  async create(
    author: UserEntity,
    createArticleDto: PersistArticleDto,
  ): Promise<ArticleResponseInterface> {
    const article = await this.createRepository.create(
      author,
      createArticleDto,
    );

    return buildArticleResponse(article);
  }
}
