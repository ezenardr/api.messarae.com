import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import * as relations from '@adonisjs/lucid/types/relations'
import { v4 as uuid } from 'uuid'
import User from './user.js'
import Watch from './watch.js'

export default class WatchComment extends BaseModel {
  @column({ isPrimary: true })
  declare watchCommentId: string

  @column()
  declare watchId: string

  @column()
  declare userId: string

  @column()
  declare comment: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static assignUUID(watchComment: WatchComment) {
    watchComment.watchCommentId = uuid()
  }

  @belongsTo(() => User, { foreignKey: 'userId' })
  declare user: relations.BelongsTo<typeof User>

  @belongsTo(() => Watch, { foreignKey: 'watchId' })
  declare watches: relations.BelongsTo<typeof Watch>
}
