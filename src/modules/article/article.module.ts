import { Module } from '@nestjs/common';
import { getDataSourceToken, TypeOrmModule } from '@nestjs/typeorm';
import { FollowEntity } from '../profile/follow.entity';
import { UserEntity } from '../user/user.entity';
import { ArticleController } from './article.controller';
import { ArticleEntity } from './core/domain/article.entity';
import { ArticleService } from './article.service';
import { FindAllArticlesTypeormRepository } from './core/infra/db/typeorm/article-find-all-typeorm-repository';
import { DataSource } from 'typeorm';
import { ListAllArticlesUseCase } from './core/data/list-all-by-user-use-case';
import { FindAllArticlesRepositoryInterface } from './core/domain/repository/article-find-all-repository';
import { ListOwnArticlesUseCase } from './core/data/list-own-articles-use-case';
import { FindOwnArticlesTypeormRepository } from './core/infra/db/typeorm/find-own-articles-typeorm-repository';
import { GetFeedUseCase } from './core/data/get-feed-use-case';
import { GetFeedTypeormRepository } from './core/infra/db/typeorm/get-feed-typeorm-repository';
import { CreateArticleUseCase } from './core/data/create-article-use-case';
import { CreateArticleRepositoryInterface } from './core/domain/repository/create-article-repository-interface';
import { CreateArticleTypeormRepository } from './core/infra/db/typeorm/create-article-typeorm-repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArticleEntity, UserEntity, FollowEntity]),
  ],
  providers: [
    ArticleService,
    {
      provide: FindAllArticlesTypeormRepository,
      useFactory: (dataSource: DataSource) => {
        return new FindAllArticlesTypeormRepository(
          dataSource.getRepository(UserEntity),
          dataSource,
        );
      },
      inject: [getDataSourceToken()],
    },
    {
      provide: FindOwnArticlesTypeormRepository,
      useFactory: (dataSource: DataSource) => {
        return new FindOwnArticlesTypeormRepository(dataSource);
      },
      inject: [getDataSourceToken()],
    },
    {
      provide: GetFeedTypeormRepository,
      useFactory: (dataSource: DataSource) => {
        return new GetFeedTypeormRepository(
          dataSource.getRepository(UserEntity),
          dataSource.getRepository(FollowEntity),
          dataSource,
        );
      },
      inject: [getDataSourceToken()],
    },
    {
      provide: CreateArticleTypeormRepository,
      useFactory: (dataSource: DataSource) => {
        return new CreateArticleTypeormRepository(
          dataSource.getRepository(ArticleEntity),
        );
      },
      inject: [getDataSourceToken()],
    },
    {
      provide: ListAllArticlesUseCase,
      useFactory: (findAllRepo: FindAllArticlesRepositoryInterface) => {
        return new ListAllArticlesUseCase(findAllRepo);
      },
      inject: [FindAllArticlesTypeormRepository],
    },
    {
      provide: ListOwnArticlesUseCase,
      useFactory: (findAllRepo: FindAllArticlesRepositoryInterface) => {
        return new ListOwnArticlesUseCase(findAllRepo);
      },
      inject: [FindOwnArticlesTypeormRepository],
    },
    {
      provide: GetFeedUseCase,
      useFactory: (findAllRepo: FindAllArticlesRepositoryInterface) => {
        return new GetFeedUseCase(findAllRepo);
      },
      inject: [GetFeedTypeormRepository],
    },
    {
      provide: CreateArticleUseCase,
      useFactory: (createRepo: CreateArticleRepositoryInterface) => {
        return new CreateArticleUseCase(createRepo);
      },
      inject: [CreateArticleTypeormRepository],
    },
  ],
  controllers: [ArticleController],
})
export class ArticleModule {}
