import { MigrationInterface, QueryRunner } from 'typeorm';

export class EditMember1708179179043 implements MigrationInterface {
  name = 'EditMember1708179179043';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`account\` DROP FOREIGN KEY \`FK_982244edcfcee80f14f2bef945a\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_982244edcfcee80f14f2bef945\` ON \`account\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_a706d6db681a07b5f485eff318\` ON \`member\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`account\` DROP COLUMN \`member_id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`member\` DROP FOREIGN KEY \`FK_a706d6db681a07b5f485eff318d\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`member\` CHANGE \`account_id\` \`account_id\` varchar(36) NULL`,
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
      `ALTER TABLE \`member\` CHANGE \`account_id\` \`account_id\` varchar(36) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`member\` ADD CONSTRAINT \`FK_a706d6db681a07b5f485eff318d\` FOREIGN KEY (\`account_id\`) REFERENCES \`account\`(\`account_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`account\` ADD \`member_id\` varchar(36) NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_a706d6db681a07b5f485eff318\` ON \`member\` (\`account_id\`)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`REL_982244edcfcee80f14f2bef945\` ON \`account\` (\`member_id\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`account\` ADD CONSTRAINT \`FK_982244edcfcee80f14f2bef945a\` FOREIGN KEY (\`member_id\`) REFERENCES \`member\`(\`member_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
