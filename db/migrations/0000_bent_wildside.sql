CREATE TABLE `payments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`domain` text NOT NULL,
	`paymentStatus` text NOT NULL,
	`paymentId` text NOT NULL,
	`paymentInfo` text NOT NULL,
	`isTrial` integer NOT NULL,
	`paymentExpiry` integer NOT NULL,
	`expiresAt` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `payments_uuid_unique` ON `payments` (`uuid`);--> statement-breakpoint
CREATE UNIQUE INDEX `payments_paymentId_unique` ON `payments` (`paymentId`);--> statement-breakpoint
CREATE INDEX `index_domain` ON `payments` (`domain`);--> statement-breakpoint
CREATE INDEX `index_paymentStatus` ON `payments` (`paymentStatus`);--> statement-breakpoint
CREATE INDEX `index_paymentId` ON `payments` (`paymentId`);--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`uuid` text PRIMARY KEY NOT NULL,
	`domain` text NOT NULL,
	`expiresAt` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `subscriptions_uuid_unique` ON `subscriptions` (`uuid`);--> statement-breakpoint
CREATE INDEX `name` ON `subscriptions` (`domain`);