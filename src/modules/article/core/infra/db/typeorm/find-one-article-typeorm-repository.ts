import { Repository } from 'typeorm';
import { ArticleEntity } from '../../../domain/article.entity';
import { FindOneArticleRepositoryInterface } from '../../../domain/repository/find-one-repository-interface';

export class FindOneArticleTypeormRepository
  implements FindOneArticleRepositoryInterface
{
  constructor(private readonly findRepo: Repository<ArticleEntity>) {}

  async findArticleBySlug(slug: string): Promise<ArticleEntity> {
    const article = await this.findRepo.findOne({
      where: {
        slug,
      },
    });

    return article;
  }
}
