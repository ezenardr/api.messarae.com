import ReadDraft from '#models/read_draft'
import UserPolicies from '#policies/user_policies'
import { PublishReadValidator, SaveReadDraftValidator } from '#validators/read'
import type { HttpContext } from '@adonisjs/core/http'
import AppwriteStorageService from '#services/storage_service'
import Read from '#models/read'
import deslugify from './utils/deslugify.js'

export default class ReadsController {
  async getReads(ctx: HttpContext) {
    try {
      const reads = await Read.query().preload('user').orderBy('created_at', 'desc')
      return ctx.response.safeStatus(200).json({
        success: true,
        reads,
      })
    } catch (error) {
      console.error(error)
      return ctx.response.safeStatus(error.status || 500).json({
        success: false,
        message: 'Une erreure est survenue: ' + error.message,
      })
    }
  }

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
      const author = {
        fullName: `${user.firstName} ${user.lastName}`,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
      }
      return ctx.response.safeStatus(200).json({
        success: true,
        read,
        author,
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
        draft: read,
      })
    } catch (error) {
      console.error(error)
      return ctx.response.safeStatus(error.status || 500).json({
        success: false,
        message: 'Une erreure est survenue: ' + error.message,
      })
    }
  }

  async deleteDraftRead(ctx: HttpContext) {
    try {
      const { readDraftId } = ctx.request.params()
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
      if (read.imageFileId) {
        await AppwriteStorageService.deleteFile(read.imageFileId)
      }
      await read.delete()

      return ctx.response.safeStatus(200).json({
        success: true,
      })
    } catch (error) {
      console.error(error)
      return ctx.response.safeStatus(error.status || 500).json({
        success: false,
        message: 'Une erreure est survenue: ' + error.message,
      })
    }
  }

  async publishRead(ctx: HttpContext) {
    try {
      const user = await ctx.auth.authenticate()
      const { headers, ...payload } = await ctx.request.validateUsing(PublishReadValidator)
      if (await ctx.bouncer.with(UserPolicies).denies('createReads')) {
        return ctx.response.safeStatus(403).json({
          success: false,
          message: "Vous n'êtes pas autorisé à créer d'article",
        })
      }
      const read = await ReadDraft.findBy('readDraftId', payload.readDraftId)
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

      await Read.create({
        category: read.category!,
        content: read.content!,
        description: read.description!,
        imageFileId: read.imageFileId!,
        featured: payload.featured,
        imageUrl: read.imageUrl!,
        title: read.title!,
        userId: user.userId,
      })
      await read.delete()
      return ctx.response.safeStatus(200).json({
        success: true,
        draft: read,
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
      const reads = await Read.query().where('userId', user.userId)
      return ctx.response.safeStatus(200).json({
        success: true,
        drafts,
        reads,
      })
    } catch (error) {
      console.error(error)
      return ctx.response.safeStatus(error.status || 500).json({
        success: false,
        message: 'Une erreure est survenue: ' + error.message,
      })
    }
  }

  async getReadById(ctx: HttpContext) {
    try {
      const { readId } = ctx.request.params()
      const user = await ctx.auth.authenticate()
      const read = await Read.findBy('readId', readId)
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
      const author = {
        fullName: `${user.firstName} ${user.lastName}`,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
      }
      return ctx.response.safeStatus(200).json({
        success: true,
        read,
        author,
      })
    } catch (error) {
      console.error(error)
      return ctx.response.safeStatus(error.status || 500).json({
        success: false,
        message: 'Une erreure est survenue: ' + error.message,
      })
    }
  }

  async getReadBySlug(ctx: HttpContext) {
    try {
      const { slug } = ctx.request.params()
      const title = deslugify(slug)
      const read = await Read.query()
        .where('title', decodeURIComponent(title))
        .preload('user')
        .first()
      if (!read) {
        return ctx.response.safeStatus(404).json({
          success: false,
          message: 'Article introuvable',
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

  async getReadBySlugWithRelated(ctx: HttpContext) {
    try {
      const { slug } = ctx.request.params()
      const title = deslugify(slug)
      const read = await Read.query()
        .where('title', decodeURIComponent(title))
        .preload('user')
        .first()
      if (!read) {
        return ctx.response.safeStatus(404).json({
          success: false,
          message: 'Article introuvable',
        })
      }
      const related = await Read.query()
        .where('category', read.category)
        .whereNot('readId', read.readId)
        .preload('user')
        .limit(3)
      return ctx.response.safeStatus(200).json({
        success: true,
        read,
        related,
      })
    } catch (error) {
      console.error(error)
      return ctx.response.safeStatus(error.status || 500).json({
        success: false,
        message: 'Une erreure est survenue: ' + error.message,
      })
    }
  }

  async getCategories(ctx: HttpContext) {
    try {
      const reads = await Read.query()
        .select('category')
        .count('* as total')
        .groupBy('category')
        .orderBy('total', 'desc')

      const categories = reads.map((row) => ({
        category: row.category,
        total: Number(row.$extras.total),
      }))
      return ctx.response.safeStatus(200).json({
        success: true,
        categories,
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
