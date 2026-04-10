import mail from '@adonisjs/mail/services/main'

interface VerifyEmailData {
  email: string
  firstName: string
  verificationUrl: string
}

export default class AuthEmailService {
  /**
   * Send waitlist email
   */
  async sendVerificationEmail(data: VerifyEmailData) {
    try {
      await mail.use('resend').send((message) => {
        message
          .to(data.email, data.firstName)
          .from('auth@messarae.com', 'Onboarding - De vous à moi')
          .subject('Veuillez confirmer votre adresse email')
          .htmlView('emails/auth', {
            firstName: data.firstName,
            verificationUrl: data.verificationUrl,
          })
      })

      return { success: true }
    } catch (error) {
      console.error('Failed to send waitlist email:', error)
      throw error
    }
  }
}
