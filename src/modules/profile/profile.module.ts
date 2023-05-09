import { Module } from '@nestjs/common'
import { getDataSourceToken, TypeOrmModule } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { FindUserByIdRepositoryInterface } from '../user/core/domain/repository/find-user-by-id-repository-interface'
import { UserEntity } from '../user/core/domain/user.entity'
import { FindUserByIdTypeormRepository } from '../user/core/infra/db/typeorm/find-user-by-id-typeorm-repository'
import { UserModule } from '../user/user.module'
import { FollowProfileUseCase } from './core/data/follow-profile-use-case'
import { GetFollowingsUseCase } from './core/data/get-followings-use-case'
import { GetProfileUseCase } from './core/data/get-profile-use-case'
import { UnfollowProfileUseCase } from './core/data/unfollow-profile-use-case'
import { FollowEntity } from './core/domain/follow.entity'
import { FindAllFollowingsRepositoryInterface } from './core/domain/repository/find-all-followings-repository-interface'
import { FindAllProfilesRepositoryInterface } from './core/domain/repository/find-all-profiles-repository-interface'
import { FindOneFollowRepositoryInterface } from './core/domain/repository/find-one-follow-repository-interface'
import { FollowProfileRepositoryInterface } from './core/domain/repository/follow-profile-repository-interface'
import { UnfollowProfileRepositoryInterface } from './core/domain/repository/unfollow-profile-repository-interface'
import { FollowTypeormRepository } from './core/infra/db/typeorm/follow-typeorm-repository'
import { ProfileController } from './profile.controller'

@Module({
  providers: [
    {
      provide: FollowTypeormRepository,
      useFactory: (dataSource: DataSource) => {
        return new FollowTypeormRepository(
          dataSource.getRepository(FollowEntity),
          dataSource.getRepository(UserEntity)
        )
      },
      inject: [getDataSourceToken()]
    },
    {
      provide: FollowProfileUseCase,
      useFactory: (findOneFollowRepository: FindOneFollowRepositoryInterface, followProfileRepository: FollowProfileRepositoryInterface) => {
        return new FollowProfileUseCase(findOneFollowRepository, followProfileRepository)
      },
      inject: [FollowTypeormRepository, FollowTypeormRepository]
    },
    {
      provide: GetFollowingsUseCase,
      useFactory: (findAllFollowingsRepositoryInterface: FindAllFollowingsRepositoryInterface, findAllProfilesRepositoryInterface: FindAllProfilesRepositoryInterface) => {
        return new GetFollowingsUseCase(findAllFollowingsRepositoryInterface, findAllProfilesRepositoryInterface)
      },
      inject: [FollowTypeormRepository, FollowTypeormRepository]
    },
    {
      provide: GetProfileUseCase,
      useFactory: (findUserByIdRepository: FindUserByIdRepositoryInterface, findOneFollowRepository: FindOneFollowRepositoryInterface) => {
        return new GetProfileUseCase(findUserByIdRepository, findOneFollowRepository)
      },
      inject: [FindUserByIdTypeormRepository, FollowTypeormRepository]
    },
    {
      provide: UnfollowProfileUseCase,
      useFactory: (findOneFollowRepository: FindOneFollowRepositoryInterface, unfollowRepository: UnfollowProfileRepositoryInterface) => {
        return new UnfollowProfileUseCase(findOneFollowRepository, unfollowRepository)
      },
      inject: [FollowTypeormRepository, FollowTypeormRepository]
    }
  ],
  controllers: [ProfileController],
  imports: [TypeOrmModule.forFeature([UserEntity, FollowEntity]), UserModule]
})
export class ProfileModule {}
