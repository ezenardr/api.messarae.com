const ReadsController = () => import('#controllers/reads_controller')
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.get('/author', [ReadsController, 'getAuthorReads'])
    router.get('/drafts/:readDraftId', [ReadsController, 'getDraftRead'])
    router.post('/drafts', [ReadsController, 'createDraftRead'])
    router.put('/drafts/:readDraftId', [ReadsController, 'saveDraftRead'])
  })
  .prefix('/reads')
  .use(middleware.auth())
