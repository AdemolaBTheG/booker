import {z } from 'zod'
import {books} from '@/db/schema'

export interface Book {

    title: string,
    authors?: string[],
    publisher?: string,
    publishedDate?: string,
    description?: string,
    pages?: number,
    isbn_10?: string,
    isbn_13?: string,
    thumbnail?: string,
    medium?: string,
    id: string


}

export interface BookDB {
    id: number,
    title: string,
    authors?: string[],
    publisher?: string,
    publishedDate?: string,
    description?: string,
    pages?: number,
    isbn_10?: string,
    isbn_13?: string,
    thumbnail?: string,
    readingStatus: string,
    ownershipStatus: string,
    format?: string,
    volumId?: string,
}

export interface ReadingSession {

    bookId: number,
    duration: number,
    ended_at: number,
    startedAtPage: number,
    notes: string | null,
    pagesRead: number,

}

export const bookSchema = z.object({
    title: z.string({message:"Title is required"}).min(1),
    authors: z.array(z.string()).optional(),
    pages: z.string()
    .min(1, {message: "Pages is required"})
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val >= 1, {
      message: "Pages must be at least 1"
    }),
    publisher: z.string().optional(),
    publishedDate: z.string().optional(),
    description: z.string().optional(),
    isbn_10: z.string().optional(),
    isbn_13: z.string().optional(),
    thumbnail: z.string().optional(),
    readingStatus: z.string({message:"Reading Status is required"}).min(1),
    ownershipStatus: z.string({message:"Ownership Status is required"}).min(1),
    format: z.string({message: 'Format is required'}).min(1),
})

export type NewBook = typeof books.$inferInsert