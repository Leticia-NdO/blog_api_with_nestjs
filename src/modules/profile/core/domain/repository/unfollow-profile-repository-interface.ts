export interface UnfollowProfileRepositoryInterface {
  unfollow: (userId: number, profileToBeUnfollowedId: number) => Promise<void>
}
