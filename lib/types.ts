import {z } from 'zod'
import {books} from '@/db/schema'

export interface Book {

    title: string,
    authors?: string[],
    publisher?: string,
    publishedDate?: string,
    description?: string,
    pageCount?: number,
    isbn_10?: string,
    isbn_13?: string,
    thumbnail?: string,
    medium?: string,
    id: string


}

export const bookSchema = z.object({
    title: z.string({message:"Title is required"}).min(1),
    authors: z.array(z.string()).optional(),
    pages: z.string({message:"Pages is required"}).min(1),
    publisher: z.string().optional(),
    publishedDate: z.string().optional(),
    description: z.string().optional(),
    isbn_10: z.string().optional(),
    isbn_13: z.string().optional(),
    thumbnail: z.string().optional(),
    readingStatus: z.string({message:"Reading Status is required"}),
    ownershipStatus: z.string({message:"Ownership Status is required"}),
    format: z.string({message: 'Format is required'}),
})

export type NewBook = typeof books.$inferInsert