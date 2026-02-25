import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'read_comments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('read_comment_id').primary()
      table.uuid('read_id').references('read_id').inTable('reads').onDelete('CASCADE')
      table.uuid('user_id').references('user_id').inTable('users').onDelete('CASCADE')
      table.text('comment').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
