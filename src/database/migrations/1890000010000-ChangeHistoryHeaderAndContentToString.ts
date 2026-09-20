import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeHistoryHeaderAndContentToString1890000010000
  implements MigrationInterface
{
  name = 'ChangeHistoryHeaderAndContentToString1890000010000';

  async up(queryRunner: QueryRunner): Promise<void> {
    if (!(await queryRunner.hasTable('History'))) {
      return;
    }

    if (await queryRunner.hasColumn('History', 'header')) {
      await queryRunner.query(`
        ALTER TABLE "History"
        ALTER COLUMN "header" TYPE varchar
        USING "header"::text;
      `);
    }

    if (await queryRunner.hasColumn('History', 'content')) {
      await queryRunner.query(`
        ALTER TABLE "History"
        ALTER COLUMN "content" TYPE varchar
        USING "content"::text;
      `);
    }
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    if (!(await queryRunner.hasTable('History'))) {
      return;
    }

    if (await queryRunner.hasColumn('History', 'header')) {
      await queryRunner.query(`
        ALTER TABLE "History"
        ALTER COLUMN "header" TYPE integer
        USING "header"::integer;
      `);
    }

    if (await queryRunner.hasColumn('History', 'content')) {
      await queryRunner.query(`
        ALTER TABLE "History"
        ALTER COLUMN "content" TYPE integer
        USING "content"::integer;
      `);
    }
  }
}