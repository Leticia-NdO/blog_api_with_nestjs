import { DeleteOneArticleRepositoryInterface } from '../domain/repository/delete-one-repository';

export class DeleteArticleBySlugUseCase {
  constructor(
    private readonly deleteRepository: DeleteOneArticleRepositoryInterface,
  ) {}
  async delete(slug: string): Promise<boolean> {
    return await this.deleteRepository.deleteBySlug(slug);
  }
}
