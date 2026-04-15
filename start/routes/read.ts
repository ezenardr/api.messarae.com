const ReadsController = () => import('#controllers/reads_controller')
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

router.get('/categories', [ReadsController, 'getCategories'])
router.get('/categories/:category', [ReadsController, 'getArticleForCategory'])
router.get('/reads/:limit?', [ReadsController, 'getReads'])
router.get('/featured/reads', [ReadsController, 'getFeaturedReads'])
router.get('/reads/:slug', [ReadsController, 'getReadBySlug'])
router.get('/reads/:readId/related', [ReadsController, 'getReadByIdWithRelated'])
router
  .group(() => {
    router.get('/drafts/:readDraftId', [ReadsController, 'getDraftRead'])
    router.post('/draft/inline-image', [ReadsController, 'uploadInlineImage'])
    router.post('/drafts', [ReadsController, 'createDraftRead'])
    router.put('/drafts/:readDraftId', [ReadsController, 'saveDraftRead'])
    router.delete('/drafts/:readDraftId', [ReadsController, 'deleteDraftRead'])
    router.post('/create', [ReadsController, 'publishRead'])
    router.get('/:readId', [ReadsController, 'getReadById'])
    router.put('/:readId', [ReadsController, 'saveRead'])
  })
  .prefix('/reads')
  .use(middleware.auth())

router
  .group(() => {
    router.get('/reads', [ReadsController, 'getAuthorReads'])
    router.get('/reads/:readId', [ReadsController, 'getReadById'])
    router.post('/reads/drafts', [ReadsController, 'createDraftRead'])
    router.get('/reads/drafts/:readDraftId', [ReadsController, 'getDraftRead'])
  })
  .prefix('/author')
  .use(middleware.auth())

router
  .group(() => {
    router.post('/read', [ReadsController, 'addReadComment'])
  })
  .prefix('/comments')
  .use(middleware.auth())

router
  .group(() => {
    router.get('/', [ReadsController, 'getUserFavorites'])
    router.post('/', [ReadsController, 'addToFavorite'])
    router.delete('/', [ReadsController, 'removeFromFavorite'])
  })
  .prefix('/favorites')
  .use(middleware.auth())
