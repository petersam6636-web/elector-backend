import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeExpireDateToString1890000006000 implements MigrationInterface {
  name = 'ChangeExpireDateToString1890000006000';

  async up(queryRunner: QueryRunner): Promise<void> {
    const keysTable = await queryRunner.getTable('Keys');
    if (!keysTable) {
      return;
    }

    const expireDateColumn = keysTable.columns.find((column) => column.name === 'expireDate');
    if (expireDateColumn) {
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

    const expireDateColumn = keysTable.columns.find((column) => column.name === 'expireDate');
    if (expireDateColumn && expireDateColumn.type === 'varchar') {
      await queryRunner.query(`
        ALTER TABLE "Keys"
        ALTER COLUMN "expireDate" TYPE integer
        USING CASE WHEN "expireDate" ~ '^[0-9]+$' THEN "expireDate"::integer ELSE NULL END;
      `);
    }
  }
}
