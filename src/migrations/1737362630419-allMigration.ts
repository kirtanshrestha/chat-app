import { MigrationInterface, QueryRunner } from "typeorm";

export class AllMigration1737362630419 implements MigrationInterface {
    name = 'AllMigration1737362630419'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Rooms" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "type" character varying NOT NULL DEFAULT 'Public', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f120a70aaf1cecbd6c1ac8f1c23" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "messages" ("id" SERIAL NOT NULL, "content" character varying NOT NULL, "type" character varying NOT NULL DEFAULT 'text', "timestamp" TIMESTAMP NOT NULL DEFAULT now(), "senderId" integer, "roomId" uuid, CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "otp" integer, "isEmailVerified" boolean NOT NULL DEFAULT false, "password" character varying NOT NULL, "balance" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isActive" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "rooms_participants_users" ("roomsId" uuid NOT NULL, "usersId" integer NOT NULL, CONSTRAINT "PK_b69ec3990f8754e0c3fb00752a2" PRIMARY KEY ("roomsId", "usersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5786f149d1e9484b95f76904c7" ON "rooms_participants_users" ("roomsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_25c14c823bd467794300918305" ON "rooms_participants_users" ("usersId") `);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_2db9cf2b3ca111742793f6c37ce" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_aaa8a6effc7bd20a1172d3a3bc8" FOREIGN KEY ("roomId") REFERENCES "Rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rooms_participants_users" ADD CONSTRAINT "FK_5786f149d1e9484b95f76904c7d" FOREIGN KEY ("roomsId") REFERENCES "Rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "rooms_participants_users" ADD CONSTRAINT "FK_25c14c823bd4677943009183058" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rooms_participants_users" DROP CONSTRAINT "FK_25c14c823bd4677943009183058"`);
        await queryRunner.query(`ALTER TABLE "rooms_participants_users" DROP CONSTRAINT "FK_5786f149d1e9484b95f76904c7d"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_aaa8a6effc7bd20a1172d3a3bc8"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_2db9cf2b3ca111742793f6c37ce"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_25c14c823bd467794300918305"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5786f149d1e9484b95f76904c7"`);
        await queryRunner.query(`DROP TABLE "rooms_participants_users"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "messages"`);
        await queryRunner.query(`DROP TABLE "Rooms"`);
    }

}
