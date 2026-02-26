import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'favorites'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('favorite_id').primary()
      table.uuid('user_id').references('user_id').inTable('users').onDelete('CASCADE')
      table.uuid('read_id').references('read_id').inTable('reads').onDelete('CASCADE')
      table.unique(['user_id', 'read_id'])

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
