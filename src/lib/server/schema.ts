
import { text, integer, sqliteTable, real } from "drizzle-orm/sqlite-core";
import { relations } from 'drizzle-orm';

const pk = () => text("id").primaryKey().$defaultFn(() => crypto.randomUUID());

/** staff ============================================== **/

export const staff = sqliteTable( 'staff', {
  id: pk(),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  roles: text('roles', { mode: 'json' }).notNull(),
  editedBy: text('edited_by'),
  createdAt: integer('created_at', { mode : 'timestamp_ms' }),
  updatedAt: integer('updated_at', { mode : 'timestamp_ms' }),
  authUserId: text("auth_user_id").references(() => authUsers.id, { onDelete: 'cascade' }).notNull(),
isSuperAdmin: integer('is_super_admin', { mode: 'boolean' }),

})

/** pages ============================================== **/

export const pages = sqliteTable( 'pages', {
  id: pk(),
  attributes__title: text('attributes__title'),
  attributes__isHome: integer('attributes__is_home', { mode: 'boolean' }),
  attributes__slug: text('attributes__slug'),
  attributes__longTitle: text('attributes__long_title'),
  attributes__summary: text('attributes__summary'),
  attributes__icon: text('attributes__icon'),
  content__text: text('content__text'),
  _parent: text('_parent').references((): any => pages.id, {onDelete: 'set null'}),
  _position: real('_position'),
  url: text('url'),
  editedBy: text('edited_by'),
  createdAt: integer('created_at', { mode : 'timestamp_ms' }),
  updatedAt: integer('updated_at', { mode : 'timestamp_ms' }),
})

/** nav ============================================== **/

export const nav = sqliteTable( 'nav', {
  id: pk(),
  editedBy: text('edited_by'),
  createdAt: integer('created_at', { mode : 'timestamp_ms' }),
  updatedAt: integer('updated_at', { mode : 'timestamp_ms' }),
})

export const navTreeMain = sqliteTable( 'nav_tree_main', {
  id: pk(),
  path: text('path'),
  position: real('position'),
  label: text('label'),
  pages: text('pages', { mode: 'json'}),
  ownerId: text("owner_id").references(() => nav.id, { onDelete: 'cascade' }),
})

export const rel_navTreeMainHasOneNav = relations(navTreeMain, ({ one }) => ({
  nav : one(nav, {
    fields: [navTreeMain.ownerId],
    references: [nav.id],
  }),
}))

export const rel_navHasMany = relations(nav, ({ many }) => ({
  navTreeMain: many(navTreeMain),
}))

export const authUsers = sqliteTable('auth_users', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: integer('email_verified', { mode: 'boolean' }).notNull(),
	image: text('image'),
	createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
	role: text('role'),
	banned: integer('banned', { mode: 'boolean' }),
	banReason: text('ban_reason'),
	banExpires: integer('ban_expires', { mode: 'timestamp_ms' }),
	type: text('type').notNull()
  });

export const authSessions = sqliteTable('auth_sessions', {
	id: text('id').primaryKey(),
	expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull(),
	token: text('token').notNull().unique(),
	createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
	ipAddress: text('ip_address'),
	userAgent: text('user_agent'),
	userId: text('user_id')
		.notNull()
		.references(() => authUsers.id, { onDelete: 'cascade' }),
	impersonatedBy: text('impersonated_by')
  });

export const authAccounts = sqliteTable('auth_accounts', {
	id: text('id').primaryKey(),
	accountId: text('account_id').notNull(),
	providerId: text('provider_id').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => authUsers.id, { onDelete: 'cascade' }),
	accessToken: text('access_token'),
	refreshToken: text('refresh_token'),
	idToken: text('id_token'),
	accessTokenExpiresAt: integer('access_token_expires_at', { mode: 'timestamp_ms' }),
	refreshTokenExpiresAt: integer('refresh_token_expires_at', { mode: 'timestamp_ms' }),
	scope: text('scope'),
	password: text('password'),
	createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull()
  });

export const authVerifications = sqliteTable('auth_verifications', {
	id: text('id').primaryKey(),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),
	expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull(),
	createdAt: integer('created_at', { mode: 'timestamp_ms' }),
	updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
  });

export const tables = {
  staff,
  pages,
  nav,
  navTreeMain,
  authUsers,
  authAccounts,
  authVerifications,
  authSessions
}
export const relationFieldsMap: Record<string, any> = {
  staff : {},
  pages : {},
  nav : {}
}

const schema = {
	staff,
      pages,
      nav,
      navTreeMain,
	rel_navTreeMainHasOneNav,
      rel_navHasMany,
	authUsers,
	authAccounts,
	authVerifications,
	authSessions
}

declare module '@bienbien/rime' {
	export interface RegisterSchema {
			schema: typeof schema;
			tables: typeof tables;
	}
}
export default schema
 