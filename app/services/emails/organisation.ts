import mail from '@adonisjs/mail/services/main'
import i18nManager from '@adonisjs/i18n/services/main'
import Organisation from '#models/organisation'

interface OrganisationEmailData {
  email: string
  firstName: string
  verificationUrl: string
  locale: string
  organisation: Organisation
}

export default class OrganisationEmailService {
  async sendOrganisationInvitation(data: OrganisationEmailData) {
    const i18n = i18nManager.locale(data.locale)
    try {
      await mail.use('resend').send((message) => {
        message
          .to(data.email, data.firstName)
          .from('organisation@ticketwaze.com', 'Organisation - Ticketwaze')
          .subject(i18n.t('emails.add_member.title'))
          .htmlView('emails/global_email_template', {
            title: data.organisation.organisationName,
            description: i18n.t('emails.add_member.description'),
            firstName: data.firstName,
            greetings: i18n.t('emails.add_member.greetings'),
            body: i18n.t('emails.add_member.body'),
            cta: i18n.t('emails.add_member.cta'),
            verificationUrl: data.verificationUrl,
            warning: i18n.t('emails.add_member.warning'),
            footer: i18n.t('emails.add_member.footer'),
          })
      })
      return { success: true }
    } catch (error) {
      console.error('Failed to send email: sendOrganisationInvitation:', error)
      throw error
    }
  }

  async sendOrganisationRemoveInvitation(data: OrganisationEmailData) {
    const i18n = i18nManager.locale(data.locale)
    try {
      await mail.use('resend').send((message) => {
        message
          .to(data.email, data.firstName)
          .from('organisation@ticketwaze.com', 'Organisation - Ticketwaze')
          .subject(i18n.t('emails.remove_invitation.title'))
          .htmlView('emails/global_email_template', {
            title: data.organisation.organisationName,
            description: i18n.t('emails.remove_invitation.description'),
            firstName: data.firstName,
            greetings: i18n.t('emails.remove_invitation.greetings'),
            body: i18n.t('emails.remove_invitation.body'),
            cta: i18n.t('emails.remove_invitation.cta'),
            verificationUrl: data.verificationUrl,
            warning: i18n.t('emails.remove_invitation.warning'),
            footer: i18n.t('emails.remove_invitation.footer'),
          })
      })
      return { success: true }
    } catch (error) {
      console.error('Failed to send email: sendOrganisationRemoveInvitation:', error)
      throw error
    }
  }

  async sendOrganisationRemoveMember(data: OrganisationEmailData) {
    const i18n = i18nManager.locale(data.locale)
    try {
      await mail.use('resend').send((message) => {
        message
          .to(data.email, data.firstName)
          .from('organisation@ticketwaze.com', 'Organisation - Ticketwaze')
          .subject(i18n.t('emails.remove_member.title'))
          .htmlView('emails/global_email_template', {
            title: data.organisation.organisationName,
            description: i18n.t('emails.remove_member.description'),
            firstName: data.firstName,
            greetings: i18n.t('emails.remove_member.greetings'),
            body: i18n.t('emails.remove_member.body'),
            cta: i18n.t('emails.remove_member.cta'),
            verificationUrl: data.verificationUrl,
            warning: i18n.t('emails.remove_member.warning'),
            footer: i18n.t('emails.remove_member.footer'),
          })
      })
      return { success: true }
    } catch (error) {
      console.error('Failed to send email: sendOrganisationRemoveMember:', error)
      throw error
    }
  }

  async sendPinCreatedEmail(data: OrganisationEmailData) {
    const i18n = i18nManager.locale(data.locale)
    try {
      await mail.use('resend').send((message) => {
        message
          .to(data.email, data.firstName)
          .from('organisation@ticketwaze.com', 'Organisation - Ticketwaze')
          .subject(i18n.t('emails.create_pin.title'))
          .htmlView('emails/global_email_template', {
            title: data.organisation.organisationName,
            description: i18n.t('emails.create_pin.description'),
            firstName: data.firstName,
            greetings: i18n.t('emails.create_pin.greetings'),
            body: i18n.t('emails.create_pin.body'),
            cta: i18n.t('emails.create_pin.cta'),
            verificationUrl: data.verificationUrl,
            warning: i18n.t('emails.create_pin.warning'),
            footer: i18n.t('emails.create_pin.footer'),
          })
      })
      return { success: true }
    } catch (error) {
      console.error('Failed to send email: sendPinCreatedEmail:', error)
      throw error
    }
  }

  async sendChangePinEmail(data: OrganisationEmailData) {
    const i18n = i18nManager.locale(data.locale)
    try {
      await mail.use('resend').send((message) => {
        message
          .to(data.email, data.firstName)
          .from('organisation@ticketwaze.com', 'Organisation - Ticketwaze')
          .subject(i18n.t('emails.change_pin.title'))
          .htmlView('emails/global_email_template', {
            title: data.organisation.organisationName,
            description: i18n.t('emails.change_pin.description'),
            firstName: data.firstName,
            greetings: i18n.t('emails.change_pin.greetings'),
            body: i18n.t('emails.change_pin.body'),
            cta: i18n.t('emails.change_pin.cta'),
            verificationUrl: data.verificationUrl,
            warning: i18n.t('emails.change_pin.warning'),
            footer: i18n.t('emails.change_pin.footer'),
          })
      })
      return { success: true }
    } catch (error) {
      console.error('Failed to send email: sendChangePinEmail:', error)
      throw error
    }
  }

  async sendNewPinEmail(data: OrganisationEmailData) {
    const i18n = i18nManager.locale(data.locale)
    try {
      await mail.use('resend').send((message) => {
        message
          .to(data.email, data.firstName)
          .from('organisation@ticketwaze.com', 'Organisation - Ticketwaze')
          .subject(i18n.t('emails.new_pin.title'))
          .htmlView('emails/global_email_template', {
            title: data.organisation.organisationName,
            description: i18n.t('emails.new_pin.description'),
            firstName: data.firstName,
            greetings: i18n.t('emails.new_pin.greetings'),
            body: i18n.t('emails.new_pin.body'),
            cta: i18n.t('emails.new_pin.cta'),
            verificationUrl: data.verificationUrl,
            warning: i18n.t('emails.new_pin.warning'),
            footer: i18n.t('emails.new_pin.footer'),
          })
      })
      return { success: true }
    } catch (error) {
      console.error('Failed to send email: sendNewPinEmail:', error)
      throw error
    }
  }

  async sendWithdrawalRequestEmail(data: OrganisationEmailData) {
    const i18n = i18nManager.locale(data.locale)
    try {
      await mail.use('resend').send((message) => {
        message
          .to(data.email, data.firstName)
          .from('organisation@ticketwaze.com', 'Organisation - Ticketwaze')
          .subject(i18n.t('emails.new_withdrawal.title'))
          .htmlView('emails/global_email_template', {
            title: i18n.t('emails.new_withdrawal.title'),
            description: i18n.t('emails.new_withdrawal.description'),
            firstName: data.firstName,
            greetings: i18n.t('emails.new_withdrawal.greetings'),
            body: i18n.t('emails.new_withdrawal.body'),
            cta: i18n.t('emails.new_withdrawal.cta'),
            verificationUrl: data.verificationUrl,
            warning: i18n.t('emails.new_withdrawal.warning'),
            footer: i18n.t('emails.new_withdrawal.footer'),
          })
      })
      return { success: true }
    } catch (error) {
      console.error('Failed to send email: sendWithdrawalRequestEmail:', error)
      throw error
    }
  }
}
