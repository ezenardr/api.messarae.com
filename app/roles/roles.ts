import createPowerIota from './create_power_iota.js'

export const Role = {
  User: 1,
  Author: 2,
  Admin: 3,
  Owner: 4,
} as const

export type TRole = (typeof Role)[keyof typeof Role]

const iota = createPowerIota()

export const UserActions = {
  'reads:view': iota(),
  'reads:create': iota(),
  'reads:delete': iota(),
  'reads:update': iota(),
} as const

export type UserAction = (typeof UserActions)[keyof typeof UserActions]

const UserPermission = UserActions['reads:view']

const AuthorPermission =
  UserPermission |
  UserActions['reads:create'] |
  UserActions['reads:delete'] |
  UserActions['reads:update']

const AdminPermission = AuthorPermission

const OwnerPermission = AdminPermission

export const Permissions: Record<TRole, bigint> = {
  [Role.Owner]: OwnerPermission,
  [Role.Admin]: AdminPermission,
  [Role.Author]: AuthorPermission,
  [Role.User]: UserPermission,
}
