import env from '#start/env'
import Rollbar from 'rollbar'
const rollbar = new Rollbar({
  accessToken: env.get('ROLLBAR_ACCESS_TOKEN'),
  captureUncaught: true,
  captureUnhandledRejections: true,
  environment: env.get('ROLLBAR_ENVIRONMENT'),
  payload: {
    code_version: '1.0.0',
  },
})

export default rollbar
