import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import config from './config/ormconfig'
import { UserModule } from './modules/user/user.module'
import { AuthMiddleWare } from './modules/user/middleware/auth-middleware'
import { ArticleModule } from './modules/article/article.module'
import { ProfileModule } from './modules/profile/profile.module'

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    UserModule,
    ProfileModule,
    ArticleModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
  configure (consumer: MiddlewareConsumer): void {
    consumer.apply(AuthMiddleWare).forRoutes({
      path: '*',
      method: RequestMethod.ALL
    })
  }
}
