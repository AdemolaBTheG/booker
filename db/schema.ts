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
  id: integer('id').primaryKey(),
  bookId: integer('book_id').notNull(),
  startTime: integer('start_time').notNull(),
  endTime: integer('end_time'),
  duration: integer('duration').notNull(),
  createdAt: integer('created_at').notNull()
});

export type DbBook = typeof books.$inferSelect;