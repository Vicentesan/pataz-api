import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import { pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

import { adoptionPost } from './adoption-post'
import { authors } from './authors'
import { organizationMembers } from './organization-members'
import { organizations } from './organizations'

export const providerEnum = pgEnum('provider', ['GOOGLE'])

export const users = pgTable('users', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),

  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password'),
  avatarUrl: text('avatar_url'),

  provider: providerEnum('provider'),
  providerId: text('provider_id').unique(),

  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow(),
})

export const usersRelations = relations(users, ({ many }) => ({
  authors: many(authors),
  organizations: many(organizations),
  organizationMembers: many(organizationMembers),
  adoptionPosts: many(adoptionPost),
}))
