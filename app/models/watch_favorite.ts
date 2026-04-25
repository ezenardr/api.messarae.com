import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import { v4 as uuid } from 'uuid'
import User from './user.js'
import * as relations from '@adonisjs/lucid/types/relations'
import Watch from './watch.js'

export default class WatchFavorite extends BaseModel {
  @column({ isPrimary: true })
  declare watchFavoriteId: string

  @column()
  declare watchId: string

  @column()
  declare userId: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static assignUUID(watchFavorite: WatchFavorite) {
    watchFavorite.watchFavoriteId = uuid()
  }

  @belongsTo(() => User, { foreignKey: 'userId' })
  declare user: relations.BelongsTo<typeof User>

  @belongsTo(() => Watch, { foreignKey: 'watchId' })
  declare watches: relations.BelongsTo<typeof Watch>
}
