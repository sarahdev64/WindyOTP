CREATE TABLE `config` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`key` text NOT NULL,
	`value` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `themes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`backdrop` text NOT NULL,
	`nav` text NOT NULL,
	`txt` text NOT NULL,
	`input` text NOT NULL,
	`card` text NOT NULL,
	`primary` text NOT NULL,
	`danger` text NOT NULL
);
