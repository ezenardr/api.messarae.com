import vine from '@vinejs/vine'

export const updateUserNameValidator = vine.compile(
  vine.object({
    firstName: vine.string().minLength(1).maxLength(100),
    lastName: vine.string().minLength(1).maxLength(100),

    headers: vine.object({
      'origin': vine.string(),
      'accept-language': vine.string(),
    }),
  })
)

export const updateUserNotificationPreferenceValidator = vine.compile(
  vine.object({
    newRead: vine.boolean(),
    newWatch: vine.boolean(),
    newsletter: vine.boolean(),
    accountActivity: vine.boolean(),

    headers: vine.object({
      'origin': vine.string(),
      'accept-language': vine.string(),
    }),
  })
)

export const uploadProfileImageValidator = vine.compile(
  vine.object({
    image: vine.file({ size: '500kb' }).optional().nullable(),

    headers: vine.object({
      'origin': vine.string(),
      'accept-language': vine.string(),
    }),
  })
)
