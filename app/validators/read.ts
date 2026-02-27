import vine from '@vinejs/vine'

export const SaveReadDraftValidator = vine.compile(
  vine.object({
    title: vine.string().nullable().optional(),
    description: vine.string().nullable().optional(),
    content: vine.string().nullable().optional(),
    category: vine.string().nullable().optional(),
    image: vine.file({ size: '1024kb' }).optional().nullable(),
    headers: vine.object({
      'origin': vine.string(),
      'accept-language': vine.string(),
    }),
  })
)

export const PublishReadValidator = vine.compile(
  vine.object({
    featured: vine.boolean(),
    readDraftId: vine.string().uuid({ version: [4] }),
    headers: vine.object({
      'origin': vine.string(),
      'accept-language': vine.string(),
    }),
  })
)

export const AddCommentReadValidator = vine.compile(
  vine.object({
    comment: vine.string().minLength(3).maxLength(500),
    readId: vine.string().uuid({ version: [4] }),
    headers: vine.object({
      'origin': vine.string(),
      'accept-language': vine.string(),
    }),
  })
)

export const AddToFavorite = vine.compile(
  vine.object({
    readId: vine.string().uuid({ version: [4] }),
    headers: vine.object({
      'origin': vine.string(),
      'accept-language': vine.string(),
    }),
  })
)
