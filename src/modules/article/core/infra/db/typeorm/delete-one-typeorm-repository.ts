import { Repository } from 'typeorm';
import { ArticleEntity } from '../../../domain/article.entity';
import { DeleteOneArticleRepositoryInterface } from '../../../domain/repository/delete-one-repository-interface';

export class DeleteOneArticleTypeormRepository
  implements DeleteOneArticleRepositoryInterface
{
  constructor(private readonly deleteRepo: Repository<ArticleEntity>) {}
  async deleteBySlug(slug: string): Promise<boolean> {
    const article = await this.deleteRepo.findOne({
      where: {
        slug,
      },
    });

    if (!article) return false;

    return !!(await this.deleteRepo.delete(article.id)).affected;
  }
}
