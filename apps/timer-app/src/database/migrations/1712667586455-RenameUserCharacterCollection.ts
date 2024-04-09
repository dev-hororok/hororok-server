import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameUserCharacterCollection1712667586455 implements MigrationInterface {
    name = 'RenameUserCharacterCollection1712667586455'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_character_collection\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`user_character_collection\` DROP COLUMN \`collection_id\``);
        await queryRunner.query(`ALTER TABLE \`user_character_collection\` ADD \`collection_id\` int NOT NULL PRIMARY KEY AUTO_INCREMENT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_character_collection\` DROP COLUMN \`collection_id\``);
        await queryRunner.query(`ALTER TABLE \`user_character_collection\` ADD \`collection_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user_character_collection\` ADD PRIMARY KEY (\`collection_id\`)`);
    }

}
