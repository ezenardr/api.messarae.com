import User from '#models/user'
import {
  updateUserNameValidator,
  updateUserNotificationPreferenceValidator,
  uploadProfileImageValidator,
} from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import AppwriteStorageService from '#services/storage_service'

export default class UsersController {
  async getUser(ctx: HttpContext) {
    try {
      const user = await ctx.auth.authenticate()
      return ctx.response.safeStatus(200).json({
        success: true,
        user,
      })
    } catch (error) {
      console.error(error)
      return ctx.response.safeStatus(error.status || 500).json({
        success: false,
        message: 'Failed to get user: ' + error.message,
      })
    }
  }

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
        message: 'Failed to get user role: ' + error.message,
      })
    }
  }

  async updateUserName(ctx: HttpContext) {
    try {
      const payload = await ctx.request.validateUsing(updateUserNameValidator)
      const user = await ctx.auth.authenticate()
      user.firstName = payload.firstName
      user.lastName = payload.lastName
      await user.save()

      return ctx.response.safeStatus(200).json({
        success: true,
      })
    } catch (error) {
      console.error(error)
      return ctx.response.safeStatus(error.status || 50).json({
        success: false,
        message: 'Une erreur est survenue: ' + error.message,
        error,
      })
    }
  }

  async uploadProfileImage(ctx: HttpContext) {
    try {
      const { headers, ...payload } = await ctx.request.validateUsing(uploadProfileImageValidator)
      const user = await ctx.auth.authenticate()
      if (user.imageFileId) await AppwriteStorageService.deleteFile(user.imageFileId)
      const fs = await import('node:fs/promises')
      const fileBuffer = await fs.readFile(payload.image?.tmpPath!)
      const uploaded = await AppwriteStorageService.upload(fileBuffer, user.userId)
      user.profileImageUrl = AppwriteStorageService.getPreviewUrl(uploaded.$id)
      user.imageFileId = uploaded.$id
      await user.save()
      return ctx.response.safeStatus(200).json({
        success: true,
        profileImageUrl: AppwriteStorageService.getPreviewUrl(uploaded.$id),
        imageFileId: uploaded.$id,
      })
    } catch (error) {
      console.error(error)
      return ctx.response.safeStatus(error.status || 50).json({
        success: false,
        message: 'Une erreur est survenue: ' + error.message,
        error,
      })
    }
  }

  async updateUserNotificationPreferences(ctx: HttpContext) {
    try {
      const payload = await ctx.request.validateUsing(updateUserNotificationPreferenceValidator)
      const user = await ctx.auth.authenticate()
      user.newRead = payload.newRead
      user.newWatch = payload.newWatch
      user.newsletter = payload.newsletter
      user.accountActivity = payload.accountActivity
      await user.save()

      return ctx.response.safeStatus(200).json({
        success: true,
      })
    } catch (error) {
      console.error(error)
      return ctx.response.safeStatus(error.status || 50).json({
        success: false,
        message: 'Une erreur est survenue: ' + error.message,
        error,
      })
    }
  }
}
