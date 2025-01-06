import { createId } from '@paralleldrive/cuid2'
import { index, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

import { organizations } from './organizations'
import { users } from './users'

export const organizationMemberRoleEnum = pgEnum('organization_member_role', [
  'ADMIN',
  'MEMBER',
])

export const organizationMembers = pgTable(
  'organization_members',
  {
    id: text('id')
      .$defaultFn(() => createId())
      .primaryKey(),

    role: organizationMemberRoleEnum('role').notNull(),

    organizationId: text('organization_id')
      .references(() => organizations.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      })
      .notNull(),
    userId: text('user_id')
      .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' })
      .notNull(),

    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .defaultNow(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    organizationIdIdx: index('org_members_organization_id_idx').on(
      table.organizationId,
    ),
    userIdIdx: index('org_members_user_id_idx').on(table.userId),
    roleIdx: index('org_members_role_idx').on(table.role),
    orgUserRoleIdx: index('org_members_org_user_role_idx').on(
      table.organizationId,
      table.userId,
      table.role,
    ),
  }),
)
