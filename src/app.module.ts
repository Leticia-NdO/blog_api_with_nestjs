import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TagModule } from './modules/tag/tag.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from './config/ormconfig';
import { UserModule } from './modules/user/user.module';
import { AuthMiddleWare } from './modules/user/middleware/auth-middleware';
import { ArticleModule } from './modules/article/article.module';
import { ProfileModule } from './modules/profile/profile.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    TagModule,
    UserModule,
    ProfileModule,
    ArticleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleWare).forRoutes(
      {
        path: 'users',
        method: RequestMethod.GET,
      },
      {
        path: 'users',
        method: RequestMethod.PUT,
      },
      {
        path: 'articles',
        method: RequestMethod.POST,
      },
      {
        path: 'articles',
        method: RequestMethod.GET,
      },
      {
        path: 'articles/:slug',
        method: RequestMethod.DELETE,
      },
      {
        path: 'articles/:slug',
        method: RequestMethod.PUT,
      },
      {
        path: 'articles/:slug/favorite',
        method: RequestMethod.POST,
      },
      {
        path: 'articles/:slug/favorite',
        method: RequestMethod.DELETE,
      },
      {
        path: 'profiles/:username',
        method: RequestMethod.GET,
      },
      {
        path: 'profiles/:username/follow',
        method: RequestMethod.POST,
      },
      {
        path: 'profiles/:username/follow',
        method: RequestMethod.DELETE,
      },
    );
  }
}
