import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'
import { v4 as uuid } from 'uuid'

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
}
