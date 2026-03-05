import Read from '#models/read'
import UserPolicies from '#policies/user_policies'
import { SetFeaturedReadValidator } from '#validators/read'
import type { HttpContext } from '@adonisjs/core/http'

export default class AdminController {
  async getAdminData(ctx: HttpContext) {
    try {
      if (await ctx.bouncer.with(UserPolicies).denies('adminRights')) {
        return ctx.response.safeStatus(403).json({
          success: false,
          message: "Vous n'êtes pas un admin",
        })
      }
      const reads = await Read.query().preload('user')
      return ctx.response.safeStatus(200).json({
        success: true,
        reads,
      })
    } catch (error) {
      console.error(error)
      return ctx.response.safeStatus(error.status || 500).json({
        success: false,
        message: 'Failed to get user: ' + error.message,
      })
    }
  }

  async setFeaturedRead(ctx: HttpContext) {
    try {
      if (await ctx.bouncer.with(UserPolicies).denies('adminRights')) {
        return ctx.response.safeStatus(403).json({
          success: false,
          message: "Vous n'êtes pas un administrateur",
        })
      }
      const { featured, readId } = await ctx.request.validateUsing(SetFeaturedReadValidator)
      const featuredReads = await Read.query().where('featured', true)
      if (featured === false && featuredReads.length === 2) {
        return ctx.response.safeStatus(500).json({
          success: false,
          message: 'Il faut un minimum de 2 articles en vedette',
        })
      }
      if (featured === true && featuredReads.length === 3) {
        return ctx.response.safeStatus(500).json({
          success: false,
          message: "Vous avez attein le maximum d'article en vedette",
        })
      }
      const read = await Read.findBy('readId', readId)
      if (!read) {
        return ctx.response.safeStatus(404).json({
          success: false,
          message: 'Article Introuvable',
        })
      }
      read.featured = featured
      await read.save()
      return ctx.response.safeStatus(200).json({
        success: true,
      })
    } catch (error) {
      console.error(error)
      return ctx.response.safeStatus(error.status || 500).json({
        success: false,
        message: 'Failed to get user: ' + error.message,
      })
    }
  }
}
