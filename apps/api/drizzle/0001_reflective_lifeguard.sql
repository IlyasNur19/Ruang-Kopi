CREATE TABLE "detail_transaksi" (
	"id" serial PRIMARY KEY NOT NULL,
	"transaksi_id" integer,
	"menu_id" integer,
	"nama_menu" text NOT NULL,
	"qty" integer NOT NULL,
	"harga" integer NOT NULL,
	"subtotal" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "meja" (
	"id" serial PRIMARY KEY NOT NULL,
	"nomor_meja" text NOT NULL,
	"kapasitas" integer DEFAULT 4 NOT NULL,
	"status" text DEFAULT 'tersedia' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "meja_nomor_meja_unique" UNIQUE("nomor_meja")
);
--> statement-breakpoint
CREATE TABLE "transaksi" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" text NOT NULL,
	"meja_id" integer,
	"user_id" integer,
	"customer_name" text,
	"tipe_pesanan" text DEFAULT 'walk_in' NOT NULL,
	"payment_method" text DEFAULT 'cash' NOT NULL,
	"subtotal" integer NOT NULL,
	"tax" integer DEFAULT 0 NOT NULL,
	"total" integer NOT NULL,
	"amount_paid" integer NOT NULL,
	"change" integer DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'completed' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "transaksi_order_id_unique" UNIQUE("order_id")
);
--> statement-breakpoint
ALTER TABLE "detail_transaksi" ADD CONSTRAINT "detail_transaksi_transaksi_id_transaksi_id_fk" FOREIGN KEY ("transaksi_id") REFERENCES "public"."transaksi"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "detail_transaksi" ADD CONSTRAINT "detail_transaksi_menu_id_menu_items_id_fk" FOREIGN KEY ("menu_id") REFERENCES "public"."menu_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaksi" ADD CONSTRAINT "transaksi_meja_id_meja_id_fk" FOREIGN KEY ("meja_id") REFERENCES "public"."meja"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaksi" ADD CONSTRAINT "transaksi_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;