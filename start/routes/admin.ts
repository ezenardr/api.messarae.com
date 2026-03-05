const AdminController = () => import('#controllers/admin_controller')
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.get('/', [AdminController, 'getAdminData'])
    router.put('/setFeaturedRead', [AdminController, 'setFeaturedRead'])
  })
  .prefix('/admin')
  .use(middleware.auth())
