import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFollows1679164891366 implements MigrationInterface {
  name = 'CreateFollows1679164891366';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`follows\` CHANGE \`followinfId\` \`followingId\` int NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`follows\` CHANGE \`followingId\` \`followinfId\` int NOT NULL`,
    );
  }
}
