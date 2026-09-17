import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateLikes1890000003000 implements MigrationInterface {
  name = 'CreateLikes1890000003000';

  async up(queryRunner: QueryRunner): Promise<void> {
    if (!(await queryRunner.hasTable('Likes'))) {
      await queryRunner.createTable(
        new Table({
          name: 'Likes',
          columns: [
            {
              name: 'id',
              type: 'integer',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'increment',
            },
            { name: 'userName', type: 'varchar' },
            { name: 'comment', type: 'varchar' },
            { name: 'nomineeId', type: 'integer' },
            {
              name: 'createdAt',
              type: 'timestamp without time zone',
              default: 'now()',
            },
          ],
        }),
      );
    }

    const likesTable = await queryRunner.getTable('Likes');
    if (
      likesTable &&
      !likesTable.foreignKeys.some((key) => key.columnNames.includes('nomineeId'))
    ) {
      await queryRunner.createForeignKey(
        'Likes',
        new TableForeignKey({
          name: 'FK_Likes_Nominees_nomineeId',
          columnNames: ['nomineeId'],
          referencedTableName: 'Nominees',
          referencedColumnNames: ['id'],
          onDelete: 'CASCADE',
        }),
      );
    }
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasTable('Likes')) {
      await queryRunner.dropTable('Likes');
    }
  }
}