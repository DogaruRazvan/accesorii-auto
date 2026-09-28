import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20260928000100 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`create table if not exists "eawb_booking" ("id" text not null, "order_id" text not null, "request_hash" text not null, "status" text check ("status" in ('pending','booked','uncertain','rejected','cancelled')) not null, "result" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "eawb_booking_pkey" primary key ("id"));`)
    this.addSql(`create unique index if not exists "IDX_eawb_booking_order_id_unique" on "eawb_booking" ("order_id") where deleted_at is null;`)
    this.addSql(`create index if not exists "IDX_eawb_booking_deleted_at" on "eawb_booking" ("deleted_at") where deleted_at is null;`)
  }
  override async down(): Promise<void> {
    this.addSql(`drop table if exists "eawb_booking";`)
  }
}
