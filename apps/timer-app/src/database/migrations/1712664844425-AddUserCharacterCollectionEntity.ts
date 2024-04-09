import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserCharacterCollectionEntity1712664844425
  implements MigrationInterface
{
  name = 'AddUserCharacterCollectionEntity1712664844425';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`user_character_collection\` (\`collection_id\` int NOT NULL, \`acquired_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`character_id\` int NOT NULL, \`member_id\` varchar(36) NOT NULL, PRIMARY KEY (\`collection_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(`ALTER TABLE \`item\` DROP COLUMN \`is_hidden\``);
    await queryRunner.query(
      `ALTER TABLE \`item\` ADD \`is_hidden\` tinyint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_character_collection\` ADD CONSTRAINT \`FK_9ed1720108ec8abf0c641b61eec\` FOREIGN KEY (\`character_id\`) REFERENCES \`character\`(\`character_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_character_collection\` ADD CONSTRAINT \`FK_5afa0fdc9ab5ba415328ac23a89\` FOREIGN KEY (\`member_id\`) REFERENCES \`member\`(\`member_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_character_collection\` DROP FOREIGN KEY \`FK_5afa0fdc9ab5ba415328ac23a89\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_character_collection\` DROP FOREIGN KEY \`FK_9ed1720108ec8abf0c641b61eec\``,
    );
    await queryRunner.query(`ALTER TABLE \`item\` DROP COLUMN \`is_hidden\``);
    await queryRunner.query(
      `ALTER TABLE \`item\` ADD \`is_hidden\` bit NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE \`user_character_collection\``);
  }
}
