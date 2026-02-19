import User from '#models/user'
import env from '#start/env'
import {
  changePasswordValidator,
  forgotPasswordValidator,
  loginUserValidator,
  newPasswordValidator,
  registerUserValidator,
} from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'
import { Resend } from 'resend'
import jwt, { JwtPayload } from 'jsonwebtoken'
import hash from '@adonisjs/core/services/hash'
import { DateTime } from 'luxon'

const resend = new Resend(env.get('RESEND_API_KEY'))

export default class AuthController {
  async register(ctx: HttpContext) {
    try {
      const { headers, ...payload } = await ctx.request.validateUsing(registerUserValidator)
      const userExisted = await User.findBy('email', payload.email)
      if (userExisted) {
        return ctx.response.safeStatus(400).json({
          success: false,
          message:
            'Cette adresse email est déjà associée à un compte existant. Veuillez vous connecter.',
        })
      }
      const registrationToken = jwt.sign(
        {
          email: payload.email,
          firstName: payload.firstName,
          lastName: payload.lastName,
          password: payload.password,
        },
        env.get('JWT_SECRET'),
        { expiresIn: '2h' }
      )
      const verificationLink = `${headers.origin}/auth/register/verified?entity=Inscription&currentStep=2&totalStep=2&accessToken=${registrationToken}`
      await resend.emails.send({
        from: 'Onboarding - De vous à moi <auth@messarae.com>',
        to: payload.email,
        template: {
          id: 'email-confirmation',
          variables: {
            FIRSTNAME: payload.firstName,
            LINK: verificationLink,
          },
        },
      })
      return ctx.response.safeStatus(201).json({
        success: true,
        registrationToken,
      })
    } catch (error) {
      console.error(error)
      return ctx.response.safeStatus(error.safeStatus || 500).json({
        success: false,
        message: 'Une erreur est survenue : ' + error.message,
      })
    }
  }

  async confirmRegistration(ctx: HttpContext) {
    try {
      const { token } = ctx.params
      const decoded = jwt.verify(token, env.get('JWT_SECRET'))
      const { type, iat, exp, ...data } = decoded as JwtPayload
      const userExisted = await User.findBy('email', data.email)
      if (userExisted) {
        return ctx.response.safeStatus(400).json({
          status: 'failed',
          message:
            'Cette adresse email est déjà associée à un compte existant. Veuillez vous connecter.',
        })
      }
      await User.create({ ...data, role: 1 })
      return ctx.response.safeStatus(201).json({
        success: true,
        user: {
          email: data.email,
          password: data.password,
        },
      })
    } catch (error) {
      console.error(error)
      return ctx.response.safeStatus(error.safeStatus || 500).json({
        success: false,
        message: 'Une erreur est survenue : ' + error.message,
      })
    }
  }

  async login(ctx: HttpContext) {
    try {
      const { headers, ...payload } = await ctx.request.validateUsing(loginUserValidator)
      const attemptedUser = await User.findBy('email', payload.email)
      if (!attemptedUser) {
        return ctx.response.safeStatus(404).json({
          success: false,
          message: 'Email ou mot de passe incorrect',
        })
      }
      const user = await User.verifyCredentials(payload.email, payload.password)
      const token = await ctx.auth.use('api').createToken(user, ['*'], { expiresIn: '7 days' })
      return ctx.response.safeStatus(200).json({
        success: true,
        user: {
          accessToken: token.value!.release(),
          ...user.serialize(),
        },
      })
    } catch (error) {
      console.error(error)
      return ctx.response.safeStatus(error.safeStatus || 500).json({
        success: false,
        message: 'Une erreur est survenue : ' + error.message,
      })
    }
  }

  async forgotPassword(ctx: HttpContext) {
    try {
      const { headers, ...payload } = await ctx.request.validateUsing(forgotPasswordValidator)
      const user = await User.findByOrFail('email', payload.email)
      const now = DateTime.now()
      const lastResendAt = user.lastResendAt
        ? user.lastResendAt
        : DateTime.now().minus({ minutes: 999 })
      const waitMinutes = Math.min((user.resendCount + 1) * 2, 60)
      const nextAllowed = lastResendAt.plus({ minutes: waitMinutes })
      if (nextAllowed > now) {
        const remaining = nextAllowed.diff(now, 'minutes').toObject().minutes
        return ctx.response.safeStatus(200).json({
          success: 'warning',
          message: `Veuillez patienter ${Math.ceil(remaining!)} minute(s) avant de soumettre une nouvelle requête.`,
        })
      }
      const token = await User.accessTokens.create(user, ['*'], { expiresIn: '10m' })
      const verificationLink = `${headers.origin}/auth/new-password?accessToken=${token.value!.release()}&entity=Mot de passe oublié&currentStep=3&totalStep=3`
      await resend.emails.send({
        from: 'De vous à moi <auth@messarae.com>',
        to: user.email,
        template: {
          id: 'forgot-password',
          variables: {
            FIRSTNAME: user.firstName,
            LINK: verificationLink,
          },
        },
      })
      user.resendCount += 1
      user.lastResendAt = now
      await user.save()
      return ctx.response.ok({
        success: true,
      })
    } catch (error) {
      return ctx.response.safeStatus(400).json({
        success: true,
        message: 'Une erreur est survenue' + error.message,
      })
    }
  }

  async newPassword(ctx: HttpContext) {
    try {
      const { headers, ...payload } = await ctx.request.validateUsing(newPasswordValidator)
      const user = await ctx.auth.authenticate()
      const samePasword = await hash.verify(user.password, payload.password)
      if (samePasword) {
        return ctx.response.safeStatus(403).json({
          success: false,
          message: 'Vous ne pouvez pas insérer votre mot de passe actuel',
        })
      }
      await User.updateOrCreate({ email: user.email }, { password: payload.password })
      await user.save()
      const tokens = await User.accessTokens.all(user)
      tokens.map(async (token) => {
        await User.accessTokens.delete(user, token.identifier)
      })
      const token = await User.accessTokens.create(user, ['*'], { expiresIn: '10m' })
      const verificationLink = `${headers.origin}/auth/new-password?accessToken=${token}&entity=Mot de passe oublié&currentStep=3&totalStep=3`
      await resend.emails.send({
        from: 'De vous à moi <account@messarae.com>',
        to: user.email,
        template: {
          id: 'password-changed',
          variables: {
            FIRSTNAME: user.firstName,
            LINK: verificationLink,
          },
        },
      })
      user.resendCount = 0
      await user.save()
      return ctx.response.safeStatus(200).json({
        success: true,
      })
    } catch (error) {
      console.error(error)
      return ctx.response.safeStatus(400).json({
        success: false,
        message: 'Something went wrong : ' + error.message,
      })
    }
  }

  async changePassword(ctx: HttpContext) {
    try {
      const { headers, ...payload } = await ctx.request.validateUsing(changePasswordValidator)
      const user = await ctx.auth.authenticate()
      const verified = await hash.verify(user.password, payload.password)
      if (!verified) {
        return ctx.response.safeStatus(403).json({
          success: false,
          message: 'Les mots de passe ne correspondent pas.',
        })
      }
      const samePasword = await hash.verify(user.password, payload.newPassword)
      if (samePasword) {
        return ctx.response.safeStatus(403).json({
          success: false,
          message: 'Vous ne pouvez pas insérer le même mot de passe.',
        })
      }
      const tokens = await User.accessTokens.all(user)
      tokens.map(async (token) => {
        await User.accessTokens.delete(user, token.identifier)
      })
      await User.updateOrCreate({ email: user.email }, { password: payload.newPassword })
      await user.save()
      const token = await User.accessTokens.create(user, ['*'], { expiresIn: '10m' })
      const verificationLink = `${headers.origin}/auth/new-password?accessToken=${token.value!.release()}&entity=Mot de passe oublié&currentStep=3&totalStep=3`
      await resend.emails.send({
        from: 'De vous à moi <account@messarae.com>',
        to: user.email,
        template: {
          id: 'password-changed',
          variables: {
            FIRSTNAME: user.firstName,
            LINK: verificationLink,
          },
        },
      })
      return ctx.response.safeStatus(200).json({
        success: true,
      })
    } catch (error) {
      console.error(error)
      return ctx.response.safeStatus(error.status || 500).json({
        success: false,
        message: "Nous n'avons pas pu changer votre mot de passe" + error.message,
      })
    }
  }
}
