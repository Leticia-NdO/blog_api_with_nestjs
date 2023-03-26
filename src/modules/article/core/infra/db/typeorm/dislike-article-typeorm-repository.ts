import { UserEntity } from '@app/modules/user/user.entity';
import { Repository } from 'typeorm';
import { ArticleEntity } from '../../../domain/article.entity';
import { DislikeArticleRepositoryInterface } from '../../../domain/repository/dislike-article-repository-interface';

export class DislikeArticleTypeormRepository
  implements DislikeArticleRepositoryInterface
{
  constructor(
    private readonly userRepo: Repository<UserEntity>,
    private readonly articleRepo: Repository<ArticleEntity>,
  ) {}
  async dislike(slug: string, userId: number): Promise<ArticleEntity> {
    const article = await this.articleRepo.findOne({
      where: {
        slug,
      },
    });
    const user = await this.userRepo.findOne({
      where: {
        id: userId,
      },
      relations: ['favorites'],
    });

    const articleFavoriteIndex = user.favorites.findIndex(
      (articleInFavorites) => articleInFavorites.id === article.id,
    );

    if (articleFavoriteIndex >= 0) {
      user.favorites.splice(articleFavoriteIndex, 1);
      article.favorites--;
      await this.userRepo.save(user);
      await this.articleRepo.save(article);
    }

    return article;
  }
}
