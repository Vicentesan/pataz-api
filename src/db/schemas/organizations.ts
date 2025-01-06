import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import {
  index,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'

import { organizationMembers } from './organization-members'
import { users } from './users'

export const organizationStatusEnum = pgEnum('organization_status', [
  'PENDING_VERIFICATION',
  'ACTIVE',
  'SUSPENDED',
])

export type Address = {
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  country: string
}

export type SocialMedia = {
  instagram?: string
  facebook?: string
  twitter?: string
  youtube?: string
}

export type OperatingHours = {
  monday?: { open: string; close: string }
  tuesday?: { open: string; close: string }
  wednesday?: { open: string; close: string }
  thursday?: { open: string; close: string }
  friday?: { open: string; close: string }
  saturday?: { open: string; close: string }
  sunday?: { open: string; close: string }
}

export const organizations = pgTable(
  'organizations',
  {
    id: text('id')
      .$defaultFn(() => createId())
      .primaryKey(),

    name: varchar('name', { length: 100 }).notNull(),
    description: text('description'),
    email: varchar('email', { length: 255 }).notNull().unique(),
    phoneNumber: varchar('phone_number', { length: 20 }),
    website: varchar('website', { length: 255 }),
    address: jsonb('address').$type<Address>(),
    socialMedia: jsonb('social_media').$type<SocialMedia>(),
    operatingHours: jsonb('operating_hours').$type<OperatingHours>(),
    avatarUrl: text('avatar_url'),

    status: organizationStatusEnum('status')
      .notNull()
      .default('PENDING_VERIFICATION'),

    ownerId: text('owner_id')
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
    ownerIdIdx: index('organizations_owner_id_idx').on(table.ownerId),
    emailIdx: index('organizations_email_idx').on(table.email),
    statusIdx: index('organizations_status_idx').on(table.status),
    cityStateIdx: index('organizations_city_state_idx').on(table.address),
    nameIdx: index('organizations_name_idx').on(table.name),
    phoneIdx: index('organizations_phone_idx').on(table.phoneNumber),
    statusCreatedIdx: index('organizations_status_created_idx').on(
      table.status,
      table.createdAt,
    ),
  }),
)

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
