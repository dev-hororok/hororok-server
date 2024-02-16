import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeUp1708111367922 implements MigrationInterface {
  name = 'ChangeUp1708111367922';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`item\` DROP COLUMN \`is_hidden\``);
    await queryRunner.query(
      `ALTER TABLE \`item\` ADD \`is_hidden\` tinyint NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`item\` DROP COLUMN \`is_hidden\``);
    await queryRunner.query(
      `ALTER TABLE \`item\` ADD \`is_hidden\` bit NOT NULL`,
    );
  }
}
