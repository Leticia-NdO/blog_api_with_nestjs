import { UserEntity } from '@app/modules/user/user.entity';
import { Repository } from 'typeorm';
import { ArticleEntity } from '../../../domain/article.entity';
import { LikeArticleRepositoryInterface } from '../../../domain/repository/like-article-repository';

export class LikeArticleTypeormRepository
  implements LikeArticleRepositoryInterface
{
  constructor(
    private readonly userRepo: Repository<UserEntity>,
    private readonly articleRepo: Repository<ArticleEntity>,
  ) {}
  async like(slug: string, userId: number): Promise<ArticleEntity> {
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

    const isFavorited =
      user.favorites.findIndex(
        (articleInFavorites) => articleInFavorites.id === article.id,
      ) !== -1;

    if (!isFavorited) {
      user.favorites.push(article);
      article.favorites++;
      await this.userRepo.save(user);
      await this.articleRepo.save(article);
    }

    return article;
  }
}
