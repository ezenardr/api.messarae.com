import ReadDraft from '#models/read_draft'
import UserPolicies from '#policies/user_policies'
import { SaveReadDraftValidator } from '#validators/read'
import type { HttpContext } from '@adonisjs/core/http'
import AppwriteStorageService from '#services/storage_service'

export default class ReadsController {
  async createDraftRead(ctx: HttpContext) {
    try {
      const user = await ctx.auth.authenticate()
      if (await ctx.bouncer.with(UserPolicies).denies('createReads')) {
        return ctx.response.safeStatus(403).json({
          success: false,
          message: "Vous n'êtes pas autorisé à créer d'article",
        })
      }
      const read = await ReadDraft.create({ userId: user.userId })
      return ctx.response.safeStatus(200).json({
        success: true,
        read,
      })
    } catch (error) {
      console.error(error)
      return ctx.response.safeStatus(error.status || 500).json({
        success: false,
        message: 'Une erreure est survenue: ' + error.message,
      })
    }
  }

  async getDraftRead(ctx: HttpContext) {
    try {
      const { readDraftId } = ctx.request.params()
      const user = await ctx.auth.authenticate()
      const read = await ReadDraft.findBy('readDraftId', readDraftId)
      if (!read) {
        return ctx.response.safeStatus(404).json({
          success: false,
          message: 'Article introuvable',
        })
      }
      if (user.userId !== read.userId) {
        return ctx.response.safeStatus(403).json({
          success: false,
          message: "Vous n'êtes pas autorisé à voir cet article",
        })
      }
      return ctx.response.safeStatus(200).json({
        success: true,
        read,
      })
    } catch (error) {
      console.error(error)
      return ctx.response.safeStatus(error.status || 500).json({
        success: false,
        message: 'Une erreure est survenue: ' + error.message,
      })
    }
  }

  async saveDraftRead(ctx: HttpContext) {
    try {
      const { readDraftId } = ctx.request.params()
      // console.log(ctx.request.files('image'))/
      const user = await ctx.auth.authenticate()
      if (await ctx.bouncer.with(UserPolicies).denies('createReads')) {
        return ctx.response.safeStatus(403).json({
          success: false,
          message: "Vous n'êtes pas autorisé à créer d'article",
        })
      }
      const read = await ReadDraft.findBy('readDraftId', readDraftId)
      if (!read) {
        return ctx.response.safeStatus(404).json({
          success: false,
          message: 'Article introuvable',
        })
      }
      if (user.userId !== read.userId) {
        return ctx.response.safeStatus(403).json({
          success: false,
          message: "Vous n'êtes pas autorisé à modifier cet article",
        })
      }
      const { headers, ...payload } = await ctx.request.validateUsing(SaveReadDraftValidator)
      if (payload.image) {
        if (read.imageFileId) {
          await AppwriteStorageService.deleteFile(read.imageFileId)
        }
        const fs = await import('node:fs/promises')
        const fileBuffer = await fs.readFile(payload.image?.tmpPath!)
        const uploaded = await AppwriteStorageService.upload(fileBuffer, read.readDraftId)
        read.title = payload.title
        read.description = payload.description
        read.content = payload.content
        read.category = payload.category
        read.imageUrl = AppwriteStorageService.getPreviewUrl(uploaded.$id)
        read.imageFileId = uploaded.$id
        await read.save()
      } else {
        read.title = payload.title
        read.description = payload.description
        read.content = payload.content
        read.category = payload.category
        await read.save()
      }

      return ctx.response.safeStatus(200).json({
        success: true,
        // read,
      })
    } catch (error) {
      console.error(error)
      return ctx.response.safeStatus(error.status || 500).json({
        success: false,
        message: 'Une erreure est survenue: ' + error.message,
      })
    }
  }

  async getAuthorReads(ctx: HttpContext) {
    try {
      const user = await ctx.auth.authenticate()
      if (await ctx.bouncer.with(UserPolicies).denies('createReads')) {
        return ctx.response.safeStatus(403).json({
          success: false,
          message: "Vous n'êtes pas autorisé à créer d'article",
        })
      }
      const drafts = await ReadDraft.query().where('userId', user.userId)
      return ctx.response.safeStatus(200).json({
        success: true,
        drafts,
      })
    } catch (error) {
      console.error(error)
      return ctx.response.safeStatus(error.status || 500).json({
        success: false,
        message: 'Une erreure est survenue: ' + error.message,
      })
    }
  }
}
