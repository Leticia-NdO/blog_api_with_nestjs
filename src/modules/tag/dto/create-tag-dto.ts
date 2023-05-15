import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateTagDto {
  @ApiProperty({ example: 'bar', description: 'The name of the tag' })
  @IsNotEmpty()
  readonly name: string
}

export class CreateTagRequest {
  @ApiProperty({ type: CreateTagDto })
  tag: CreateTagDto
}