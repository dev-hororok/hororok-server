import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMemberStatusMessage1708441398126 implements MigrationInterface {
    name = 'AddMemberStatusMessage1708441398126'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`member\` CHANGE \`email\` \`status_message\` varchar(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`item\` DROP COLUMN \`is_hidden\``);
        await queryRunner.query(`ALTER TABLE \`item\` ADD \`is_hidden\` tinyint NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`member\` DROP COLUMN \`status_message\``);
        await queryRunner.query(`ALTER TABLE \`member\` ADD \`status_message\` varchar(500) NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`member\` DROP COLUMN \`status_message\``);
        await queryRunner.query(`ALTER TABLE \`member\` ADD \`status_message\` varchar(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`item\` DROP COLUMN \`is_hidden\``);
        await queryRunner.query(`ALTER TABLE \`item\` ADD \`is_hidden\` bit NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`member\` CHANGE \`status_message\` \`email\` varchar(100) NOT NULL`);
    }

}
