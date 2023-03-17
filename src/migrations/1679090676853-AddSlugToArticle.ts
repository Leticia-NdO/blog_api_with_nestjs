import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSlugToArticle1679090676853 implements MigrationInterface {
  name = 'AddSlugToArticle1679090676853';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`articles\` ADD \`slug\` varchar(255) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`articles\` DROP COLUMN \`slug\``);
  }
}
