import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('user_id').primary()
      table.string('first_name').notNullable()
      table.string('last_name').notNullable()
      table.string('email', 254).notNullable().unique()
      table.string('password').notNullable()
      table.text('profile_image_url').nullable()
      table.text('image_file_id').nullable()
      table.enum('role', [1, 2, 3, 4]).defaultTo(1)
      table.boolean('new_read').notNullable().defaultTo(true)
      table.boolean('new_watch').notNullable().defaultTo(true)
      table.boolean('newsletter').notNullable().defaultTo(false)
      table.boolean('account_activity').notNullable().defaultTo(true)
      table.integer('resend_count').defaultTo(0)
      table.timestamp('last_resend_at').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
