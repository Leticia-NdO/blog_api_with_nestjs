import { sign } from "jsonwebtoken";
import { UserEntity } from "../../domain/user.entity";

export const generateToken = (userEntity: UserEntity): string => {
  return sign(
    {
      id: userEntity.id,
      username: userEntity.username,
      email: userEntity.email,
    },
    process.env.JWT_SECRET
  );
}