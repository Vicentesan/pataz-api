import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import {
  boolean,
  index,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'

import { adoptionPost } from './adoption-post'
import { organizationMembers } from './organization-members'
import { organizations } from './organizations'
import { owners } from './owner'

export const providerEnum = pgEnum('provider', ['GOOGLE'])

export type NotificationPreferences = {
  email: {
    newMessages: boolean
    adoptionUpdates: boolean
    marketingEmails: boolean
  }
  push: {
    newMessages: boolean
    adoptionUpdates: boolean
  }
}

export const users = pgTable(
  'users',
  {
    id: text('id')
      .$defaultFn(() => createId())
      .primaryKey(),

    name: varchar('name', { length: 100 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    emailVerified: boolean('email_verified').notNull().default(false),
    password: text('password'),
    phoneNumber: varchar('phone_number', { length: 20 }),
    avatarUrl: text('avatar_url'),

    provider: providerEnum('provider'),
    providerId: text('provider_id').unique(),

    notificationPreferences: jsonb(
      'notification_preferences',
    ).$type<NotificationPreferences>(),

    lastLoginAt: timestamp('last_login_at', {
      withTimezone: true,
      mode: 'date',
    }),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .defaultNow(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    emailIdx: index('users_email_idx').on(table.email),
    providerIdIdx: index('users_provider_id_idx').on(table.providerId),
    phoneNumberIdx: index('users_phone_number_idx').on(table.phoneNumber),
    // Composite index for auth
    authIdx: index('users_auth_idx').on(table.provider, table.providerId),
  }),
)

export const usersRelations = relations(users, ({ many }) => ({
  organizations: many(organizations),
  organizationMembers: many(organizationMembers),
  adoptionPosts: many(adoptionPost),
  owns: many(owners),
}))
