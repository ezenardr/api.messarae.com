const WatchesController = () => import('#controllers/watches_controller')
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

router.get('/watches/:limit?', [WatchesController, 'getWatches'])
router.get('/watches/:watchId/related', [WatchesController, 'getWatcheByIdWithRelated'])

router
  .group(() => {
    router.get('/watches', [WatchesController, 'getAuthorWatches'])
    router.get('/watches/:watchId', [WatchesController, 'getWatchById'])
    router.post('/watch', [WatchesController, 'createWatch'])
  })
  .prefix('/author')
  .use(middleware.auth())

router
  .group(() => {
    router.post('/watch', [WatchesController, 'addWatchComment'])
  })
  .prefix('/comments')
  .use(middleware.auth())
