import { MigrationInterface, QueryRunner } from 'typeorm';

export class EditRoleId1708250009007 implements MigrationInterface {
  name = 'EditRoleId1708250009007';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`account\` DROP FOREIGN KEY \`FK_77bf26eef8865441fb9bd53a364\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`role\` CHANGE \`id\` \`role_id\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`account\` CHANGE \`roleId\` \`role_id\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`account\` ADD CONSTRAINT \`FK_d3890c96feefc95c7cfd788cfda\` FOREIGN KEY (\`role_id\`) REFERENCES \`role\`(\`role_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`account\` DROP FOREIGN KEY \`FK_d3890c96feefc95c7cfd788cfda\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`account\` CHANGE \`role_id\` \`roleId\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`role\` CHANGE \`role_id\` \`id\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`account\` ADD CONSTRAINT \`FK_77bf26eef8865441fb9bd53a364\` FOREIGN KEY (\`roleId\`) REFERENCES \`role\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
