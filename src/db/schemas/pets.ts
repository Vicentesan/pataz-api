import { createId } from '@paralleldrive/cuid2'
import {
  boolean,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'

export const energyLevelEnum = pgEnum('energy_level', ['LOW', 'MEDIUM', 'HIGH'])
export const independenceLevelEnum = pgEnum('independence_level', [
  'LOW',
  'MEDIUM',
  'HIGH',
])
export const sizeEnum = pgEnum('size', ['SMALL', 'MEDIUM', 'LARGE'])

export const pets = pgTable('pets', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),

  name: text('name').notNull(),
  description: text('description').notNull(),

  age: numeric('age').notNull(),
  energyLevel: energyLevelEnum('energy_level').notNull(),
  independenceLevel: independenceLevelEnum('independence_level').notNull(),
  size: sizeEnum('size').notNull(),

  isActive: boolean('is_active').notNull().default(true),
  wasRescued: boolean('was_rescued').notNull().default(false),

  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow(),
})
