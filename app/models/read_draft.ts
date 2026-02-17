import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'
import { v4 as uuid } from 'uuid'

export default class ReadDraft extends BaseModel {
  @column({ isPrimary: true })
  declare readDraftId: string

  @column()
  declare userId: string

  @column()
  declare title: string | null | undefined

  @column()
  declare description: string | null | undefined

  @column()
  declare imageUrl: string | null | undefined

  @column()
  declare imageFileId: string | null | undefined

  @column()
  declare category: string | null | undefined

  @column()
  declare content: string | null | undefined

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static assignUUID(readDraft: ReadDraft) {
    readDraft.readDraftId = uuid()
  }
}
