import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

import { organizationMembers } from './organization-members'
import { users } from './users'

export const organizations = pgTable('organizations', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),

  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  avatarUrl: text('avatar_url'),

  ownerId: text('owner_id')
    .references(() => users.id)
    .notNull(),

  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow(),
})

export const organizationsRelations = relations(
  organizations,
  ({ one, many }) => ({
    members: many(organizationMembers),
    owner: one(users, {
      fields: [organizations.ownerId],
      references: [users.id],
    }),
  }),
)
