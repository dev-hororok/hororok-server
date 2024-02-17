import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAccount1708175056836 implements MigrationInterface {
  name = 'AddAccount1708175056836';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`role\` (\`id\` int NOT NULL, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`account\` (\`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`account_id\` varchar(36) NOT NULL, \`email\` varchar(255) NULL, \`password\` varchar(255) NULL, \`provider\` varchar(255) NOT NULL DEFAULT 'email', \`social_id\` varchar(255) NULL, \`roleId\` int NULL, \`member_id\` varchar(36) NULL, INDEX \`IDX_d88d87a719d5c228e680e4daa0\` (\`social_id\`), UNIQUE INDEX \`IDX_4c8f96ccf523e9a3faefd5bdd4\` (\`email\`), UNIQUE INDEX \`REL_982244edcfcee80f14f2bef945\` (\`member_id\`), PRIMARY KEY (\`account_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`REL_a706d6db681a07b5f485eff318\` ON \`member\` (\`account_id\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`account\` ADD CONSTRAINT \`FK_77bf26eef8865441fb9bd53a364\` FOREIGN KEY (\`roleId\`) REFERENCES \`role\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`account\` ADD CONSTRAINT \`FK_982244edcfcee80f14f2bef945a\` FOREIGN KEY (\`member_id\`) REFERENCES \`member\`(\`member_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`member\` ADD CONSTRAINT \`FK_a706d6db681a07b5f485eff318d\` FOREIGN KEY (\`account_id\`) REFERENCES \`account\`(\`account_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`member\` DROP FOREIGN KEY \`FK_a706d6db681a07b5f485eff318d\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`account\` DROP FOREIGN KEY \`FK_982244edcfcee80f14f2bef945a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`account\` DROP FOREIGN KEY \`FK_77bf26eef8865441fb9bd53a364\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_a706d6db681a07b5f485eff318\` ON \`member\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_982244edcfcee80f14f2bef945\` ON \`account\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_4c8f96ccf523e9a3faefd5bdd4\` ON \`account\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_d88d87a719d5c228e680e4daa0\` ON \`account\``,
    );
    await queryRunner.query(`DROP TABLE \`account\``);
    await queryRunner.query(`DROP TABLE \`role\``);
  }
}
