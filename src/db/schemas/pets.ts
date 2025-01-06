import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import {
  boolean,
  index,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'

import { owners } from './owner'

export const energyLevelEnum = pgEnum('energy_level', ['LOW', 'MEDIUM', 'HIGH'])
export const independenceLevelEnum = pgEnum('independence_level', [
  'LOW',
  'MEDIUM',
  'HIGH',
])
export const sizeEnum = pgEnum('size', ['SMALL', 'MEDIUM', 'LARGE'])
export const genderEnum = pgEnum('gender', ['MALE', 'FEMALE'])
export const speciesEnum = pgEnum('species', ['DOG', 'CAT', 'OTHER'])
export const temperamentEnum = pgEnum('temperament', [
  'FRIENDLY',
  'SHY',
  'ACTIVE',
  'CALM',
  'PROTECTIVE',
])

export type MediaItem = {
  url: string
  type: 'photo' | 'video'
  order: number
  title?: string
  description?: string
  thumbnailUrl?: string // for videos
  duration?: number // for videos, in seconds
}

export type PetMedia = {
  items: MediaItem[]
  mainPhotoUrl?: string // quick access to main photo
}

export type HealthInfo = {
  conditions?: string[]
  medications?: string[]
  specialNeeds?: string[]
  allergies?: string[]
}

export const pets = pgTable(
  'pets',
  {
    id: text('id')
      .$defaultFn(() => createId())
      .primaryKey(),

    name: varchar('name', { length: 100 }).notNull(),
    description: text('description').notNull(),
    species: speciesEnum('species').notNull(),
    breed: varchar('breed', { length: 100 }),
    color: varchar('color', { length: 50 }),
    weight: numeric('weight', { precision: 5, scale: 2 }),
    gender: genderEnum('gender').notNull(),
    dateOfBirth: timestamp('date_of_birth', {
      withTimezone: true,
      mode: 'date',
    }).notNull(),
    media: jsonb('media').$type<PetMedia>(),
    healthInfo: jsonb('health_info').$type<HealthInfo>(),

    energyLevel: energyLevelEnum('energy_level').notNull(),
    independenceLevel: independenceLevelEnum('independence_level').notNull(),
    temperament: temperamentEnum('temperament').notNull(),
    size: sizeEnum('size').notNull(),

    wasRescued: boolean('was_rescued').notNull().default(false),
    isCastrated: boolean('is_castrated').notNull().default(false),
    isAvailable: boolean('is_available').notNull().default(true),

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
    ownerIdIdx: index('pets_owner_id_idx').on(table.ownerId),
    speciesIdx: index('pets_species_idx').on(table.species),
    breedIdx: index('pets_breed_idx').on(table.breed),
    temperamentIdx: index('pets_temperament_idx').on(table.temperament),
    createdAtIdx: index('pets_created_at_idx').on(table.createdAt),
    filterIdx: index('pets_filter_idx').on(
      table.species,
      table.size,
      table.gender,
    ),
    availableSpeciesIdx: index('pets_available_species_idx').on(
      table.isAvailable,
      table.species,
    ),
    dateOfBirthIdx: index('pets_date_of_birth_idx').on(table.dateOfBirth),
    weightIdx: index('pets_weight_idx').on(table.weight),
    availableSizeIdx: index('pets_available_size_idx').on(
      table.isAvailable,
      table.size,
    ),
  }),
)

export const petsRelations = relations(pets, ({ one }) => ({
  owner: one(owners, {
    fields: [pets.ownerId],
    references: [owners.id],
  }),
}))
