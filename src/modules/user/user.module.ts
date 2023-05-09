import { UserEntity } from '@app/modules/user/core/domain/user.entity'
import { Module } from '@nestjs/common'
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { CreateUserUseCase } from './core/data/create-user-use-case'
import { LoadUserByEmailUseCase } from './core/data/load-user-by-email-use-case'
import { LoadUserByTokenUseCase } from './core/data/load-user-by-token-use-case'
import { LoadUserByUsernameUseCase } from './core/data/load-user-by-username-use-case'
import { LoginUser } from './core/data/login-user-use-case'
import { UpdateUser } from './core/data/update-user-use-case'
import { CreateUserRepositoryInterface } from './core/domain/repository/create-user-repository-interface'
import { FindUserByEmailRepositoryInterface } from './core/domain/repository/find-user-by-email-repository-interface'
import { FindUserByIdRepositoryInterface } from './core/domain/repository/find-user-by-id-repository-interface'
import { FindUserByUsernameRepositoryInterface } from './core/domain/repository/find-user-by-username-repository-interface'
import { UpdateUserRepositoryInterface } from './core/domain/repository/update-user-repository-interface'
import { CreateUserTypeormRepository } from './core/infra/db/typeorm/create-user-typeorm-repository'
import { FindUserByEmailTypeormRepository } from './core/infra/db/typeorm/find-user-by-email-typeorm-repository'
import { FindUserByIdTypeormRepository } from './core/infra/db/typeorm/find-user-by-id-typeorm-repository'
import { FindUserByUsernameTypeormRepository } from './core/infra/db/typeorm/find-user-by-username-typeorm-repository'
import { UpdateUserTypeormRepository } from './core/infra/db/typeorm/update-user-typeorm-repository'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: CreateUserTypeormRepository,
      useFactory: (dataSource: DataSource) => {
        return new CreateUserTypeormRepository(
          dataSource.getRepository(UserEntity)
        )
      },
      inject: [getDataSourceToken()]
    },
    {
      provide: FindUserByEmailTypeormRepository,
      useFactory: (dataSource: DataSource) => {
        return new FindUserByEmailTypeormRepository(
          dataSource.getRepository(UserEntity)
        )
      },
      inject: [getDataSourceToken()]
    },
    {
      provide: FindUserByIdTypeormRepository,
      useFactory: (dataSource: DataSource) => {
        return new FindUserByIdTypeormRepository(
          dataSource.getRepository(UserEntity)
        )
      },
      inject: [getDataSourceToken()]
    },
    {
      provide: FindUserByUsernameTypeormRepository,
      useFactory: (dataSource: DataSource) => {
        return new FindUserByUsernameTypeormRepository(
          dataSource.getRepository(UserEntity)
        )
      },
      inject: [getDataSourceToken()]
    },
    {
      provide: UpdateUserTypeormRepository,
      useFactory: (dataSource: DataSource) => {
        return new UpdateUserTypeormRepository(
          dataSource.getRepository(UserEntity)
        )
      },
      inject: [getDataSourceToken()]
    },
    {
      provide: CreateUserUseCase,
      useFactory: (createRepository: CreateUserRepositoryInterface) => {
        return new CreateUserUseCase(createRepository)
      },
      inject: [CreateUserTypeormRepository]
    },
    {
      provide: LoadUserByEmailUseCase,
      useFactory: (findUserByEmailRepository: FindUserByEmailRepositoryInterface) => {
        return new LoadUserByEmailUseCase(findUserByEmailRepository)
      },
      inject: [FindUserByEmailTypeormRepository]
    },
    {
      provide: LoadUserByTokenUseCase,
      useFactory: (findUserByIdRepository: FindUserByIdRepositoryInterface) => {
        return new LoadUserByTokenUseCase(findUserByIdRepository)
      },
      inject: [FindUserByIdTypeormRepository]
    },
    {
      provide: LoadUserByUsernameUseCase,
      useFactory: (findUserByUsernameRepository: FindUserByUsernameRepositoryInterface) => {
        return new LoadUserByUsernameUseCase(findUserByUsernameRepository)
      },
      inject: [FindUserByUsernameTypeormRepository]
    },
    {
      provide: LoginUser,
      useFactory: (findUserByEmailRepository: FindUserByEmailRepositoryInterface) => {
        return new LoginUser(findUserByEmailRepository)
      },
      inject: [FindUserByEmailTypeormRepository]
    },
    {
      provide: UpdateUser,
      useFactory: (updateUserRepository: UpdateUserRepositoryInterface, loadUserByIdRepository: FindUserByIdRepositoryInterface) => {
        return new UpdateUser(updateUserRepository, loadUserByIdRepository)
      },
      inject: [UpdateUserTypeormRepository, FindUserByIdTypeormRepository]
    }
  ],
  exports: [LoadUserByTokenUseCase, LoadUserByUsernameUseCase, FindUserByIdTypeormRepository, UserService]
})
export class UserModule {}
