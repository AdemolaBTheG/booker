PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_books` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`authors` text,
	`isbn_10` text,
	`isbn_13` text,
	`thumbnail` text,
	`description` text,
	`publishedDate` text,
	`pages` integer NOT NULL,
	`ownershipStatus` text NOT NULL,
	`readingStatus` text NOT NULL,
	`format` text NOT NULL,
	`publisher` text
);
--> statement-breakpoint
INSERT INTO `__new_books`("id", "title", "authors", "isbn_10", "isbn_13", "thumbnail", "description", "publishedDate", "pages", "ownershipStatus", "readingStatus", "format", "publisher") SELECT "id", "title", "authors", "isbn_10", "isbn_13", "thumbnail", "description", "publishedDate", "pages", "ownershipStatus", "readingStatus", "format", "publisher" FROM `books`;--> statement-breakpoint
DROP TABLE `books`;--> statement-breakpoint
ALTER TABLE `__new_books` RENAME TO `books`;--> statement-breakpoint
PRAGMA foreign_keys=ON;