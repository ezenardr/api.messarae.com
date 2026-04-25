import type { HttpContext } from '@adonisjs/core/http'
import rollbar from '#services/rollbar'
import { AddCommentWatchValidator, createWatchValidator } from '#validators/watch'
import Watch from '#models/watch'
import AppwriteStorageService from '#services/storage_service'
import UserPolicies from '#policies/user_policies'
import WatchComment from '#models/watch_comment'

export default class WatchesController {
  async createWatch(ctx: HttpContext) {
    try {
      const user = await ctx.auth.authenticate()
      if (await ctx.bouncer.with(UserPolicies).denies('createReads')) {
        return ctx.response.safeStatus(403).json({
          success: false,
          message: "Vous n'êtes pas autorisé à créer d'article",
        })
      }
      const { headers, image, ...payload } = await ctx.request.validateUsing(createWatchValidator)
      const fs = await import('node:fs/promises')
      const fileBuffer = await fs.readFile(image?.tmpPath!)
      const uploaded = await AppwriteStorageService.upload(fileBuffer, payload.title)
      const watch = await Watch.create({
        ...payload,
        category: 'Le Spotlight',
        imageFileId: uploaded.$id,
        imageUrl: AppwriteStorageService.getPreviewUrl(uploaded.$id),
        userId: user.userId,
      })
      return ctx.response.safeStatus(200).json({
        success: true,
        watch,
      })
    } catch (error) {
      console.error(error)
      rollbar.error(error, {
        request: {
          url: ctx.request.completeUrl(true),
          method: ctx.request.method(),
          body: ctx.request.body(),
        },
      })
      return ctx.response.safeStatus(error.status || 500).json({
        success: false,
        message: 'Une erreure est survenue: ' + error.message,
      })
    }
  }

  async getAuthorWatches(ctx: HttpContext) {
    try {
      const user = await ctx.auth.authenticate()
      if (await ctx.bouncer.with(UserPolicies).denies('createReads')) {
        return ctx.response.safeStatus(403).json({
          success: false,
          message: "Vous n'êtes pas autorisé à créer d'article",
        })
      }
      const watches = await Watch.query().where('userId', user.userId).preload('user')
      return ctx.response.safeStatus(200).json({
        success: true,
        watches,
      })
    } catch (error) {
      console.error(error)
      rollbar.error(error, {
        request: {
          url: ctx.request.completeUrl(true),
          method: ctx.request.method(),
          body: ctx.request.body(),
        },
      })
      return ctx.response.safeStatus(error.status || 500).json({
        success: false,
        message: 'Une erreure est survenue: ' + error.message,
      })
    }
  }

  async getWatchById(ctx: HttpContext) {
    try {
      const { watchId } = ctx.request.params()
      const user = await ctx.auth.authenticate()
      const watch = await Watch.findBy('watchId', watchId)
      if (!watch) {
        return ctx.response.safeStatus(404).json({
          success: false,
          message: 'Video introuvable',
        })
      }
      if (user.userId !== watch.userId) {
        return ctx.response.safeStatus(403).json({
          success: false,
          message: "Vous n'êtes pas autorisé à voir cette vidéo",
        })
      }
      const author = {
        fullName: `${user.firstName} ${user.lastName}`,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
      }
      return ctx.response.safeStatus(200).json({
        success: true,
        watch,
        author,
      })
    } catch (error) {
      console.error(error)
      rollbar.error(error, {
        request: {
          url: ctx.request.completeUrl(true),
          method: ctx.request.method(),
          body: ctx.request.body(),
        },
      })
      return ctx.response.safeStatus(error.status || 500).json({
        success: false,
        message: 'Une erreure est survenue: ' + error.message,
      })
    }
  }

  async getWatches(ctx: HttpContext) {
    try {
      const { limit = 15 } = ctx.request.qs()
      const watches = await Watch.query()
        .preload('user')
        .preload('watchFavorites')
        .orderBy('created_at', 'desc')
        .limit(limit)
      return ctx.response.safeStatus(200).json({
        success: true,
        watches,
      })
    } catch (error) {
      console.error(error)
      rollbar.error(error, {
        request: {
          url: ctx.request.completeUrl(true),
          method: ctx.request.method(),
          body: ctx.request.body(),
        },
      })
      return ctx.response.safeStatus(error.status || 500).json({
        success: false,
        message: 'Une erreure est survenue: ' + error.message,
      })
    }
  }

  async getWatcheByIdWithRelated(ctx: HttpContext) {
    try {
      const { watchId } = ctx.request.params()
      const watch = await Watch.query()
        .where('watchId', watchId)
        .preload('user')
        .preload('watchComments', (comment) => comment.preload('user'))
        .preload('watchFavorites')
        .first()
      if (!watch) {
        return ctx.response.safeStatus(404).json({
          success: false,
          message: 'Article introuvable',
        })
      }
      const related = await Watch.query()
        .where('category', watch.category)
        .whereNot('watchId', watch.watchId)
        .preload('user')
        .preload('watchFavorites')
        .limit(6)

      return ctx.response.safeStatus(200).json({
        success: true,
        watch,
        related,
      })
    } catch (error) {
      console.error(error)
      rollbar.error(error, {
        request: {
          url: ctx.request.completeUrl(true),
          method: ctx.request.method(),
          body: ctx.request.body(),
        },
      })
      return ctx.response.safeStatus(error.status || 500).json({
        success: false,
        message: 'Une erreure est survenue: ' + error.message,
      })
    }
  }

  async addWatchComment(ctx: HttpContext) {
    try {
      const user = await ctx.auth.authenticate()
      const { headers, ...payload } = await ctx.request.validateUsing(AddCommentWatchValidator)
      const watch = await Watch.findBy('watchId', payload.watchId)
      if (!watch) {
        return ctx.response.safeStatus(404).json({
          success: false,
          message: 'Video introuvable',
        })
      }
      await WatchComment.create({
        comment: payload.comment,
        watchId: watch.watchId,
        userId: user.userId,
      })
      return ctx.response.safeStatus(200).json({
        success: true,
      })
    } catch (error) {
      console.error(error)
      rollbar.error(error, {
        request: {
          url: ctx.request.completeUrl(true),
          method: ctx.request.method(),
          body: ctx.request.body(),
        },
      })
      return ctx.response.safeStatus(error.status || 500).json({
        success: false,
        message: 'Une erreure est survenue: ' + error.message,
      })
    }
  }
}
