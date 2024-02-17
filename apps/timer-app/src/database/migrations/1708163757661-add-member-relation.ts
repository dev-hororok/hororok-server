import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMemberRelation1708163757661 implements MigrationInterface {
    name = 'AddMemberRelation1708163757661'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_982244edcfcee80f14f2bef945\` ON \`account\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_982244edcfcee80f14f2bef945\` ON \`account\` (\`member_id\`)`);
    }

}
