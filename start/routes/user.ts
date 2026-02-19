const UsersController = () => import('#controllers/users_controller')
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.get('/me', [UsersController, 'getUser'])
    router.patch('/me', [UsersController, 'updateUserName'])
    router.patch('/me/profile', [UsersController, 'uploadProfileImage'])
    router.patch('/notifications', [UsersController, 'updateUserNotificationPreferences'])
  })
  .prefix('/users')
  .use(middleware.auth())
