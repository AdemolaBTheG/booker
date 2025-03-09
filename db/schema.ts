import {sqliteTable, text,integer} from 'drizzle-orm/sqlite-core'

export const books = sqliteTable('books',{
    id: integer('id').primaryKey({autoIncrement: true}),
    title: text('title').notNull(),
    authors: text('authors'),
    isbn_10: text('isbn_10'),
    isbn_13: text('isbn_13'),
    thumbnail: text('thumbnail'),
    description: text('description'),
    publishedDate: text('publishedDate'),
    pages: integer('pages').notNull(),
    ownershipStatus: text('ownershipStatus').notNull(),
    readingStatus: text('readingStatus').notNull(),
    format: text('format').notNull(),
    publisher: text('publisher'),
    volumId: text('volumId'),
})

export const readingSessions = sqliteTable('reading_sessions', {
  id: integer('id').primaryKey({autoIncrement: true}),
  bookId: integer('book_id').notNull(),
  duration: integer('duration').notNull(),
  ended_at: integer('date').notNull(),
  startedAtPage: integer('started_at_page').notNull(),
  notes: text('notes'),
  pagesRead: integer('pages_read').notNull(),
});

export type DbBook = typeof books.$inferSelect;

export type DbReadingSession = typeof readingSessions.$inferSelect;