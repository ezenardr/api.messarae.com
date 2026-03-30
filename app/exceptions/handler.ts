import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import { errors as authErrors } from '@adonisjs/auth'
import { errors as httpErrors } from '@adonisjs/core'
import rollbar from '#services/rollbar'

export default class HttpExceptionHandler extends ExceptionHandler {
  protected debug = !app.inProduction

  /**
   * Error classes that should NOT be reported to Rollbar
   */
  private ignoredErrors = [
    authErrors.E_UNAUTHORIZED_ACCESS,
    httpErrors.E_ROUTE_NOT_FOUND,
    httpErrors.E_CANNOT_LOOKUP_ROUTE,
  ]

  private shouldIgnore(error: unknown): boolean {
    // Ignore known HTTP client errors (4xx) except for unexpected ones
    if (error instanceof Error && 'status' in error) {
      const status = (error as any).status as number
      if (status >= 400 && status < 500) return true
    }

    // Ignore specific error classes
    return this.ignoredErrors.some((ErrorClass) => error instanceof ErrorClass)
  }

  async handle(error: unknown, ctx: HttpContext) {
    return super.handle(error, ctx)
  }

  async report(error: unknown, ctx: HttpContext) {
    if (!this.shouldIgnore(error)) {
      rollbar.error(error as Error, {
        request: {
          url: ctx.request.url(),
          method: ctx.request.method(),
          headers: ctx.request.headers(),
          body: ctx.request.body(),
        },
        user: ctx.auth?.user ?? undefined,
      })
    }

    return super.report(error, ctx)
  }
}
