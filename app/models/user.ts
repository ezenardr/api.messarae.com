import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, beforeCreate, column, hasMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { v4 as uuid } from 'uuid'
import Read from './read.js'
import * as relations from '@adonisjs/lucid/types/relations'
import ReadDraft from './read_draft.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare userId: string

  @column()
  declare firstName: string

  @column()
  declare lastName: string

  @column()
  declare email: string

  @column()
  declare profileImageUrl: string | undefined

  @column()
  declare imageFileId: string | null | undefined

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare role: 1 | 2 | 3 | 4

  @column()
  declare newRead: boolean

  @column()
  declare newWatch: boolean

  @column()
  declare newsletter: boolean

  @column()
  declare accountActivity: boolean

  @column()
  declare resendCount: number

  @column.dateTime()
  declare lastResendAt: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  static accessTokens = DbAccessTokensProvider.forModel(User)

  @beforeCreate()
  static assignUUID(user: User) {
    user.userId = uuid()
  }

  @hasMany(() => Read, { foreignKey: 'userId' })
  declare read: relations.HasMany<typeof Read>

  @hasMany(() => ReadDraft, { foreignKey: 'userId' })
  declare draft: relations.HasMany<typeof ReadDraft>
}
