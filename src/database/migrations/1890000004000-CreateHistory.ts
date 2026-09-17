import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateHistory1890000004000 implements MigrationInterface {
  name = 'CreateHistory1890000004000';

  async up(queryRunner: QueryRunner): Promise<void> {
    if (!(await queryRunner.hasTable('History'))) {
      await queryRunner.createTable(
        new Table({
          name: 'History',
          columns: [
            {
              name: 'id',
              type: 'integer',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'increment',
            },
            { name: 'header', type: 'integer' },
            { name: 'content', type: 'integer' },
            { name: 'userId', type: 'integer' },
            {
              name: 'createdAt',
              type: 'timestamp without time zone',
              default: 'now()',
            },
          ],
        }),
      );
    }

    const historyTable = await queryRunner.getTable('History');
    if (
      historyTable &&
      !historyTable.foreignKeys.some((key) => key.columnNames.includes('userId'))
    ) {
      await queryRunner.createForeignKey(
        'History',
        new TableForeignKey({
          name: 'FK_History_Users_userId',
          columnNames: ['userId'],
          referencedTableName: 'Users',
          referencedColumnNames: ['id'],
          onDelete: 'CASCADE',
        }),
      );
    }
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasTable('History')) {
      await queryRunner.dropTable('History');
    }
  }
}