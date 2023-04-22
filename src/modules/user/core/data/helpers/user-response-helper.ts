import { UserEntity } from "../../domain/user.entity";
import { generateToken } from "../../infra/encrypt/generate-token";

export const buildUserResponse = (userEntity: UserEntity) => {
  const token = generateToken(userEntity);
  return {
    user: {
      ...userEntity,
      token,
    },
  };
}