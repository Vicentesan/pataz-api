import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import {
  index,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'

import { owners } from './owner'
import { pets } from './pets'

export const adoptionStatusEnum = pgEnum('adoption_status', [
  'PENDING',
  'APPROVED',
  'REJECTED',
  'COMPLETED',
  'CANCELLED',
])

export const contactPreferenceEnum = pgEnum('contact_preference', [
  'EMAIL',
  'PHONE',
  'BOTH',
])

export type PetCosts = {
  vaccination?: number
  castration?: number
  antiparasitic?: number
  microchip?: number
  other?: Array<{
    description: string
    cost: number
  }>
}

export const adoptionPost = pgTable(
  'adoption_post',
  {
    id: text('id')
      .$defaultFn(() => createId())
      .primaryKey(),

    description: text('description').notNull(),
    costs: jsonb('costs').$type<PetCosts>(),
    status: adoptionStatusEnum('status').notNull().default('PENDING'),
    contactPreference: contactPreferenceEnum('contact_preference')
      .notNull()
      .default('BOTH'),

    petId: text('pet_id')
      .references(() => pets.id, { onDelete: 'cascade', onUpdate: 'cascade' })
      .notNull(),
    ownerId: text('owner_id')
      .references(() => owners.id, { onDelete: 'cascade', onUpdate: 'cascade' })
      .notNull(),

    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .defaultNow(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    statusIdx: index('adoption_post_status_idx').on(table.status),
    ownerIdIdx: index('adoption_post_owner_id_idx').on(table.ownerId),
    petIdIdx: index('adoption_post_pet_id_idx').on(table.petId),
    createdAtIdx: index('adoption_post_created_at_idx').on(table.createdAt),
    statusOwnerIdx: index('adoption_post_status_owner_idx').on(
      table.status,
      table.ownerId,
    ),
  }),
)

export const adoptionPostRelations = relations(adoptionPost, ({ one }) => ({
  owner: one(owners, {
    fields: [adoptionPost.ownerId],
    references: [owners.id],
  }),
  pet: one(pets, {
    fields: [adoptionPost.petId],
    references: [pets.id],
  }),
}))
