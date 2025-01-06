import { createId } from '@paralleldrive/cuid2'
import { pgTable, text } from 'drizzle-orm/pg-core'

import { organizations } from './organizations'
import { users } from './users'

export const owners = pgTable('owners', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),

  userId: text('user_id').references(() => users.id),
  organizationId: text('organization_id').references(() => organizations.id),
})
