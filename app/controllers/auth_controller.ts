import User from '#models/user'
import env from '#start/env'
import { loginUserValidator, registerUserValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'
import { Resend } from 'resend'
import jwt, { JwtPayload } from 'jsonwebtoken'

const resend = new Resend(env.get('RESEND_API_KEY'))

export default class AuthController {
  async register(ctx: HttpContext) {
    try {
      const { headers, ...payload } = await ctx.request.validateUsing(registerUserValidator)
      const user_existed = await User.findBy('email', payload.email)
      if (user_existed) {
        return ctx.response.safeStatus(400).json({
          status: 'error',
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
      const user_existed = await User.findBy('email', data.email)
      if (user_existed) {
        return ctx.response.safeStatus(400).json({
          status: 'failed',
          message:
            'Cette adresse email est déjà associée à un compte existant. Veuillez vous connecter.',
        })
      }
      await User.create({ ...data, role: 'user' })
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
}
