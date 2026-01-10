import AuthController from '#controllers/auth_controller'
import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.post('/login', [AuthController, 'login'])
    router.post('/register', [AuthController, 'register'])
    router.get('/complete-registration/:token', [AuthController, 'confirmRegistration'])
  })
  .prefix('/auth')
