import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendContactEmail({
  name,
  email,
  content,
}: {
  name: string
  email: string
  content: string
}) {
  const { data, error } = await resend.emails.send({
    from: 'Portfolio <onboarding@resend.dev>',
    to: process.env.EMAIL_TO!,
    subject: `New message from ${name}`,
    replyTo: email,
    html: `
      <div style="font-family: sans-serif; max-width: 600px;">
        <h2>New Contact Form Message</h2>
        <p><strong>From:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <hr />
        <p>${content.replace(/\n/g, '<br />')}</p>
      </div>
    `,
  })

  if (error) {
    console.error('Resend API error:', JSON.stringify(error))
    throw new Error(error.message)
  }

  console.log('Email sent successfully, id:', data?.id)
  return data
}
