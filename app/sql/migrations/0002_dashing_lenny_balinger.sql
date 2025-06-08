ALTER TABLE "budgets" ADD COLUMN "date" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "budgets" DROP COLUMN "year";--> statement-breakpoint
ALTER TABLE "budgets" DROP COLUMN "month";