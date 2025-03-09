CREATE TABLE `reading_sessions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`book_id` integer NOT NULL,
	`duration` integer NOT NULL,
	`date` integer NOT NULL,
	`started_at_page` integer NOT NULL,
	`notes` text,
	`pages_read` integer NOT NULL
);
