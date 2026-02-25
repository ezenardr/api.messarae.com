import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import { v4 as uuid } from 'uuid'
import User from './user.js'
import * as relations from '@adonisjs/lucid/types/relations'
import ReadComment from './read_comment.js'

export default class Read extends BaseModel {
  @column({ isPrimary: true })
  declare readId: string

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
  declare content: string

  @column()
  declare featured: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static assignUUID(read: Read) {
    read.readId = uuid()
  }

  @belongsTo(() => User, { foreignKey: 'userId' })
  declare user: relations.BelongsTo<typeof User>

  @hasMany(() => ReadComment, { foreignKey: 'readId' })
  declare readComments: relations.HasMany<typeof ReadComment>
}
