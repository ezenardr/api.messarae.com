import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import { v4 as uuid } from 'uuid'
import User from './user.js'
import * as relations from '@adonisjs/lucid/types/relations'
import Read from './read.js'

export default class Favorite extends BaseModel {
  @column({ isPrimary: true })
  declare favoriteId: string

  @column()
  declare readId: string

  @column()
  declare userId: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static assignUUID(favorite: Favorite) {
    favorite.favoriteId = uuid()
  }

  @belongsTo(() => User, { foreignKey: 'userId' })
  declare user: relations.BelongsTo<typeof User>

  @belongsTo(() => Read, { foreignKey: 'readId' })
  declare read: relations.BelongsTo<typeof Read>
}
