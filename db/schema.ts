import {sqliteTable, text,integer} from 'drizzle-orm/sqlite-core'

export const books = sqliteTable('books',{
    id: integer('id').primaryKey({autoIncrement: true}),
    title: text('title').notNull(),
    author: text('author').notNull(),
    isbn_10: text('isbn_10'),
    isbn_13: text('isbn_13'),
    thumbnail: text('thumbnail'),
    description: text('description'),
    published_date: text('published_date'),
    page_count: integer('page_count').notNull(),
    ownership_status: text('ownership_status').notNull(),
    reading_status: text('reading_status').notNull(),
    format: text('format').notNull(),
    publisher: text('publisher'),
})
