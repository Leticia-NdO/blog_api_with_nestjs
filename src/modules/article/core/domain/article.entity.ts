import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../../user/user.entity';

@Entity({ name: 'articles' })
export class ArticleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  slug: string;

  @Column()
  title: string;

  @Column({ default: '' })
  description: string;

  @Column({ default: '' })
  body: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('simple-array')
  tagList: string[];

  @Column({ default: 0 })
  favorites: number;

  // it means one article can only have one author, and the second argument says the name of the foreign key to be created at users with the name of 'articles'
  @ManyToOne(() => UserEntity, (user) => user.articles, { eager: true })
  author: UserEntity;
}
