import mail from '@adonisjs/mail/services/main'
import i18nManager from '@adonisjs/i18n/services/main'

interface VerifyEmailData {
  email: string
  firstName: string
  verificationUrl: string
  locale: string
}

export default class AuthEmailService {
  /**
   * Send waitlist email
   */
  async sendContactEmail(data: VerifyEmailData) {
    const i18n = i18nManager.locale(data.locale)

    try {
      await mail.use('resend').send((message) => {
        message
          .to(data.email, data.firstName)
          .from('auth@ticketwaze.com', 'Ticketwaze')
          .subject(i18n.t('emails.contact.title'))
          .htmlView('emails/global_email_template', {
            title: i18n.t('emails.contact.title'),
            description: i18n.t('emails.contact.description'),
            firstName: data.firstName,
            greetings: i18n.t('emails.contact.greetings'),
            body: i18n.t('emails.contact.body'),
            cta: i18n.t('emails.contact.cta'),
            verificationUrl: data.verificationUrl,
            warning: i18n.t('emails.contact.warning'),
            footer: i18n.t('emails.contact.footer'),
          })
      })

      return { success: true }
    } catch (error) {
      console.error('Failed to send waitlist email:', error)
      throw error
    }
  }
}
