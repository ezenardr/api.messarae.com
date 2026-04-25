import vine from '@vinejs/vine'

export const createWatchValidator = vine.compile(
  vine.object({
    title: vine.string(),
    description: vine.string(),
    videoUrl: vine.string(),
    image: vine.file(),
    headers: vine.object({
      'origin': vine.string(),
      'accept-language': vine.string(),
    }),
  })
)

export const AddCommentWatchValidator = vine.compile(
  vine.object({
    comment: vine.string().minLength(3).maxLength(500),
    watchId: vine.string().uuid({ version: [4] }),
    headers: vine.object({
      'origin': vine.string(),
      'accept-language': vine.string(),
    }),
  })
)
