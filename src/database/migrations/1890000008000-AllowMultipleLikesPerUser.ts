import { MigrationInterface, QueryRunner, TableUnique } from 'typeorm';

export class AllowMultipleLikesPerUser1890000008000
  implements MigrationInterface
{
  name = 'AllowMultipleLikesPerUser1890000008000';

  async up(queryRunner: QueryRunner): Promise<void> {
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

  async down(queryRunner: QueryRunner): Promise<void> {
    const likesTable = await queryRunner.getTable('Likes');
    const hasUserUnique = likesTable?.uniques.some(
      (unique) =>
        unique.name === 'UQ_Likes_userId' ||
        (unique.columnNames.length === 1 && unique.columnNames[0] === 'userId'),
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
}