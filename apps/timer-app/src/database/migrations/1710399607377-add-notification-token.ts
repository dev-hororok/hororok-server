import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNotificationToken1710399607377 implements MigrationInterface {
  name = 'AddNotificationToken1710399607377';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`notification_token\` (\`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`notification_token_id\` int NOT NULL AUTO_INCREMENT, \`notification_token\` varchar(255) NOT NULL, \`status\` varchar(255) NOT NULL DEFAULT 'Active', \`device_type\` varchar(255) NOT NULL, \`last_used_at\` datetime NOT NULL, \`member_id\` varchar(36) NULL, PRIMARY KEY (\`notification_token_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`notification_token\` ADD CONSTRAINT \`FK_fa1c34c66851af2af6a24c5f961\` FOREIGN KEY (\`member_id\`) REFERENCES \`member\`(\`member_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`notification_token\` DROP FOREIGN KEY \`FK_fa1c34c66851af2af6a24c5f961\``,
    );
    await queryRunner.query(`DROP TABLE \`notification_token\``);
  }
}
