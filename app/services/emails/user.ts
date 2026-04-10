import mail from '@adonisjs/mail/services/main'
import i18nManager from '@adonisjs/i18n/services/main'

interface VerifyEmailData {
  email: string
  firstName: string
  verificationUrl: string
  locale: string
}

export default class UserEmailService {
  /**
   * Send verification email
   */
  async sendPasswordChangedEmail(data: VerifyEmailData) {
    const i18n = i18nManager.locale(data.locale)
    try {
      await mail.use('resend').send((message) => {
        message
          .to(data.email, data.firstName)
          .from('auth@ticketwaze.com', 'Ticketwaze')
          .subject(i18n.t('emails.password_changed.title'))
          .htmlView('emails/global_email_template', {
            title: i18n.t('emails.password_changed.title'),
            description: i18n.t('emails.password_changed.description'),
            firstName: data.firstName,
            greetings: i18n.t('emails.password_changed.greetings'),
            body: i18n.t('emails.password_changed.body'),
            cta: i18n.t('emails.password_changed.cta'),
            verificationUrl: data.verificationUrl,
            warning: i18n.t('emails.password_changed.warning'),
            footer: i18n.t('emails.password_changed.footer'),
          })
      })
      return { success: true }
    } catch (error) {
      console.error('Failed to send verification email:', error)
      throw error
    }
  }
}
