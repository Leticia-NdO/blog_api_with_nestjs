import { Module } from '@nestjs/common';
import { getDataSourceToken, TypeOrmModule } from '@nestjs/typeorm';
import { FollowEntity } from '../profile/follow.entity';
import { UserEntity } from '../user/user.entity';
import { ArticleController } from './article.controller';
import { ArticleEntity } from './core/domain/article.entity';
import { DataSource } from 'typeorm';

// repository interfaces
import {
  FindAllArticlesRepositoryInterface,
  CreateArticleRepositoryInterface,
  FindOneArticleRepositoryInterface,
  DeleteOneArticleRepositoryInterface,
  UpdateOneArticleRepositoryInterface,
  LikeArticleRepositoryInterface,
  DislikeArticleRepositoryInterface,
} from './core/domain/repository';

// repository implementations
import {
  FindOneArticleTypeormRepository,
  CreateArticleTypeormRepository,
  GetFeedTypeormRepository,
  FindOwnArticlesTypeormRepository,
  DeleteOneArticleTypeormRepository,
  UpdateOneArticleTypeormRepository,
  LikeArticleTypeormRepository,
  FindAllArticlesTypeormRepository,
  DislikeArticleTypeormRepository,
} from './core/infra/db/typeorm';

// use-cases
import {
  CreateArticleUseCase,
  DeleteArticleBySlugUseCase,
  DislikeArticleUseCase,
  GetFeedUseCase,
  LikeArticleUseCase,
  ListAllArticlesUseCase,
  ListOwnArticlesUseCase,
  LoadArticleBySlugUseCase,
  UpdateArticleBySlugUseCase,
} from './core/data';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArticleEntity, UserEntity, FollowEntity]),
  ],
  providers: [
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
      provide: FindOneArticleTypeormRepository,
      useFactory: (dataSource: DataSource) => {
        return new FindOneArticleTypeormRepository(
          dataSource.getRepository(ArticleEntity),
        );
      },
      inject: [getDataSourceToken()],
    },
    {
      provide: DeleteOneArticleTypeormRepository,
      useFactory: (dataSource: DataSource) => {
        return new DeleteOneArticleTypeormRepository(
          dataSource.getRepository(ArticleEntity),
        );
      },
      inject: [getDataSourceToken()],
    },
    {
      provide: UpdateOneArticleTypeormRepository,
      useFactory: (dataSource: DataSource) => {
        return new UpdateOneArticleTypeormRepository(
          dataSource.getRepository(ArticleEntity),
        );
      },
      inject: [getDataSourceToken()],
    },
    {
      provide: LikeArticleTypeormRepository,
      useFactory: (dataSource: DataSource) => {
        return new LikeArticleTypeormRepository(
          dataSource.getRepository(UserEntity),
          dataSource.getRepository(ArticleEntity),
        );
      },
      inject: [getDataSourceToken()],
    },
    {
      provide: DislikeArticleTypeormRepository,
      useFactory: (dataSource: DataSource) => {
        return new DislikeArticleTypeormRepository(
          dataSource.getRepository(UserEntity),
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
    {
      provide: LoadArticleBySlugUseCase,
      useFactory: (loadRepo: FindOneArticleRepositoryInterface) => {
        return new LoadArticleBySlugUseCase(loadRepo);
      },
      inject: [FindOneArticleTypeormRepository],
    },
    {
      provide: DeleteArticleBySlugUseCase,
      useFactory: (deleteRepo: DeleteOneArticleRepositoryInterface) => {
        return new DeleteArticleBySlugUseCase(deleteRepo);
      },
      inject: [DeleteOneArticleTypeormRepository],
    },
    {
      provide: UpdateArticleBySlugUseCase,
      useFactory: (updateRepo: UpdateOneArticleRepositoryInterface) => {
        return new UpdateArticleBySlugUseCase(updateRepo);
      },
      inject: [UpdateOneArticleTypeormRepository],
    },
    {
      provide: LikeArticleUseCase,
      useFactory: (likeRepo: LikeArticleRepositoryInterface) => {
        return new LikeArticleUseCase(likeRepo);
      },
      inject: [LikeArticleTypeormRepository],
    },
    {
      provide: DislikeArticleUseCase,
      useFactory: (dislikeRepo: DislikeArticleRepositoryInterface) => {
        return new DislikeArticleUseCase(dislikeRepo);
      },
      inject: [DislikeArticleTypeormRepository],
    },
  ],
  controllers: [ArticleController],
})
export class ArticleModule {}
