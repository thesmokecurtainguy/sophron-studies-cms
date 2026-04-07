import {EnvelopeIcon} from '@sanity/icons'
import {useToast} from '@sanity/ui'
import {useCallback, useState} from 'react'
import {type DocumentActionComponent} from 'sanity'

const SEND_NEWSLETTER_URL = 'https://www.sophronstudies.com/api/send-newsletter'

/**
 * Studio only inlines env vars prefixed with SANITY_STUDIO_ into the browser bundle.
 * Set SANITY_STUDIO_NEWSLETTER_SECRET to match SANITY_NEWSLETTER_SECRET on the API host.
 */
function getNewsletterSecret(): string {
  if (typeof process === 'undefined') return ''
  return (
    process.env.SANITY_STUDIO_NEWSLETTER_SECRET ||
    process.env.SANITY_NEWSLETTER_SECRET ||
    ''
  )
}

export const sendPreviewToResendDocumentAction: DocumentActionComponent = (props) => {
  const {draft, published} = props
  const toast = useToast()
  const [sending, setSending] = useState(false)

  const doc = draft || published
  const campaignId = doc?._id
  const secret = getNewsletterSecret()

  const onHandle = useCallback(() => {
    if (!campaignId || !secret) return
    void (async () => {
      setSending(true)
      try {
        const res = await fetch(SEND_NEWSLETTER_URL, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({campaignId, secret}),
        })
        const text = await res.text()
        if (!res.ok) {
          let description = res.statusText
          try {
            const data = JSON.parse(text) as {error?: string; message?: string}
            description = data.error || data.message || text || description
          } catch {
            if (text) description = text
          }
          toast.push({
            status: 'error',
            title: 'Could not send preview',
            description,
          })
          return
        }
        toast.push({
          status: 'success',
          title: 'Broadcast created in Resend! Go to Resend to preview and send.',
        })
      } catch (err) {
        toast.push({
          status: 'error',
          title: 'Could not send preview',
          description: err instanceof Error ? err.message : String(err),
        })
      } finally {
        setSending(false)
      }
    })()
  }, [campaignId, secret, toast])

  if (!campaignId) {
    return {
      label: 'Send Preview to Resend',
      icon: EnvelopeIcon,
      disabled: true,
      title: 'Save the campaign first so it has a document ID.',
    }
  }

  if (!secret) {
    return {
      label: 'Send Preview to Resend',
      icon: EnvelopeIcon,
      disabled: true,
      title:
        'Set SANITY_STUDIO_NEWSLETTER_SECRET in your Studio .env (browser-safe). Use the same value as SANITY_NEWSLETTER_SECRET on the website API.',
    }
  }

  return {
    label: sending ? 'Sending…' : 'Send Preview to Resend',
    icon: EnvelopeIcon,
    disabled: sending,
    title: 'Send this campaign to the site so a Resend preview broadcast can be created.',
    tone: 'positive',
    onHandle,
  }
}

sendPreviewToResendDocumentAction.displayName = 'SendPreviewToResend'
