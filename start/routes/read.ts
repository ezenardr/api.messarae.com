const ReadsController = () => import('#controllers/reads_controller')
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

router.get('/categories', [ReadsController, 'getCategories'])
router.get('/reads/:limit?', [ReadsController, 'getReads'])
router.get('/reads/:slug', [ReadsController, 'getReadBySlug'])
router.get('/reads/:slug/related', [ReadsController, 'getReadBySlugWithRelated'])
router
  .group(() => {
    router.get('/author', [ReadsController, 'getAuthorReads'])
    router.get('/drafts/:readDraftId', [ReadsController, 'getDraftRead'])
    router.post('/drafts', [ReadsController, 'createDraftRead'])
    router.put('/drafts/:readDraftId', [ReadsController, 'saveDraftRead'])
    router.delete('/drafts/:readDraftId', [ReadsController, 'deleteDraftRead'])
    router.post('/create', [ReadsController, 'publishRead'])
    router.get('/:readId', [ReadsController, 'getReadById'])
  })
  .prefix('/reads')
  .use(middleware.auth())

router
  .group(() => {
    router.post('/read', [ReadsController, 'addReadComment'])
  })
  .prefix('/comments')
  .use(middleware.auth())
