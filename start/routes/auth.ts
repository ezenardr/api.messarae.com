const AuthController = () => import('#controllers/auth_controller')
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.post('/login', [AuthController, 'login'])
    router.post('/register', [AuthController, 'register'])
    router.get('/complete-registration/:token', [AuthController, 'confirmRegistration'])
    router.post('/forgot-password', [AuthController, 'forgotPassword'])
    router.post('/change-password', [AuthController, 'changePassword']).use(middleware.auth())
    router.post('/new-password', [AuthController, 'newPassword']).use(middleware.auth())
  })
  .prefix('/auth')
