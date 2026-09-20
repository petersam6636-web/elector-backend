import { MigrationInterface, QueryRunner, TableUnique } from 'typeorm';

export class RestoreUserLikeOneToOne1890000009000
  implements MigrationInterface
{
  name = 'RestoreUserLikeOneToOne1890000009000';

  async up(queryRunner: QueryRunner): Promise<void> {
    if (!(await queryRunner.hasTable('Likes'))) {
      return;
    }

    const duplicateLikes = await queryRunner.query(`
      SELECT "userId"
      FROM "Likes"
      GROUP BY "userId"
      HAVING COUNT(*) > 1;
    `);

    if (duplicateLikes.length > 0) {
      throw new Error(
        'Cannot restore User-Like one-to-one relationship: Likes contains multiple rows for the same userId',
      );
    }

    const likesTable = await queryRunner.getTable('Likes');
    const hasUserUnique = likesTable?.uniques.some(
      (unique) =>
        unique.columnNames.length === 1 && unique.columnNames[0] === 'userId',
    );

    if (!hasUserUnique) {
      await queryRunner.createUniqueConstraint(
        'Likes',
        new TableUnique({
          name: 'UQ_Likes_userId',
          columnNames: ['userId'],
        }),
      );
    }
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    if (!(await queryRunner.hasTable('Likes'))) {
      return;
    }

    const likesTable = await queryRunner.getTable('Likes');
    const userUnique = likesTable?.uniques.find(
      (unique) =>
        unique.name === 'UQ_Likes_userId' ||
        (unique.columnNames.length === 1 && unique.columnNames[0] === 'userId'),
    );

    if (userUnique) {
      await queryRunner.dropUniqueConstraint(
        'Likes',
        new TableUnique({
          name: userUnique.name,
          columnNames: userUnique.columnNames,
        }),
      );
    }
  }
}