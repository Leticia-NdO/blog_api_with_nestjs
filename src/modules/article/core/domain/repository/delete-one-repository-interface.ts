export interface DeleteOneArticleRepositoryInterface {
  deleteBySlug: (slug: string) => Promise<boolean>;
}
