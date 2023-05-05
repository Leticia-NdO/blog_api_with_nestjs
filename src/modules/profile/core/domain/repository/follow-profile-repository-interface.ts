export interface FollowProfileRepositoryInterface {
  follow: (userId: number, profileToBeFollowedId: number) => Promise<void>
}
