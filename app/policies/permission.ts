import { Permissions, TRole, UserAction } from '../roles/roles.js'

export function can(role: TRole, action: UserAction): boolean {
  return (Permissions[role] & action) === action
}

// export async function getUserRole(user: User) {
//   const role = await organisation
//     .related('users')
//     .query()
//     .where('organisations_users.user_id', user.userId)
//     .firstOrFail()
//   return role.$extras.pivot_role
// }
