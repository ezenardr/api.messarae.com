import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'reads'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('read_id').primary()
      table.uuid('user_id').references('user_id').inTable('users').onDelete('CASCADE')
      table.string('title').notNullable()
      table.string('description').notNullable()
      table.text('image_url').notNullable()
      table.text('image_file_id').notNullable()
      table.text('category').notNullable()
      table.text('content').notNullable()
      table.boolean('featured').defaultTo(false)
      table.boolean('archived').defaultTo(false)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
