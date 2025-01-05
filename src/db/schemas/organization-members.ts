import { createId } from '@paralleldrive/cuid2'
import { pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

import { organizations } from './organizations'
import { users } from './users'

export const organizationMemberRoleEnum = pgEnum('organization_member_role', [
  'ADMIN',
  'MEMBER',
])

export const organizationMembers = pgTable('organization_members', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),

  role: organizationMemberRoleEnum('role').notNull(),

  organizationId: text('organization_id')
    .references(() => organizations.id)
    .notNull(),
  userId: text('user_id')
    .references(() => users.id)
    .notNull(),

  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow(),
})
