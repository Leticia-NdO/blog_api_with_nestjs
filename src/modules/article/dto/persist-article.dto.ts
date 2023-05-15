import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class PersistArticleDto {
  @ApiProperty({ example: 'My first article', description: 'The title of the article' })
  @IsNotEmpty()
  readonly title: string

  @ApiProperty({ 
                  example: `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua`,
                  description: 'The body of the article'
               })
  @IsNotEmpty()
  readonly body: string

  @ApiProperty({ example: 'This is my first article.', description: `A brief description of the article's content` })
  @IsNotEmpty()
  readonly description: string

  @ApiProperty({ example: '', description: `A brief description of the article's content`, isArray: true })
  readonly tagList?: string[]
}

export class PersistArticleRequest {
  @ApiProperty({ type: PersistArticleDto })
    article: PersistArticleDto
}
