import { Injectable } from '@nestjs/common';

@Injectable()
export class ArticleService {
  createArticle(): string {
    return 'então né';
  }
}
