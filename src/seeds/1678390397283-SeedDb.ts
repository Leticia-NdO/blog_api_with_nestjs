import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedDb1678390397283 implements MigrationInterface {
  name = 'SeedDb1678390397283';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
      INSERT INTO tags(name) VALUES ('nodejs'), ('java'), ('php'), ('sql'), ('python'), ('linux'), ('javascript'), ('frontend'), ('backend')
      `,
    );

    await queryRunner.query(
      // password is 123
      `
      INSERT INTO users (username, email, password) VALUES ('var', 'var@email.com', '$2b$12$Q13qy/WtNa6T6YRMDOFNr.36MpotQp6AUZ4zIVE5SjbMxcqBaC40'),
      ('var1', 'var1@email.com', '$2b$12$Q13qy/WtNa6T6YRMDOFNr.36MpotQp6AUZ4zIVE5SjbMxcqBaC40'),
      ('var2', 'var2@email.com', '$2b$12$Q13qy/WtNa6T6YRMDOFNr.36MpotQp6AUZ4zIVE5SjbMxcqBaC40'),
      ('var3', 'var3@email.com', '$2b$12$Q13qy/WtNa6T6YRMDOFNr.36MpotQp6AUZ4zIVE5SjbMxcqBaC40');
      `,
    );

    await queryRunner.query(
      `
      INSERT INTO articles (slug, title, description, body, \`tagList\`, \`authorId\`) VALUES
      ('stub-article-123', 'stub article', 'just an example of article', 'blablablablablablalbablablabla', 'nodejs,javascript,backend', 1),
      ('stub-article-456', 'stub article number 2', 'just an example of article', 'blablablablablablalbablablabla', 'nodejs,javascript,backend', 2),
      ('stub-article-789', 'stub article number 3', 'just an example of article', 'blablablablablablalbablablabla', 'nodejs,javascript,backend', 3);
      `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`tags\``);
  }
}
