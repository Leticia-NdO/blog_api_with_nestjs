import { IsNotEmpty } from 'class-validator';

export class PersistArticleDto {
  @IsNotEmpty()
  readonly title: string;

  @IsNotEmpty()
  readonly body: string;

  @IsNotEmpty()
  readonly description: string;

  readonly tagList?: string[];
}
