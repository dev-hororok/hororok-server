import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveCommonEntityInNotificationToken1710431900114
  implements MigrationInterface
{
  name = 'RemoveCommonEntityInNotificationToken1710431900114';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`notification_token\` DROP COLUMN \`created_at\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification_token\` DROP COLUMN \`deleted_at\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification_token\` DROP COLUMN \`updated_at\``,
    );
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
    await queryRunner.query(
      `ALTER TABLE \`notification_token\` ADD \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification_token\` ADD \`deleted_at\` datetime(6) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification_token\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
  }
}
