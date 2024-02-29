import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAccountCompositeIndex1709205980558
  implements MigrationInterface
{
  name = 'AddAccountCompositeIndex1709205980558';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_d88d87a719d5c228e680e4daa0\` ON \`account\``,
    );
    await queryRunner.query(`ALTER TABLE \`item\` DROP COLUMN \`is_hidden\``);
    await queryRunner.query(
      `ALTER TABLE \`item\` ADD \`is_hidden\` tinyint NOT NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_83985186cab817acce3018c412\` ON \`account\` (\`social_id\`, \`provider\`)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_83985186cab817acce3018c412\` ON \`account\``,
    );
    await queryRunner.query(`ALTER TABLE \`item\` DROP COLUMN \`is_hidden\``);
    await queryRunner.query(
      `ALTER TABLE \`item\` ADD \`is_hidden\` bit NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX \`IDX_d88d87a719d5c228e680e4daa0\` ON \`account\` (\`social_id\`)`,
    );
  }
}
