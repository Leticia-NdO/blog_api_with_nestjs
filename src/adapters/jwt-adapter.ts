import { Module } from '@nestjs/common';
import jwt from 'jsonwebtoken';

@Module({
  imports: [],
  controllers: [],
  providers: [],
})
export class JwtAdapter {
  constructor(private readonly secret: string) {}

  async encrypt(value: string): Promise<string> {
    const accessToken = jwt.sign({ password: value }, this.secret);
    return accessToken;
  }

  async decrypt(token: string): Promise<string> {
    const value: any = jwt.verify(token, this.secret);
    return value;
  }
}
