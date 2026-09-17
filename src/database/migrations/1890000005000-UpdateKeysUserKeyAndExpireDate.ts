import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateKeysUserKeyAndExpireDate1890000005000
  implements MigrationInterface
{
  name = 'UpdateKeysUserKeyAndExpireDate1890000005000';

  async up(queryRunner: QueryRunner): Promise<void> {
    const keysTable = await queryRunner.getTable('Keys');
    if (!keysTable) {
      return;
    }

    const hasUserKey = keysTable.columns.some((column) => column.name === 'userKey');
    if (hasUserKey) {
      await queryRunner.query(`
        ALTER TABLE "Keys"
        ALTER COLUMN "userKey" TYPE varchar
        USING "userKey"::text;
      `);
    }

    const hasExpireDate = keysTable.columns.some((column) => column.name === 'expireDate');
    if (!hasExpireDate) {
      await queryRunner.query(`
        ALTER TABLE "Keys"
        ADD COLUMN "expireDate" varchar;
      `);
    } else {
      await queryRunner.query(`
        ALTER TABLE "Keys"
        ALTER COLUMN "expireDate" TYPE varchar
        USING "expireDate"::text;
      `);
    }
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    const keysTable = await queryRunner.getTable('Keys');
    if (!keysTable) {
      return;
    }

    const hasExpireDate = keysTable.columns.some((column) => column.name === 'expireDate');
    if (hasExpireDate) {
      await queryRunner.query(`
        ALTER TABLE "Keys"
        DROP COLUMN "expireDate";
      `);
    }

    const userKeyColumn = keysTable.columns.find((column) => column.name === 'userKey');
    if (userKeyColumn && userKeyColumn.type === 'varchar') {
      await queryRunner.query(`
        ALTER TABLE "Keys"
        ALTER COLUMN "userKey" TYPE integer
        USING CASE WHEN "userKey" ~ '^[0-9]+$' THEN "userKey"::integer ELSE NULL END;
      `);
    }
  }
}
