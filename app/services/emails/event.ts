import mail from '@adonisjs/mail/services/main'
import i18nManager from '@adonisjs/i18n/services/main'

interface VerifyEmailData {
  email: string
  firstName: string
  verificationUrl: string
  locale: string
}

export default class EventEmailService {
  /**
   * Send private activity invitation email
   */
  async sendPrivateActivityInvitationEmail(data: VerifyEmailData) {
    const i18n = i18nManager.locale(data.locale)

    try {
      await mail.use('resend').send((message) => {
        message
          .to(data.email, data.firstName)
          .from('notifications@ticketwaze.com', 'Ticketwaze Notifications')
          .subject(i18n.t('emails.event_invitation.title'))
          .htmlView('emails/global_email_template', {
            title: i18n.t('emails.event_invitation.title'),
            description: i18n.t('emails.event_invitation.description'),
            firstName: data.firstName,
            greetings: i18n.t('emails.event_invitation.greetings'),
            body: i18n.t('emails.event_invitation.body'),
            cta: i18n.t('emails.event_invitation.cta'),
            verificationUrl: data.verificationUrl,
            warning: i18n.t('emails.event_invitation.warning'),
            footer: i18n.t('emails.event_invitation.footer'),
          })
      })

      return { success: true }
    } catch (error) {
      console.error('Failed to send verification email:', error)
      throw error
    }
  }
}
