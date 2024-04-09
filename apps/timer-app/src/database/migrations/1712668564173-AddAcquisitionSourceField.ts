import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAcquisitionSourceField1712668564173
  implements MigrationInterface
{
  name = 'AddAcquisitionSourceField1712668564173';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`character\` ADD \`acquisition_source\` varchar(255) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`character\` DROP COLUMN \`acquisition_source\``,
    );
  }
}
