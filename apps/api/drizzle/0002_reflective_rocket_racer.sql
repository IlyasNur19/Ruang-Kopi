CREATE TABLE "payment_gateway" (
	"id" serial PRIMARY KEY NOT NULL,
	"transaksi_id" integer,
	"reservasi_id" integer,
	"order_id_midtrans" text NOT NULL,
	"metode_pembayaran" text,
	"status_pembayaran" text DEFAULT 'pending' NOT NULL,
	"waktu_dibayar" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "payment_gateway_order_id_midtrans_unique" UNIQUE("order_id_midtrans")
);
--> statement-breakpoint
ALTER TABLE "reservations" ALTER COLUMN "status" SET DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "reservations" ADD COLUMN "user_id" integer;--> statement-breakpoint
ALTER TABLE "reservations" ADD COLUMN "meja_id" integer;--> statement-breakpoint
ALTER TABLE "transaksi" ADD COLUMN "reservasi_id" integer;--> statement-breakpoint
ALTER TABLE "payment_gateway" ADD CONSTRAINT "payment_gateway_transaksi_id_transaksi_id_fk" FOREIGN KEY ("transaksi_id") REFERENCES "public"."transaksi"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_gateway" ADD CONSTRAINT "payment_gateway_reservasi_id_reservations_id_fk" FOREIGN KEY ("reservasi_id") REFERENCES "public"."reservations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_meja_id_meja_id_fk" FOREIGN KEY ("meja_id") REFERENCES "public"."meja"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaksi" ADD CONSTRAINT "transaksi_reservasi_id_reservations_id_fk" FOREIGN KEY ("reservasi_id") REFERENCES "public"."reservations"("id") ON DELETE no action ON UPDATE no action;