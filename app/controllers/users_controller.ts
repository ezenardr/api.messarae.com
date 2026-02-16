import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  async getUserRole(ctx: HttpContext) {
    try {
      const { userId } = ctx.params
      const user = await User.findBy('userId', userId)
      if (!user) {
        return ctx.response.safeStatus(404).json({
          success: false,
          message: 'Utilisateur introuvable',
        })
      }
      return ctx.response.safeStatus(200).json({
        success: true,
        role: user.role,
      })
    } catch (error) {
      console.error(error)
      return ctx.response.safeStatus(error.status || 500).json({
        success: false,
        message: 'Failed to create user: ' + error.message,
      })
    }
  }
}
