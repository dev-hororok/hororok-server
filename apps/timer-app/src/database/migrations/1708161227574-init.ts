import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1708161227574 implements MigrationInterface {
    name = 'Init1708161227574'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`character\` (\`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`character_id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, \`description\` varchar(255) NULL, \`grade\` varchar(20) NOT NULL, \`image_url\` varchar(255) NOT NULL, \`sell_price\` int NOT NULL, PRIMARY KEY (\`character_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`character_inventory\` (\`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`character_inventory_id\` bigint NOT NULL AUTO_INCREMENT, \`quantity\` int NOT NULL, \`character_id\` int NOT NULL, \`member_id\` varchar(36) NOT NULL, PRIMARY KEY (\`character_inventory_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`study_category\` (\`study_category_id\` bigint NOT NULL AUTO_INCREMENT, \`subject\` varchar(50) NOT NULL, \`color\` varchar(7) NOT NULL DEFAULT '#000000', \`deleted_at\` datetime(6) NULL, \`member_id\` varchar(36) NOT NULL, PRIMARY KEY (\`study_category_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`transaction_record\` (\`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`transaction_record_id\` bigint NOT NULL AUTO_INCREMENT, \`transaction_type\` varchar(20) NOT NULL, \`amount\` int NOT NULL, \`count\` int NOT NULL, \`balance_after_transaction\` int NOT NULL, \`notes\` varchar(255) NOT NULL, \`member_id\` varchar(36) NOT NULL, PRIMARY KEY (\`transaction_record_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`palette\` (\`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`palette_id\` int NOT NULL AUTO_INCREMENT, \`grade\` varchar(20) NOT NULL, \`name\` varchar(100) NOT NULL, \`light_color\` varchar(7) NOT NULL, \`normal_color\` varchar(7) NOT NULL, \`dark_color\` varchar(7) NOT NULL, \`darker_color\` varchar(7) NOT NULL, PRIMARY KEY (\`palette_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`study_streak\` (\`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`study_streak_id\` int NOT NULL AUTO_INCREMENT, \`current_streak\` int NOT NULL, \`longest_streak\` int NOT NULL, \`member_id\` varchar(36) NOT NULL, \`palette_id\` int NULL, UNIQUE INDEX \`REL_9e1635a0fc56b3329677377880\` (\`member_id\`), PRIMARY KEY (\`study_streak_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`item\` (\`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`item_id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, \`item_type\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`required_study_time\` int NULL, \`cost\` int NOT NULL, \`grade\` varchar(20) NULL, \`image_url\` varchar(255) NOT NULL, \`effect_code\` int NOT NULL, \`is_hidden\` tinyint NOT NULL, PRIMARY KEY (\`item_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`item_inventory\` (\`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`item_inventory_id\` bigint NOT NULL AUTO_INCREMENT, \`progress\` int NULL, \`quantity\` int NOT NULL, \`item_type\` varchar(255) NOT NULL, \`item_id\` int NOT NULL, \`member_id\` varchar(36) NOT NULL, PRIMARY KEY (\`item_inventory_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`role\` (\`id\` int NOT NULL, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`account\` (\`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`account_id\` varchar(36) NOT NULL, \`email\` varchar(255) NULL, \`password\` varchar(255) NULL, \`provider\` varchar(255) NOT NULL DEFAULT 'email', \`social_id\` varchar(255) NULL, \`roleId\` int NULL, INDEX \`IDX_d88d87a719d5c228e680e4daa0\` (\`social_id\`), UNIQUE INDEX \`IDX_4c8f96ccf523e9a3faefd5bdd4\` (\`email\`), PRIMARY KEY (\`account_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`member\` (\`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`member_id\` varchar(36) NOT NULL, \`nickname\` varchar(100) NOT NULL, \`email\` varchar(100) NOT NULL, \`image_url\` varchar(255) NULL, \`role\` varchar(20) NOT NULL, \`active_record_id\` bigint NULL, \`point\` int NOT NULL DEFAULT '0', \`study_streak_id\` int NULL, \`account_id\` varchar(36) NULL, UNIQUE INDEX \`REL_51b8fd29e951724b448d063522\` (\`study_streak_id\`), UNIQUE INDEX \`REL_a706d6db681a07b5f485eff318\` (\`account_id\`), PRIMARY KEY (\`member_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`study_record\` (\`study_record_id\` bigint NOT NULL AUTO_INCREMENT, \`status\` varchar(20) NULL, \`start_time\` datetime NOT NULL, \`end_time\` datetime NULL, \`deleted_at\` datetime(6) NULL, \`member_id\` varchar(36) NOT NULL, \`study_category_id\` bigint NULL, PRIMARY KEY (\`study_record_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`character_inventory\` ADD CONSTRAINT \`FK_0a12f8fd7953c0d4144121928d0\` FOREIGN KEY (\`character_id\`) REFERENCES \`character\`(\`character_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`character_inventory\` ADD CONSTRAINT \`FK_902ac559defd8cee92bdad8d986\` FOREIGN KEY (\`member_id\`) REFERENCES \`member\`(\`member_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`study_category\` ADD CONSTRAINT \`FK_f85be32327b5dee5d2f990739a0\` FOREIGN KEY (\`member_id\`) REFERENCES \`member\`(\`member_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`transaction_record\` ADD CONSTRAINT \`FK_7ec9317c6ce8f69ecca19297c85\` FOREIGN KEY (\`member_id\`) REFERENCES \`member\`(\`member_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`study_streak\` ADD CONSTRAINT \`FK_9e1635a0fc56b33296773778804\` FOREIGN KEY (\`member_id\`) REFERENCES \`member\`(\`member_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`study_streak\` ADD CONSTRAINT \`FK_3e258f9a94463a16fcace07fdd4\` FOREIGN KEY (\`palette_id\`) REFERENCES \`palette\`(\`palette_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`item_inventory\` ADD CONSTRAINT \`FK_71f341e487f3e852d3002ac5ccc\` FOREIGN KEY (\`item_id\`) REFERENCES \`item\`(\`item_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`item_inventory\` ADD CONSTRAINT \`FK_a61d2df65198954805031f39001\` FOREIGN KEY (\`member_id\`) REFERENCES \`member\`(\`member_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`account\` ADD CONSTRAINT \`FK_77bf26eef8865441fb9bd53a364\` FOREIGN KEY (\`roleId\`) REFERENCES \`role\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`member\` ADD CONSTRAINT \`FK_51b8fd29e951724b448d063522a\` FOREIGN KEY (\`study_streak_id\`) REFERENCES \`study_streak\`(\`study_streak_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`member\` ADD CONSTRAINT \`FK_a706d6db681a07b5f485eff318d\` FOREIGN KEY (\`account_id\`) REFERENCES \`account\`(\`account_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`study_record\` ADD CONSTRAINT \`FK_608c80720b9ae99139d289b779c\` FOREIGN KEY (\`member_id\`) REFERENCES \`member\`(\`member_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`study_record\` ADD CONSTRAINT \`FK_9597be6d50b876ab9418893ed86\` FOREIGN KEY (\`study_category_id\`) REFERENCES \`study_category\`(\`study_category_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`study_record\` DROP FOREIGN KEY \`FK_9597be6d50b876ab9418893ed86\``);
        await queryRunner.query(`ALTER TABLE \`study_record\` DROP FOREIGN KEY \`FK_608c80720b9ae99139d289b779c\``);
        await queryRunner.query(`ALTER TABLE \`member\` DROP FOREIGN KEY \`FK_a706d6db681a07b5f485eff318d\``);
        await queryRunner.query(`ALTER TABLE \`member\` DROP FOREIGN KEY \`FK_51b8fd29e951724b448d063522a\``);
        await queryRunner.query(`ALTER TABLE \`account\` DROP FOREIGN KEY \`FK_77bf26eef8865441fb9bd53a364\``);
        await queryRunner.query(`ALTER TABLE \`item_inventory\` DROP FOREIGN KEY \`FK_a61d2df65198954805031f39001\``);
        await queryRunner.query(`ALTER TABLE \`item_inventory\` DROP FOREIGN KEY \`FK_71f341e487f3e852d3002ac5ccc\``);
        await queryRunner.query(`ALTER TABLE \`study_streak\` DROP FOREIGN KEY \`FK_3e258f9a94463a16fcace07fdd4\``);
        await queryRunner.query(`ALTER TABLE \`study_streak\` DROP FOREIGN KEY \`FK_9e1635a0fc56b33296773778804\``);
        await queryRunner.query(`ALTER TABLE \`transaction_record\` DROP FOREIGN KEY \`FK_7ec9317c6ce8f69ecca19297c85\``);
        await queryRunner.query(`ALTER TABLE \`study_category\` DROP FOREIGN KEY \`FK_f85be32327b5dee5d2f990739a0\``);
        await queryRunner.query(`ALTER TABLE \`character_inventory\` DROP FOREIGN KEY \`FK_902ac559defd8cee92bdad8d986\``);
        await queryRunner.query(`ALTER TABLE \`character_inventory\` DROP FOREIGN KEY \`FK_0a12f8fd7953c0d4144121928d0\``);
        await queryRunner.query(`DROP TABLE \`study_record\``);
        await queryRunner.query(`DROP INDEX \`REL_a706d6db681a07b5f485eff318\` ON \`member\``);
        await queryRunner.query(`DROP INDEX \`REL_51b8fd29e951724b448d063522\` ON \`member\``);
        await queryRunner.query(`DROP TABLE \`member\``);
        await queryRunner.query(`DROP INDEX \`IDX_4c8f96ccf523e9a3faefd5bdd4\` ON \`account\``);
        await queryRunner.query(`DROP INDEX \`IDX_d88d87a719d5c228e680e4daa0\` ON \`account\``);
        await queryRunner.query(`DROP TABLE \`account\``);
        await queryRunner.query(`DROP TABLE \`role\``);
        await queryRunner.query(`DROP TABLE \`item_inventory\``);
        await queryRunner.query(`DROP TABLE \`item\``);
        await queryRunner.query(`DROP INDEX \`REL_9e1635a0fc56b3329677377880\` ON \`study_streak\``);
        await queryRunner.query(`DROP TABLE \`study_streak\``);
        await queryRunner.query(`DROP TABLE \`palette\``);
        await queryRunner.query(`DROP TABLE \`transaction_record\``);
        await queryRunner.query(`DROP TABLE \`study_category\``);
        await queryRunner.query(`DROP TABLE \`character_inventory\``);
        await queryRunner.query(`DROP TABLE \`character\``);
    }

}
