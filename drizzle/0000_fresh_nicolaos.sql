CREATE TABLE `books` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`author` text NOT NULL,
	`isbn_10` text,
	`isbn_13` text,
	`thumbnail` text,
	`description` text,
	`published_date` text,
	`page_count` integer NOT NULL
);
