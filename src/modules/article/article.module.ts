import { Module } from '@nestjs/common';
import { getDataSourceToken, TypeOrmModule } from '@nestjs/typeorm';
import { FollowEntity } from '../profile/follow.entity';
import { UserEntity } from '../user/user.entity';
import { ArticleController } from './article.controller';
import { ArticleEntity } from './core/domain/article.entity';
import { ArticleService } from './article.service';
import { FindAllArticlesRepository } from './core/infra/db/typeorm/article-typeorm-find-all-repository';
import { DataSource } from 'typeorm';
import { ListAllArticlesUseCase } from './core/data/list-all-by-user-use-case';
import { FindAllArticlesRepositoryInterface } from './core/domain/repository/article-find-all-repository';
import { ListOwnArticlesUseCase } from './core/data/list-own-articles-use-case';
import { FindOwnArticlesRepository } from './core/infra/db/typeorm/find-own-articles-repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArticleEntity, UserEntity, FollowEntity]),
  ],
  providers: [
    ArticleService,
    {
      provide: FindAllArticlesRepository,
      useFactory: (dataSource: DataSource) => {
        return new FindAllArticlesRepository(
          dataSource.getRepository(UserEntity),
          dataSource,
        );
      },
      inject: [getDataSourceToken()],
    },
    {
      provide: FindOwnArticlesRepository,
      useFactory: (dataSource: DataSource) => {
        return new FindOwnArticlesRepository(dataSource);
      },
      inject: [getDataSourceToken()],
    },
    {
      provide: ListAllArticlesUseCase,
      useFactory: (findAllRepo: FindAllArticlesRepositoryInterface) => {
        return new ListAllArticlesUseCase(findAllRepo);
      },
      inject: [FindAllArticlesRepository],
    },
    {
      provide: ListOwnArticlesUseCase,
      useFactory: (findAllRepo: FindAllArticlesRepositoryInterface) => {
        return new ListOwnArticlesUseCase(findAllRepo);
      },
      inject: [FindOwnArticlesRepository],
    },
  ],
  controllers: [ArticleController],
})
export class ArticleModule {}
