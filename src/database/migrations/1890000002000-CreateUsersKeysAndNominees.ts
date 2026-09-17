import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateUsersKeysAndNominees1890000002000
  implements MigrationInterface
{
  name = 'CreateUsersKeysAndNominees1890000002000';

  async up(queryRunner: QueryRunner): Promise<void> {
    if (!(await queryRunner.hasTable('Users'))) {
      await queryRunner.createTable(
        new Table({
          name: 'Users',
          columns: [
            {
              name: 'id',
              type: 'integer',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'increment',
            },
            { name: 'userName', type: 'varchar' },
            { name: 'email', type: 'varchar' },
            { name: 'password', type: 'varchar' },
            {
              name: 'createdAt',
              type: 'timestamp without time zone',
              default: 'now()',
            },
          ],
        }),
      );
    }

    if (!(await queryRunner.hasTable('Keys'))) {
      await queryRunner.createTable(
        new Table({
          name: 'Keys',
          columns: [
            {
              name: 'id',
              type: 'integer',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'increment',
            },
            { name: 'userKey', type: 'integer' },
            { name: 'userId', type: 'integer', isUnique: true },
            {
              name: 'createdAt',
              type: 'timestamp without time zone',
              default: 'now()',
            },
          ],
        }),
      );
    }

    if (!(await queryRunner.hasTable('Nominees'))) {
      await queryRunner.createTable(
        new Table({
          name: 'Nominees',
          columns: [
            {
              name: 'id',
              type: 'integer',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'increment',
            },
            { name: 'firstName', type: 'varchar' },
            { name: 'lastName', type: 'varchar' },
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

    const keysTable = await queryRunner.getTable('Keys');
    if (keysTable && !keysTable.foreignKeys.some((key) => key.columnNames.includes('userId'))) {
      await queryRunner.createForeignKey(
        'Keys',
        new TableForeignKey({
          name: 'FK_Keys_Users_userId',
          columnNames: ['userId'],
          referencedTableName: 'Users',
          referencedColumnNames: ['id'],
        }),
      );
    }

    const nomineesTable = await queryRunner.getTable('Nominees');
    if (
      nomineesTable &&
      !nomineesTable.foreignKeys.some((key) => key.columnNames.includes('userId'))
    ) {
      await queryRunner.createForeignKey(
        'Nominees',
        new TableForeignKey({
          name: 'FK_Nominees_Users_userId',
          columnNames: ['userId'],
          referencedTableName: 'Users',
          referencedColumnNames: ['id'],
        }),
      );
    }
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasTable('Keys')) {
      await queryRunner.dropTable('Keys');
    }

    if (await queryRunner.hasTable('Nominees')) {
      await queryRunner.dropTable('Nominees');
    }

    if (await queryRunner.hasTable('Users')) {
      await queryRunner.dropTable('Users');
    }
  }
}