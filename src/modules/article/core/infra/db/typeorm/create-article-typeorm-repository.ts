import { PersistArticleDto } from '@app/modules/article/dto/persist-article.dto';
import { UserEntity } from '@app/modules/user/user.entity';
import { Repository } from 'typeorm';
import { ArticleEntity } from '../../../domain/article.entity';
import { CreateArticleRepositoryInterface } from '../../../domain/repository/create-article-repository';
import { getSlug } from '../../adapters/create-slug-adapter';

export class CreateArticleTypeormRepository
  implements CreateArticleRepositoryInterface
{
  constructor(private readonly articleRepo: Repository<ArticleEntity>) {}
  async create(
    author: UserEntity,
    createArticleDto: PersistArticleDto,
  ): Promise<ArticleEntity> {
    const article = new ArticleEntity();
    Object.assign(article, createArticleDto);
    if (!article.tagList) article.tagList = [];
    article.slug = getSlug(article.title);
    article.author = author;
    return await this.articleRepo.save(article);
  }
}
