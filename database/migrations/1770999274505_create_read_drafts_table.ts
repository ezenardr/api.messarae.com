import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'read_drafts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('read_draft_id').primary()
      table.uuid('user_id').references('user_id').inTable('users').onDelete('CASCADE')
      table.string('title').nullable()
      table.string('description').nullable()
      table.text('image_url').nullable()
      table.text('category').nullable()
      table.text('content').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
