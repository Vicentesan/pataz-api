import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

import { authors } from './authors'
import { pets } from './pets'

export const adoptionPost = pgTable('adoption_post', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),

  petId: text('pet_id')
    .references(() => pets.id)
    .notNull(),

  authorId: text('author_id')
    .references(() => authors.id)
    .notNull(),

  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow(),
})

export const adoptionPostRelations = relations(adoptionPost, ({ one }) => ({
  author: one(authors, {
    fields: [adoptionPost.authorId],
    references: [authors.id],
  }),
  pet: one(pets, {
    fields: [adoptionPost.petId],
    references: [pets.id],
  }),
}))
