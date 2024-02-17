import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMemberRelation1708162147298 implements MigrationInterface {
  name = 'AddMemberRelation1708162147298';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`account\` ADD \`member_id\` varchar(36) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`account\` ADD UNIQUE INDEX \`IDX_982244edcfcee80f14f2bef945\` (\`member_id\`)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`REL_982244edcfcee80f14f2bef945\` ON \`account\` (\`member_id\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`account\` ADD CONSTRAINT \`FK_982244edcfcee80f14f2bef945a\` FOREIGN KEY (\`member_id\`) REFERENCES \`member\`(\`member_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`account\` DROP FOREIGN KEY \`FK_982244edcfcee80f14f2bef945a\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_982244edcfcee80f14f2bef945\` ON \`account\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`account\` DROP INDEX \`IDX_982244edcfcee80f14f2bef945\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`account\` DROP COLUMN \`member_id\``,
    );
  }
}
