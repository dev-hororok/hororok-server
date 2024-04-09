import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIndex1712666532534 implements MigrationInterface {
  name = 'AddIndex1712666532534';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_aba14a9a3a61f71245880e7b10\` ON \`user_character_collection\` (\`character_id\`, \`member_id\`)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_aba14a9a3a61f71245880e7b10\` ON \`user_character_collection\``,
    );
  }
}
