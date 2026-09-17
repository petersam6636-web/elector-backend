import {
  MigrationInterface,
  QueryRunner,
  TableForeignKey,
  TableUnique,
} from 'typeorm';

export class SyncEntitySchema1890000007000 implements MigrationInterface {
  name = 'SyncEntitySchema1890000007000';

  async up(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasTable('Nominees')) {
      if (!(await queryRunner.hasColumn('Nominees', 'description'))) {
        await queryRunner.query(`
          ALTER TABLE "Nominees"
          ADD COLUMN "description" varchar NOT NULL DEFAULT '';
        `);
        await queryRunner.query(`
          ALTER TABLE "Nominees"
          ALTER COLUMN "description" DROP DEFAULT;
        `);
      }

      if (!(await queryRunner.hasColumn('Nominees', 'menufestus'))) {
        await queryRunner.query(`
          ALTER TABLE "Nominees"
          ADD COLUMN "menufestus" varchar NOT NULL DEFAULT '';
        `);
        await queryRunner.query(`
          ALTER TABLE "Nominees"
          ALTER COLUMN "menufestus" DROP DEFAULT;
        `);
      }
    }

    if (await queryRunner.hasTable('Keys')) {
      if (await queryRunner.hasColumn('Keys', 'expireDate')) {
        await queryRunner.query(`
          ALTER TABLE "Keys"
          ALTER COLUMN "expireDate" TYPE bigint
          USING CASE
            WHEN "expireDate"::text ~ '^-?[0-9]+$' THEN "expireDate"::bigint
            ELSE NULL
          END;
        `);
      }
    }

    if (await queryRunner.hasTable('Likes')) {
      if (!(await queryRunner.hasColumn('Likes', 'userId'))) {
        await queryRunner.query(`
          ALTER TABLE "Likes"
          ADD COLUMN "userId" integer;
        `);
      }

      await queryRunner.query(`
        UPDATE "Likes" AS likes
        SET "userId" = users.id
        FROM "Users" AS users
        WHERE likes."userId" IS NULL
          AND likes."userName" = users."userName";
      `);

      const likesWithoutUser = await queryRunner.query(`
        SELECT COUNT(*)::integer AS count
        FROM "Likes"
        WHERE "userId" IS NULL;
      `);
      if (likesWithoutUser[0]?.count > 0) {
        throw new Error('Cannot migrate Likes: some rows have no matching Users.userName');
      }

      const duplicateLikes = await queryRunner.query(`
        SELECT "userId"
        FROM "Likes"
        GROUP BY "userId"
        HAVING COUNT(*) > 1;
      `);
      if (duplicateLikes.length > 0) {
        throw new Error('Cannot migrate Likes: one user has multiple likes');
      }

      await queryRunner.query(`
        ALTER TABLE "Likes"
        ALTER COLUMN "userId" SET NOT NULL;
      `);

      const likesTable = await queryRunner.getTable('Likes');
      if (
        likesTable &&
        !likesTable.foreignKeys.some(
          (foreignKey) =>
            foreignKey.columnNames.length === 1 &&
            foreignKey.columnNames[0] === 'userId' &&
            foreignKey.referencedTableName === 'Users',
        )
      ) {
        await queryRunner.createForeignKey(
          'Likes',
          new TableForeignKey({
            name: 'FK_Likes_Users_userId',
            columnNames: ['userId'],
            referencedTableName: 'Users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          }),
        );
      }

      const refreshedLikesTable = await queryRunner.getTable('Likes');
      if (
        refreshedLikesTable &&
        !refreshedLikesTable.uniques.some(
          (unique) =>
            unique.columnNames.length === 1 && unique.columnNames[0] === 'userId',
        )
      ) {
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

  async down(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasTable('Likes')) {
      const likesTable = await queryRunner.getTable('Likes');
      const userForeignKey = likesTable?.foreignKeys.find(
        (foreignKey) => foreignKey.name === 'FK_Likes_Users_userId',
      );
      if (userForeignKey) {
        await queryRunner.dropForeignKey('Likes', userForeignKey);
      }

      const userUnique = likesTable?.uniques.find(
        (unique) => unique.name === 'UQ_Likes_userId',
      );
      if (userUnique) {
        await queryRunner.dropUniqueConstraint('Likes', userUnique);
      }

      if (await queryRunner.hasColumn('Likes', 'userId')) {
        await queryRunner.query(`ALTER TABLE "Likes" DROP COLUMN "userId";`);
      }
    }

    if (await queryRunner.hasTable('Keys') && await queryRunner.hasColumn('Keys', 'expireDate')) {
      await queryRunner.query(`
        ALTER TABLE "Keys"
        ALTER COLUMN "expireDate" TYPE varchar
        USING "expireDate"::text;
      `);
    }

    if (await queryRunner.hasTable('Nominees')) {
      if (await queryRunner.hasColumn('Nominees', 'menufestus')) {
        await queryRunner.query(`ALTER TABLE "Nominees" DROP COLUMN "menufestus";`);
      }
      if (await queryRunner.hasColumn('Nominees', 'description')) {
        await queryRunner.query(`ALTER TABLE "Nominees" DROP COLUMN "description";`);
      }
    }
  }
}