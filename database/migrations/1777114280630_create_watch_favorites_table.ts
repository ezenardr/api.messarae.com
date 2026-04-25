import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'watch_favorites'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('watch_favorite_id').primary()
      table.uuid('user_id').references('user_id').inTable('users').onDelete('CASCADE')
      table.uuid('watch_id').references('watch_id').inTable('watches').onDelete('CASCADE')
      table.unique(['user_id', 'watch_id'])

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
