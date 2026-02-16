import User from '#models/user'
import { BasePolicy } from '@adonisjs/bouncer'
import type { AuthorizerResponse } from '@adonisjs/bouncer/types'
import { can } from './permission.js'
import { UserActions } from '../roles/roles.js'

export default class UserPolicies extends BasePolicy {
  async createReads(user: User): Promise<AuthorizerResponse> {
    return can(user.role, UserActions['reads:create'])
  }
  // async addMember(user: User, organisation: Organisation): Promise<AuthorizerResponse> {
  //   const role = await getUserRole(user, organisation)
  //   return can(role, UserActions['team:add'])
  // }
  // async removeMember(user: User, organisation: Organisation): Promise<AuthorizerResponse> {
  //   const role = await getUserRole(user, organisation)
  //   return can(role, UserActions['team:delete'])
  // }
  // async updateMember(user: User, organisation: Organisation): Promise<AuthorizerResponse> {
  //   const role = await getUserRole(user, organisation)
  //   return can(role, UserActions['team:update'])
  // }
  // async updateOrganisationInformations(
  //   user: User,
  //   organisation: Organisation
  // ): Promise<AuthorizerResponse> {
  //   const role = await getUserRole(user, organisation)
  //   return can(role, UserActions['organisation:update'])
  // }
  // async updateEventInformations(
  //   user: User,
  //   organisation: Organisation
  // ): Promise<AuthorizerResponse> {
  //   const role = await getUserRole(user, organisation)
  //   return can(role, UserActions['event:update'])
  // }
  // async checking(user: User, organisation: Organisation): Promise<AuthorizerResponse> {
  //   const role = await getUserRole(user, organisation)
  //   return can(role, UserActions['event:check-in'])
  // }
  // async createEvent(user: User, organisation: Organisation): Promise<AuthorizerResponse> {
  //   const role = await getUserRole(user, organisation)
  //   return can(role, UserActions['event:create'])
  // }
  // async CreateWithdrawalRequest(
  //   user: User,
  //   organisation: Organisation
  // ): Promise<AuthorizerResponse> {
  //   const role = await getUserRole(user, organisation)
  //   return can(role, UserActions['finance:create'])
  // }
}
