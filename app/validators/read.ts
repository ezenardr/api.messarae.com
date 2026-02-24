import vine from '@vinejs/vine'

export const SaveReadDraftValidator = vine.compile(
  vine.object({
    title: vine.string().nullable().optional(),
    description: vine.string().nullable().optional(),
    content: vine.string().nullable().optional(),
    category: vine.string().nullable().optional(),
    image: vine.file({ size: '500kb' }).optional().nullable(),
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
