import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import { v4 as uuid } from 'uuid'
import User from './user.js'
import * as relations from '@adonisjs/lucid/types/relations'
import WatchComment from './watch_comment.js'
import WatchFavorite from './watch_favorite.js'

export default class Watch extends BaseModel {
  @column({ isPrimary: true })
  declare watchId: string

  @column()
  declare userId: string

  @column()
  declare title: string

  @column()
  declare description: string

  @column()
  declare imageUrl: string

  @column()
  declare imageFileId: string

  @column()
  declare category: string

  @column()
  declare videoUrl: string

  @column()
  declare featured: boolean

  @column()
  declare archived: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static assignUUID(watch: Watch) {
    watch.watchId = uuid()
  }

  @belongsTo(() => User, { foreignKey: 'userId' })
  declare user: relations.BelongsTo<typeof User>

  @hasMany(() => WatchComment, { foreignKey: 'watchId' })
  declare watchComments: relations.HasMany<typeof WatchComment>

  @hasMany(() => WatchFavorite, { foreignKey: 'watchId' })
  declare watchFavorites: relations.HasMany<typeof WatchFavorite>
}
