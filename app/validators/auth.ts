import vine from '@vinejs/vine'

export const registerUserValidator = vine.compile(
  vine.object({
    firstName: vine.string().minLength(1).maxLength(100),
    lastName: vine.string().minLength(1).maxLength(100),
    email: vine.string().email(),
    password: vine
      .string()
      .minLength(8)
      .regex(/[A-Z]/)
      .regex(/[a-z]/)
      .regex(/[0-9]/)
      .regex(/[^A-Za-z0-9]/),

    headers: vine.object({
      'origin': vine.string(),
      'accept-language': vine.string(),
    }),
  })
)

export const loginUserValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string(),
    headers: vine.object({
      'origin': vine.string(),
      'accept-language': vine.string(),
    }),
  })
)

export const forgotPasswordValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    headers: vine.object({
      'origin': vine.string(),
      'accept-language': vine.string(),
    }),
  })
)

export const newPasswordValidator = vine.compile(
  vine.object({
    password: vine
      .string()
      .minLength(8)
      .regex(/[A-Z]/)
      .regex(/[a-z]/)
      .regex(/[0-9]/)
      .regex(/[^A-Za-z0-9]/)
      .confirmed(),
    headers: vine.object({
      'origin': vine.string(),
      'accept-language': vine.string(),
    }),
  })
)

export const changePasswordValidator = vine.compile(
  vine.object({
    password: vine.string(),
    newPassword: vine
      .string()
      .minLength(8)
      .regex(/[A-Z]/)
      .regex(/[a-z]/)
      .regex(/[0-9]/)
      .regex(/[^A-Za-z0-9]/),
    headers: vine.object({
      'origin': vine.string(),
      'accept-language': vine.string(),
    }),
  })
)
