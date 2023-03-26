// import { ArticleBulkResponseInterface } from '@app/modules/article/types/article-bulk-response.interface';
import { ArticleResponseInterface } from '@app/modules/article/types/article-response.interface';
import { ArticleEntity } from '../../domain/article.entity';

export const buildArticleResponse = (
  articleEntity: ArticleEntity,
): ArticleResponseInterface => {
  return {
    article: articleEntity,
  };
};

// export const buildArticleBulkResponse = (
//   articleEntities: ArticleEntity[],
//   articlesCount: number,
// ): ArticleBulkResponseInterface => {
//   return {
//     articles: articleEntities,
//     articlesCount,
//   };
// };
